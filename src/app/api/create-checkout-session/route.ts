import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, packageId, logoData, canvasData } = body;

    // Create metadata to store logo information
    const metadata = {
      package_id: packageId,
      business_name: logoData.businessName || '',
      tagline: logoData.tagline || '',
      font_family: logoData.fontFamily || '',
      primary_color: logoData.primaryColor || '',
      secondary_color: logoData.secondaryColor || '',
      canvas_data: canvasData ? JSON.stringify(canvasData).substring(0, 500) : '', // Stripe metadata has limits
    };

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageId === 'standard' ? 'Standard Logo Package' : 'Premium Logo Package',
              description: packageId === 'standard' 
                ? 'High-resolution logo files with commercial license'
                : 'Premium logo package with multiple formats and priority support',
              images: [], // You can add logo preview images here
            },
            unit_amount: packageId === 'standard' ? 199 : 499, // Amount in cents (1.99 or 4.99)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/download/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/?cancelled=true`,
      metadata,
      customer_email: undefined, // Let customer enter email
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      shipping_address_collection: undefined,
      automatic_tax: {
        enabled: false, // Enable if you want automatic tax calculation
      },
    });

    return NextResponse.json({ sessionId: session.id });
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
