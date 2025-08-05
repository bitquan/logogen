'use client';

import { useState } from 'react';
import { X, Check, CreditCard, Shield } from 'lucide-react';
import stripePromise from '@/lib/stripe';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  logoData: any;
  canvas: any;
  onSuccess?: (plan: string) => void;
}

const packages = [
  {
    id: 'standard',
    name: 'Standard Package',
    price: 1.99,
    stripePriceId: 'price_1RrlFNGfifgfmytpKJh8dN2n',
    features: [
      'High-resolution PNG (300 DPI)',
      'High-resolution JPG (300 DPI)', 
      'Transparent background version',
      'No watermark',
      'Commercial license included',
      'Email delivery'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Package',
    price: 4.99,
    stripePriceId: 'price_2RrlFNGfifgfmytpLMn9kP3q',
    popular: true,
    features: [
      'Everything in Standard',
      'Vector SVG file',
      'Multiple format exports (PNG, JPG, SVG)',
      'Multiple size variations',
      'Bulk export feature',
      'Priority email support',
      'Commercial license'
    ]
  }
];

export default function PaymentModal({ isOpen, onClose, logoData, canvas, onSuccess }: PaymentModalProps) {
  const [selectedPackage, setSelectedPackage] = useState('premium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const selectedPkg = packages.find(p => p.id === selectedPackage);
      if (!selectedPkg) throw new Error('Package not found');

      // Create checkout session via API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: selectedPkg.stripePriceId,
          packageId: selectedPackage,
          logoData: {
            businessName: logoData.businessName,
            tagline: logoData.tagline,
            fontFamily: logoData.fontFamily,
            primaryColor: logoData.primaryColor,
            secondaryColor: logoData.secondaryColor,
          },
          canvasData: canvas ? canvas.toJSON() : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const selectedPkg = packages.find(p => p.id === selectedPackage);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Package</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Remove watermarks and get high-resolution downloads</p>
        </div>

        <div className="p-6">
          {/* Logo Preview */}
          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Your Logo Preview</h3>
            <div className="inline-block p-4 border rounded-lg bg-gray-50">
              <div className="text-xl font-bold" style={{ fontFamily: logoData.fontFamily, color: logoData.primaryColor }}>
                {logoData.businessName}
              </div>
              {logoData.tagline && (
                <div className="text-sm" style={{ fontFamily: logoData.fontFamily, color: logoData.secondaryColor }}>
                  {logoData.tagline}
                </div>
              )}
            </div>
          </div>

          {/* Package Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`p-6 border rounded-lg cursor-pointer transition-all relative ${
                  selectedPackage === pkg.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${pkg.popular ? 'ring-2 ring-blue-200' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-blue-600">${pkg.price}</div>
                  <div className="text-sm text-gray-500">One-time payment</div>
                </div>

                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Purchase {selectedPkg?.name} - ${selectedPkg?.price}
              </>
            )}
          </button>

          {/* Security Notice */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield size={16} />
            <span>Secure payment powered by Stripe</span>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-2">
            Files will be delivered to your email within minutes after payment.
          </p>

          {/* Value Proposition */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Why upgrade?</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>✓ Remove "LogoGen" watermark</li>
              <li>✓ Professional print quality (300 DPI)</li>
              <li>✓ Multiple file formats</li>
              <li>✓ Commercial license included</li>
              <li>✓ Instant download after payment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}