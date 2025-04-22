# IntelliBuy - AI-Enhanced E-Commerce Platform

IntelliBuy is a modern, AI-powered e-commerce platform built with Next.js, React, and Tailwind CSS. It features intelligent product recommendations, advanced search capabilities, and a responsive, mobile-friendly design.

![IntelliBuy Screenshot](./public/screenshots/desktop-home.png)

## 🌟 Features

- **AI-Powered Recommendations**: Personalized product suggestions based on user behavior
- **Intelligent Search**: Natural language search with image search capabilities
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Dark Mode Support**: Seamless switching between light and dark themes
- **PWA Support**: Installable as a Progressive Web App for offline access
- **User Authentication**: Secure login and registration system
- **Shopping Cart**: Persistent cart functionality
- **Wishlist**: Save products for later
- **Admin Dashboard**: Comprehensive admin interface with analytics
- **Order Management**: Complete order lifecycle management
- **Payment Integration**: Secure payment processing
- **Analytics Dashboard**: Detailed insights into user behavior and sales

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/intellibuy.git
   cd intellibuy
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   # Database
   DATABASE_URL=your_database_url

   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   # OpenAI (for AI features)
   OPENAI_API_KEY=your_openai_api_key

   # Other services
   # Add any other API keys or service credentials here
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📱 PWA Installation

IntelliBuy is a Progressive Web App (PWA) that can be installed on your device for offline access:

1. Visit the website in a supported browser (Chrome, Edge, Safari, etc.)
2. Look for the install prompt or use the browser's menu to "Install" or "Add to Home Screen"
3. Once installed, the app will be available from your device's home screen or app drawer

## 🧩 Project Structure

\`\`\`
intellibuy/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── admin/            # Admin dashboard pages
│   ├── products/         # Product pages
│   ├── categories/       # Category pages
│   ├── account/          # User account pages
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── admin/            # Admin components
│   ├── analytics/        # Analytics components
│   └── ...               # Other components
├── lib/                  # Utility functions and services
│   ├── services/         # Service modules
│   ├── db.ts             # Database client
│   └── ...               # Other utilities
├── public/               # Static assets
│   ├── icons/            # App icons
│   └── ...               # Other assets
├── styles/               # Global styles
├── .env.local            # Environment variables (create this)
├── next.config.mjs       # Next.js configuration
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
\`\`\`

## 🛠️ Technologies Used

- **Frontend**:
  - Next.js 14 (App Router)
  - React 18
  - Tailwind CSS
  - shadcn/ui components
  - Lucide React icons

- **State Management**:
  - React Context API
  - React Hooks

- **Authentication**:
  - NextAuth.js

- **Database**:
  - PostgreSQL (via Neon)
  - Prisma ORM

- **AI Features**:
  - OpenAI API
  - AI SDK

- **PWA**:
  - Next PWA
  - Service Workers

- **Analytics**:
  - Custom analytics solution
  - Chart.js / Recharts

## 🔄 Development Workflow

### Code Style and Linting

We use ESLint and Prettier for code quality and formatting:

\`\`\`bash
# Run linter
npm run lint

# Format code
npm run format
\`\`\`

### Building for Production

\`\`\`bash
# Build the application
npm run build

# Start the production server
npm start
\`\`\`

### Testing

\`\`\`bash
# Run tests
npm test
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@intellibuy.com or open an issue in the GitHub repository.
