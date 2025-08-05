import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import * as sharp from 'sharp';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2024-12-18.acacia',
});

// Stripe webhook handler
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = functions.config().stripe.webhook_secret;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleSuccessfulPayment(session);
  }

  res.json({ received: true });
});

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    const metadata = session.metadata!;
    const logoData = {
      businessName: metadata.businessName,
      tagline: metadata.tagline,
      primaryColor: metadata.primaryColor,
      secondaryColor: metadata.secondaryColor,
      fontFamily: metadata.fontFamily,
    };

    // Generate logo files
    const files = await generateLogoFiles(logoData, metadata.packageType);
    
    // Upload to Firebase Storage
    const downloadLinks = await uploadFiles(files, session.id);
    
    // Save order to Firestore
    await admin.firestore().collection('orders').doc(session.id).set({
      sessionId: session.id,
      customerEmail: session.customer_details?.email,
      logoData,
      packageType: metadata.packageType,
      amount: session.amount_total,
      downloadLinks,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'completed'
    });

    // Send email with download links
    if (session.customer_details?.email) {
      await sendDownloadEmail(session.customer_details.email, logoData, downloadLinks);
    }

  } catch (error) {
    console.error('Error processing payment:', error);
  }
}

async function generateLogoFiles(logoData: any, packageType: string) {
  const files: { [key: string]: Buffer } = {};
  
  // Create base SVG
  const svgContent = createSVG(logoData);
  
  // PNG with transparent background
  files.png = await sharp(Buffer.from(svgContent))
    .png({ quality: 100 })
    .resize(1200, 800)
    .toBuffer();
    
  // JPG with white background
  files.jpg = await sharp(Buffer.from(svgContent))
    .jpeg({ quality: 95 })
    .resize(1200, 800)
    .flatten({ background: '#ffffff' })
    .toBuffer();

  // SVG for premium package
  if (packageType === 'premium') {
    files.svg = Buffer.from(svgContent);
  }

  return files;
}

function createSVG(logoData: any): string {
  const { businessName, tagline, primaryColor, secondaryColor, fontFamily } = logoData;
  
  return `
    <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="transparent"/>
      <text x="600" y="350" 
            font-family="${fontFamily}, Arial, sans-serif" 
            font-size="64" 
            font-weight="bold" 
            fill="${primaryColor}" 
            text-anchor="middle">
        ${businessName}
      </text>
      ${tagline ? `
        <text x="600" y="420" 
              font-family="${fontFamily}, Arial, sans-serif" 
              font-size="24" 
              fill="${secondaryColor}" 
              text-anchor="middle">
          ${tagline}
        </text>
      ` : ''}
    </svg>
  `;
}

async function uploadFiles(files: { [key: string]: Buffer }, sessionId: string) {
  const bucket = admin.storage().bucket();
  const downloadLinks: { [key: string]: string } = {};

  for (const [type, buffer] of Object.entries(files)) {
    const fileName = `logos/${sessionId}/logo.${type}`;
    const file = bucket.file(fileName);
    
    await file.save(buffer, {
      metadata: {
        contentType: type === 'svg' ? 'image/svg+xml' : `image/${type}`,
      },
    });

    // Make file publicly accessible
    await file.makePublic();
    downloadLinks[type] = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  }

  return downloadLinks;
}

async function sendDownloadEmail(email: string, logoData: any, downloadLinks: any) {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: functions.config().email.user,
      pass: functions.config().email.password,
    },
  });

  const mailOptions = {
    from: 'LogoGen <noreply@logogen.com>',
    to: email,
    subject: `Your Logo Files for ${logoData.businessName}`,
    html: `
      <h2>Your Logo is Ready!</h2>
      <p>Thank you for using LogoGen. Your professional logo files are attached and ready for download.</p>
      
      <h3>Download Links:</h3>
      <ul>
        ${downloadLinks.png ? `<li><a href="${downloadLinks.png}">Download PNG (High Resolution)</a></li>` : ''}
        ${downloadLinks.jpg ? `<li><a href="${downloadLinks.jpg}">Download JPG (High Resolution)</a></li>` : ''}
        ${downloadLinks.svg ? `<li><a href="${downloadLinks.svg}">Download SVG (Vector)</a></li>` : ''}
      </ul>
      
      <p>These links will be valid for 30 days. Commercial license is included with your purchase.</p>
      
      <p>If you have any questions, please contact us at support@logogen.com</p>
      
      <p>Best regards,<br>The LogoGen Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// API endpoint to get order status
export const getOrderStatus = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  const sessionId = req.query.session_id as string;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' });
  }

  try {
    const orderDoc = await admin.firestore().collection('orders').doc(sessionId).get();
    
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderDoc.data();
    res.json(orderData);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});