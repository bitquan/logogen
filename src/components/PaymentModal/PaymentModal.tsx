'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import stripePromise from '@/lib/stripe';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  logoData: any;
  canvas: any;
}

const packages = [
  {
    id: 'standard',
    name: 'Standard Package',
    price: 19,
    features: [
      'High-resolution PNG (300 DPI)',
      'High-resolution JPG (300 DPI)',
      'Transparent background version',
      'Commercial license included',
      'Email delivery'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Package',
    price: 39,
    popular: true,
    features: [
      'Everything in Standard',
      'Vector SVG file',
      'Multiple color variations',
      'Different size variations',
      'Priority email support'
    ]
  }
];

export default function PaymentModal({ isOpen, onClose, logoData, canvas }: PaymentModalProps) {
  const [selectedPackage, setSelectedPackage] = useState('premium');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setLoading(true);
    
    try {
      // For demo purposes, simulate the checkout process
      // In production, this would create a Stripe checkout session via Firebase Functions
      
      alert(`This is a demo! In production, you would be redirected to Stripe checkout for the ${packages.find(p => p.id === selectedPackage)?.name} at $${packages.find(p => p.id === selectedPackage)?.price}.`);
      
      // Simulate successful payment after 2 seconds
      setTimeout(() => {
        window.location.href = `/download?session_id=demo_session_${Date.now()}`;
      }, 2000);
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

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

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : `Purchase ${packages.find(p => p.id === selectedPackage)?.name} - $${packages.find(p => p.id === selectedPackage)?.price}`}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Secure payment powered by Stripe. Files will be delivered to your email within minutes.
          </p>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> This is a demonstration version. In production, this would redirect to Stripe checkout for real payments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}