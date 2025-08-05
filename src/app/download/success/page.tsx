'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Download, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface DownloadInfo {
  id: string;
  packageId: string;
  status: 'complete' | 'processing';
  customerEmail: string;
  businessName: string;
  logoFiles: Array<{
    type: string;
    name: string;
    url: string;
    size: string;
  }>;
}

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      if (!sessionId) {
        setError('Invalid session ID');
        setLoading(false);
        return;
      }
      
      try {
        // Fetch payment details from our API
        const response = await fetch(`/api/checkout-success?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch payment details');
        }
        
        const data = await response.json();
        setDownloadInfo(data);
      } catch (error) {
        console.error('Error fetching payment info:', error);
        setError('Failed to load your downloads. Please contact support.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentInfo();
  }, [sessionId]);
  
  // Mock download info for now - in production this would come from the API
  useEffect(() => {
    if (!loading && !downloadInfo && !error) {
      // Create mock data for demonstration
      const mockDownloadInfo: DownloadInfo = {
        id: sessionId || 'mock_session',
        packageId: 'premium',
        status: 'complete',
        customerEmail: 'customer@example.com',
        businessName: 'Your Business',
        logoFiles: [
          {
            type: 'PNG',
            name: 'your-business-logo-large.png',
            url: '#', // This would be a real download URL in production
            size: '2.4 MB'
          },
          {
            type: 'PNG',
            name: 'your-business-logo-medium.png',
            url: '#',
            size: '1.2 MB'
          },
          {
            type: 'PNG',
            name: 'your-business-logo-small.png',
            url: '#',
            size: '0.5 MB'
          },
          {
            type: 'JPG',
            name: 'your-business-logo.jpg',
            url: '#',
            size: '1.8 MB'
          },
          {
            type: 'SVG',
            name: 'your-business-logo.svg',
            url: '#',
            size: '45 KB'
          }
        ]
      };
      
      setDownloadInfo(mockDownloadInfo);
    }
  }, [loading, downloadInfo, error, sessionId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">Loading your downloads...</h2>
          <p className="mt-2 text-gray-600">Please wait while we prepare your logo files.</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md text-center">
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-red-100 text-red-600 mx-auto">
            <span className="text-2xl">!</span>
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">Something went wrong</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <Link href="/" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <div className="rounded-full h-16 w-16 flex items-center justify-center bg-green-100 text-green-600 mx-auto">
            <CheckCircle size={32} />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your purchase. Your logo files are ready to download.
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Order confirmation sent to: {downloadInfo?.customerEmail}
          </div>
        </div>
        
        <div className="border-t border-b border-gray-200 py-6 my-6">
          <h2 className="text-xl font-semibold mb-4">Your Logo Files</h2>
          
          <div className="space-y-4">
            {downloadInfo?.logoFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded">
                    <span className="font-mono font-bold">{file.type}</span>
                  </div>
                  <div className="ml-4">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-500">{file.size}</div>
                  </div>
                </div>
                <a 
                  href={file.url} 
                  download={file.name}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                  onClick={(e) => {
                    // In demo mode, prevent actual download attempt
                    if (file.url === '#') {
                      e.preventDefault();
                      alert('This is a demo. In production, this would download the actual file.');
                    }
                  }}
                >
                  <Download size={16} />
                  Download
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800">All files include:</h3>
              <ul className="mt-2 space-y-1 text-sm text-blue-700">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  Commercial usage license
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  High-resolution quality
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  Transparent background (PNG/SVG)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  Multiple size variations
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" />
            Create Another Logo
          </Link>
          
          <div className="flex items-center text-sm text-gray-500">
            <Shield size={16} className="mr-1" />
            Secured by Stripe • Purchase ID: {downloadInfo?.id.substring(0, 8)}...
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help with your logo? <a href="mailto:support@logogen.com" className="text-blue-600 hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
}
