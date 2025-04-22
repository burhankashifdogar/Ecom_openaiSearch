import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: April 18, 2023</p>
        </div>

        <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
          <p>
            At IntelliBuy, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our website and services.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We may collect information about you in various ways, including:</p>
          <ul>
            <li>
              <strong>Personal Data:</strong> Name, email address, phone number, shipping address, billing information,
              and other information you provide when creating an account or making a purchase.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you use our website, including browsing history, search
              queries, and product interactions.
            </li>
            <li>
              <strong>Device Data:</strong> Information about your device, IP address, browser type, and operating
              system.
            </li>
            <li>
              <strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to
              collect information about your browsing activities.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We may use the information we collect for various purposes, including:</p>
          <ul>
            <li>Providing and maintaining our services</li>
            <li>Processing your transactions and fulfilling orders</li>
            <li>Personalizing your shopping experience</li>
            <li>Improving our website and services</li>
            <li>Communicating with you about orders, products, and promotions</li>
            <li>Analyzing usage patterns and trends</li>
            <li>Protecting against fraudulent or unauthorized transactions</li>
          </ul>

          <h2>3. Information Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>
              <strong>Service Providers:</strong> Third-party vendors who help us operate our business and provide
              services.
            </li>
            <li>
              <strong>Business Partners:</strong> Companies we partner with to offer products or services.
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to protect our rights.
            </li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of
            transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute
            security.
          </p>

          <h2>5. Your Privacy Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul>
            <li>Access to your personal information</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your personal information</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
            <li>Objection to processing</li>
          </ul>

          <h2>6. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 16. We do not knowingly collect personal
            information from children under 16.
          </p>

          <h2>7. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@intellibuy.com.</p>
        </div>

        <div className="flex justify-center pt-8">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
