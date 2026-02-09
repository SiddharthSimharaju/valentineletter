import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">Valentine Letter</span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-8">Privacy Policy</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm">Last updated: February 9, 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">1. Introduction</h2>
            <p>Welcome to Valentine Letter ("we," "our," or "us"). We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website at lettersonvalentines.com (the "Service").</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Recipient Information:</strong> The name and email address of the person you wish to send a Valentine's letter to.</li>
              <li><strong className="text-foreground">Story Responses:</strong> Your answers to our guided prompts, which are used to generate your personalized letter. These are stored locally in your browser.</li>
              <li><strong className="text-foreground">Payment Information:</strong> Payment is processed securely through Razorpay. We do not store your credit card or payment details on our servers.</li>
              <li><strong className="text-foreground">Gmail Authorization:</strong> If you choose to send your letter via Gmail, we request limited access to send an email on your behalf. We do not read, store, or access any other emails in your account.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To generate your personalized Valentine's letter using AI</li>
              <li>To send the letter to your intended recipient on Valentine's Day</li>
              <li>To process your payment</li>
              <li>To improve and maintain the Service</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">4. Data Storage & Security</h2>
            <p>Your story responses are stored locally in your browser using local storage. They are not uploaded to our servers unless you initiate letter generation. All data transmission is encrypted via HTTPS. We use industry-standard security measures to protect your information.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">5. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Razorpay:</strong> For payment processing. Subject to <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Razorpay's Privacy Policy</a>.</li>
              <li><strong className="text-foreground">Google Gmail API:</strong> For sending emails on your behalf. Subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google's Privacy Policy</a>.</li>
              <li><strong className="text-foreground">AI Services:</strong> For generating your personalized letter. Your prompts are processed but not stored permanently by the AI provider.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">6. Data Retention</h2>
            <p>Your story responses remain in your browser's local storage until you clear your browser data. Gmail tokens are stored securely and can be disconnected at any time. We do not retain your personal data longer than necessary to provide the Service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Clear your locally stored data at any time by clearing your browser storage</li>
              <li>Disconnect your Gmail account from the Service</li>
              <li>Request deletion of any data we may hold about you by contacting us</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">8. Children's Privacy</h2>
            <p>The Service is not intended for users under the age of 18. We do not knowingly collect personal information from children.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please reach out to us at <a href="tel:+917706888651" className="text-primary hover:underline">+91-7706888651</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
