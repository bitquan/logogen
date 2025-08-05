export interface LogoFile {
  type: 'PNG' | 'JPG' | 'SVG';
  name: string;
  url: string;
  size: string;
  path?: string;
}

export interface OrderDetails {
  id: string;
  packageId: 'standard' | 'premium';
  status: 'processing' | 'complete' | 'failed';
  customerEmail: string;
  businessName: string;
  purchaseDate: string;
  logoFiles: LogoFile[];
  paymentDetails: {
    amount: number;
    currency: string;
    paymentIntent: string;
  };
}
