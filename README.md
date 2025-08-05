# LogoGen - Professional Logo Generator MVP

A modern, responsive logo generator web application that allows users to create professional logos quickly and purchase high-resolution downloads.

![LogoGen Screenshot](https://github.com/user-attachments/assets/9aba124c-9246-4e0a-8f9d-bf80f03c5808)

## 🚀 Features

### Core Features
- **Logo Generation Engine**: Text input for business name and tagline with real-time preview
- **Template Selection**: 8 professional logo templates across different industries
- **Customization Interface**: 
  - Color palette selection with predefined palettes
  - Font selection from 8 professional fonts
  - Real-time logo preview
- **Export System**: 
  - Free preview with watermark
  - High-resolution PNG/JPG export (300 DPI)
  - Vector SVG files (premium package)
  - Commercial license included

### Templates Included
1. **Modern Minimalist** - Clean typography with geometric shapes
2. **Tech Startup** - Bold sans-serif with tech aesthetic
3. **Restaurant & Food** - Script fonts with food industry appeal
4. **Fitness & Health** - Strong fonts with health focus
5. **Creative & Design** - Artistic fonts with creative elements
6. **Corporate & Professional** - Classic fonts for business
7. **E-commerce & Retail** - Friendly fonts for retail
8. **Beauty & Wellness** - Elegant fonts for spa/beauty

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Headless UI patterns
- **Icons**: Lucide React
- **Canvas**: Fabric.js (dynamically loaded)

### Backend & Services (Ready for Production)
- **Hosting**: Firebase Hosting
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth
- **Payments**: Stripe Checkout
- **Functions**: Firebase Functions
- **Email**: Firebase Functions + SendGrid/Resend

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase CLI (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd logogen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
```

## 💰 Pricing

- **Standard Package**: $19
  - High-resolution PNG (300 DPI)
  - High-resolution JPG (300 DPI)
  - Transparent background version
  - Commercial license
  - Email delivery

- **Premium Package**: $39
  - Everything in Standard
  - Vector SVG file
  - Multiple color variations
  - Different size variations
  - Priority email support

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly on desktop, tablet, and mobile devices.

## 🔒 Security

- Firestore security rules restrict access to user's own orders
- Storage rules protect generated files
- Stripe handles secure payment processing
- Environment variables protect sensitive keys

---

Built with ❤️ using Next.js, Firebase, and Stripe
