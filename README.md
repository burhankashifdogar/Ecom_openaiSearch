# IntelliBuy - AI-Enhanced E-Commerce Platform

<div align="center">
  <img src="/public/icons/icon-512x512.png" alt="IntelliBuy Logo" width="120" />
  <h3>Smart Shopping, Powered by AI</h3>
</div>

## 📋 Overview

IntelliBuy is a modern, AI-powered e-commerce platform built with Next.js 14, React, and Tailwind CSS. It offers intelligent product recommendations, natural language search capabilities, and a seamless shopping experience across all devices.

![IntelliBuy Screenshot](/public/screenshots/homepage.png)

## 🌟 Features

### Customer Features

- **AI-Powered Search**: Natural language processing for intuitive product discovery
- **Image Search**: Find products by uploading images
- **Personalized Recommendations**: AI-generated product suggestions based on browsing history
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **PWA Support**: Install as a native app on supported devices
- **Dark/Light Mode**: Choose your preferred theme
- **User Authentication**: Secure login with email/password or social providers
- **Order Management**: Track and manage your orders
- **Wishlist**: Save products for later
- **Shopping Cart**: Seamless checkout experience

### Admin Features

- **Dashboard**: Overview of store performance
- **Advanced Analytics**: Detailed insights into user behavior and sales
- **Product Management**: Add, edit, and remove products
- **Order Management**: Process and track customer orders
- **User Management**: View and manage customer accounts
- **Category Management**: Organize products effectively

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

### Installation

1. Clone the repository
   \`\`\`bash
   git clone https://github.com/yourusername/intellibuy.git
   cd intellibuy
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install

# or

yarn install
\`\`\`

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:

\`\`\`

# Authentication

NEXTAUTH_SECRET=your-nextauth-secret-key-at-least-32-chars
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database

DATABASE_URL=your-database-connection-string

# AI Services

OPENAI_API_KEY=your-openai-api-key

# Payment Processing

STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email Service

EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email-username
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM=noreply@intellibuy.com

# Analytics

GOOGLE_ANALYTICS_ID=your-ga-id

# Cloud Storage

CLOUD_STORAGE_KEY=your-cloud-storage-key
CLOUD_STORAGE_SECRET=your-cloud-storage-secret
CLOUD_STORAGE_BUCKET=your-bucket-name

# PWA

NEXT_PUBLIC_SITE_URL=https://intellibuy.com
\`\`\`

4. Run the development server
   \`\`\`bash
   npm run dev

# or

yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 PWA Installation

IntelliBuy is a Progressive Web App that can be installed on various devices:

1. Visit the website in a supported browser (Chrome, Edge, Safari, etc.)
2. Look for the install prompt or use the browser's menu to "Install" or "Add to Home Screen"
3. Once installed, the app will be available from your device's home screen or app drawer

## 🧩 Project Structure

\`\`\`
intellibuy/
├── app/ # Next.js App Router
│ ├── admin/ # Admin dashboard pages
│ ├── api/ # API routes
│ ├── products/ # Product pages
│ ├── cart/ # Shopping cart
│ ├── checkout/ # Checkout process
│ ├── account/ # User account
│ └── ...
├── components/ # React components
│ ├── admin/ # Admin components
│ ├── analytics/ # Analytics components
│ ├── ui/ # UI components (shadcn/ui)
│ └── ...
├── lib/ # Utility functions and services
│ ├── services/ # Service layer
│ ├── ai.ts # AI functionality
│ ├── auth.ts # Authentication
│ └── db.ts # Database connection
├── public/ # Static assets
│ └── icons/ # PWA icons
└── ...
\`\`\`

## 🛠️ Technologies Used

- **Frontend**: Next.js 14, React 18, Tailwind CSS, shadcn/ui
- **Authentication**: NextAuth.js
- **AI**: OpenAI API
- **State Management**: React Context
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Visx (for analytics)
- **PWA**: Next PWA

## 💻 Development

### Building for Production

\`\`\`bash
npm run build

# or

yarn build
\`\`\`

### Running in Production Mode

\`\`\`bash
npm start

# or

yarn start
\`\`\`

### Linting

\`\`\`bash
npm run lint

# or

yarn lint
\`\`\`

## 🔄 Database Setup

IntelliBuy uses a PostgreSQL database. You can set up the database using the following steps:

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env.local` file
3. Run the database migrations:

\`\`\`bash
npx prisma migrate dev

# or

yarn prisma migrate dev
\`\`\`

4. Seed the database with initial data:

\`\`\`bash
npx prisma db seed

# or

yarn prisma db seed
\`\`\`

## 🧪 Testing

\`\`\`bash
npm run test

# or

yarn test
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [OpenAI](https://openai.com/)

## 📞 Support

For support open an issue in the GitHub repository.
