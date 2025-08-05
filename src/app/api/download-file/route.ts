import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');
    const type = searchParams.get('type');
    const sessionId = searchParams.get('session');
    
    if (!file || !type || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Verify the session exists and payment was successful
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Invalid or unpaid session' },
        { status: 403 }
      );
    }
    
    // Check if the order exists in Firestore
    const orderRef = doc(db, 'orders', sessionId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Get the order data
    const orderData = orderDoc.data();
    
    // Check if the requested file is valid for this order
    const fileInfo = orderData.logoFiles.find(
      (f: any) => f.name.includes(file) && f.type.toLowerCase() === type.toUpperCase()
    );
    
    if (!fileInfo) {
      return NextResponse.json(
        { error: 'File not found in order' },
        { status: 404 }
      );
    }
    
    // In a real implementation, we would generate the logo file dynamically
    // or retrieve it from Firebase Storage
    
    try {
      // Example: Get file from Firebase Storage
      const storage = getStorage();
      const fileRef = ref(storage, `orders/${sessionId}/${fileInfo.name}`);
      const downloadUrl = await getDownloadURL(fileRef);
      
      // Redirect to the download URL
      return NextResponse.redirect(downloadUrl);
    } catch (storageError) {
      console.error('Storage error:', storageError);
      
      // For demo purposes, create a mock file
      // In production, this would fetch the actual file from storage
      
      // Generate a placeholder SVG
      const businessName = orderData.businessName || 'Business';
      const placeholderSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
          <rect width="500" height="500" fill="#f0f0f0"/>
          <text x="250" y="250" font-family="Arial" font-size="24" text-anchor="middle" fill="#333">
            ${businessName} Logo
          </text>
          <text x="250" y="280" font-family="Arial" font-size="14" text-anchor="middle" fill="#666">
            ${type.toUpperCase()} Version
          </text>
        </svg>
      `;
      
      // Set content type based on file type
      let contentType = 'image/svg+xml';
      if (type === 'png') {
        contentType = 'image/png';
      } else if (type === 'jpg') {
        contentType = 'image/jpeg';
      }
      
      // Return the placeholder as the response
      return new NextResponse(placeholderSvg, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${fileInfo.name}"`,
        },
      });
    }
    
  } catch (error) {
    console.error('Error downloading file:', error);
    
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}
