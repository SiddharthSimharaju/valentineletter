import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
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

        <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-8">Terms & Conditions</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm">Last updated: February 9, 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing or using the Valentine Letter website at lettersonvalentines.com (the "Service"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">2. Description of Service</h2>
            <p>Valentine Letter is an AI-powered service that helps you create personalized Valentine's Day letters. You provide personal memories and sentiments through guided prompts, and we use AI to craft a heartfelt letter that you can review, edit, and send to your loved one.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">3. Eligibility</h2>
            <p>You must be at least 18 years of age to use the Service. By using the Service, you represent that you meet this requirement.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">4. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for the accuracy of the information you provide, including the recipient's name and email address.</li>
              <li>You agree to use the Service only for lawful purposes and in a manner consistent with its intended use — sending heartfelt, personal Valentine's letters.</li>
              <li>You must not use the Service to send harassing, threatening, or inappropriate content.</li>
              <li>You are responsible for obtaining any necessary consent from the recipient before sharing their email address with us.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">5. Payment & Pricing</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>The Service is priced at ₹99 per letter.</li>
              <li>Payment is processed securely through Razorpay.</li>
              <li>All payments are final. Due to the nature of the digital service (AI-generated personalized content), refunds are generally not provided once the letter has been generated and unlocked.</li>
              <li>If you experience a technical issue preventing delivery, please contact us and we will work to resolve it.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">6. AI-Generated Content</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Letters are generated using artificial intelligence based on the inputs you provide.</li>
              <li>You have the ability to review and edit the letter before sending.</li>
              <li>We do not guarantee that the AI-generated content will perfectly capture your sentiments. You are responsible for reviewing and approving the final letter.</li>
              <li>Once generated, the letter content belongs to you.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">7. Gmail Integration</h2>
            <p>If you choose to send your letter via Gmail, you authorize us to send a single email on your behalf to the specified recipient. We access only the minimum permissions required (send-only) and do not read, store, or modify any other data in your Gmail account. You may revoke this access at any time.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">8. Intellectual Property</h2>
            <p>The Service, including its design, branding, and underlying technology, is owned by Valentine Letter. You may not copy, reproduce, or redistribute any part of the Service without our prior written consent.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">9. Limitation of Liability</h2>
            <p>The Service is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount paid by you for the Service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">10. Termination</h2>
            <p>We reserve the right to suspend or terminate access to the Service at our discretion, particularly in cases of misuse or violation of these Terms.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">11. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, India.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">12. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-medium text-foreground">13. Contact Us</h2>
            <p>If you have any questions about these Terms, please reach out to us at <a href="tel:+917706888651" className="text-primary hover:underline">+91-7706888651</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Terms;
