import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LogoGen - Professional Logo Generator",
  description: "Create professional logos in minutes. Generate, customize, and download high-quality logos for your business.",
  keywords: "logo generator, logo maker, logo design, business logo, professional logo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Roboto:wght@400;500;700&family=Montserrat:wght@400;600;700&family=Poppins:wght@400;600;700&family=Nunito:wght@400;600;700&family=Playfair+Display:wght@400;600;700&family=Cormorant+Garamond:wght@400;600;700&family=Dancing+Script:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}
