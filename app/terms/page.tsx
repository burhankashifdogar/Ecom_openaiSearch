import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: April 18, 2023</p>
        </div>

        <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
          <p>
            Welcome to IntelliBuy. These Terms of Service ("Terms") govern your use of our website, services, and
            products. By accessing or using IntelliBuy, you agree to be bound by these Terms.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy. If you do
            not agree to these Terms, please do not use our services.
          </p>

          <h2>2. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. Your continued use of our services after any changes indicates your
            acceptance of the modified Terms.
          </p>

          <h2>3. Account Registration</h2>
          <p>
            To access certain features of our services, you may need to register for an account. You agree to provide
            accurate information and to keep it updated. You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your account.
          </p>

          <h2>4. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Use our services to distribute harmful content</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with the proper functioning of our services</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <p>
            Our services and content are protected by copyright, trademark, and other intellectual property laws. You
            may not use, reproduce, or distribute our content without our permission.
          </p>

          <h2>6. User Content</h2>
          <p>
            You retain ownership of any content you submit to our services. By submitting content, you grant us a
            non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display your content for the
            purpose of providing our services.
          </p>

          <h2>7. Termination</h2>
          <p>
            We may terminate or suspend your account and access to our services at any time, without notice, for any
            reason, including if you violate these Terms.
          </p>

          <h2>8. Disclaimer of Warranties</h2>
          <p>Our services are provided "as is" without warranties of any kind, either express or implied.</p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising out of or relating to your use of our services.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without
            regard to its conflict of law provisions.
          </p>

          <h2>11. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at support@intellibuy.com.</p>
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
