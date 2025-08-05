import { Metadata } from 'next';

export const baseMetadata: Metadata = {
  title: {
    template: '%s | LogoGen',
    default: 'LogoGen - Professional Logo Generator',
  },
  description: 'Create professional logos in minutes with our easy-to-use online logo maker. Choose from multiple templates, customize with professional tools, and download in high resolution.',
  keywords: [
    'logo maker',
    'logo generator',
    'professional logo',
    'business logo',
    'logo design',
    'custom logo',
    'online logo creator',
    'brand identity',
    'logo templates',
    'graphic design'
  ],
  authors: [{ name: 'LogoGen Team' }],
  creator: 'LogoGen',
  publisher: 'LogoGen',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'LogoGen - Professional Logo Generator',
    description: 'Create professional logos in minutes with our easy-to-use online logo maker.',
    siteName: 'LogoGen',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'LogoGen Logo Maker Preview'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LogoGen - Professional Logo Generator',
    description: 'Create professional logos in minutes with our easy-to-use online logo maker.',
    images: ['/twitter-image.png']
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6'
};
