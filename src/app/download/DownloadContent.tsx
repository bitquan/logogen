'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Download, CheckCircle } from 'lucide-react';

export default function DownloadContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      // For demo purposes, simulate order data
      setTimeout(() => {
        setOrderData({
          sessionId,
          logoData: {
            businessName: 'Demo Business',
            tagline: 'Your Success Starts Here',
            primaryColor: '#3b82f6',
            secondaryColor: '#1f2937',
            fontFamily: 'Inter'
          },
          packageType: 'premium',
          amount: 3900,
          downloadLinks: {
            png: '#demo-png',
            jpg: '#demo-jpg',
            svg: '#demo-svg'
          },
          status: 'completed'
        });
        setLoading(false);
      }, 1500);
    } else {
      setError('Invalid session ID');
      setLoading(false);
    }
  }, [sessionId]);

  const handleDownload = (fileType: string) => {
    // For demo purposes, show alert
    alert(`This is a demo! In production, this would download the ${fileType.toUpperCase()} file.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <a href="/" className="text-blue-600 hover:underline">
            Return to homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Complete!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your logo files are ready for download.
            </p>
          </div>

          {/* Demo Notice */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Demo Mode Notice:</h3>
            <p className="text-sm text-blue-800">
              This is a demonstration version. In production, this page would show real download links for your purchased logo files.
            </p>
          </div>

          {/* Order Details */}
          {orderData && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Business Name:</span>
                    <div className="text-gray-600">{orderData.logoData.businessName}</div>
                  </div>
                  {orderData.logoData.tagline && (
                    <div>
                      <span className="font-medium">Tagline:</span>
                      <div className="text-gray-600">{orderData.logoData.tagline}</div>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Package:</span>
                    <div className="text-gray-600 capitalize">{orderData.packageType}</div>
                  </div>
                  <div>
                    <span className="font-medium">Amount Paid:</span>
                    <div className="text-gray-600">${(orderData.amount / 100).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logo Preview */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Your Logo</h2>
            <div className="inline-block p-6 border rounded-lg bg-gray-50">
              <div 
                className="text-2xl font-bold mb-2"
                style={{ 
                  fontFamily: orderData?.logoData?.fontFamily,
                  color: orderData?.logoData?.primaryColor 
                }}
              >
                {orderData?.logoData?.businessName}
              </div>
              {orderData?.logoData?.tagline && (
                <div 
                  className="text-lg"
                  style={{ 
                    fontFamily: orderData?.logoData?.fontFamily,
                    color: orderData?.logoData?.secondaryColor 
                  }}
                >
                  {orderData.logoData.tagline}
                </div>
              )}
            </div>
          </div>

          {/* Download Links */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Download Your Files</h2>
            
            <div className="grid gap-3">
              <button
                onClick={() => handleDownload('png')}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">High-Resolution PNG</div>
                    <div className="text-sm text-gray-500">300 DPI, transparent background</div>
                  </div>
                </div>
                <span className="text-blue-600 font-medium">Download</span>
              </button>

              <button
                onClick={() => handleDownload('jpg')}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">High-Resolution JPG</div>
                    <div className="text-sm text-gray-500">300 DPI, white background</div>
                  </div>
                </div>
                <span className="text-blue-600 font-medium">Download</span>
              </button>

              {orderData?.packageType === 'premium' && (
                <button
                  onClick={() => handleDownload('svg')}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">Vector SVG File</div>
                      <div className="text-sm text-gray-500">Scalable vector format</div>
                    </div>
                  </div>
                  <span className="text-blue-600 font-medium">Download</span>
                </button>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Important Notes:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Files will also be sent to your email address</li>
              <li>• Download links are valid for 30 days</li>
              <li>• Commercial license is included with your purchase</li>
              <li>• For support, contact us at support@logogen.com</li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Another Logo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}