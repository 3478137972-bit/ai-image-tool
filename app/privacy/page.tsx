export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
          <p>We collect information you provide when using our AI image generation service, including:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Email address and authentication information</li>
            <li>Payment information processed through our payment provider (Creem)</li>
            <li>Usage data including prompts and generated images</li>
            <li>Credit balance and transaction history</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Provide and improve our AI image generation service</li>
            <li>Process payments and manage subscriptions</li>
            <li>Maintain your account and credit balance</li>
            <li>Send service-related notifications</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Payment Processing</h2>
          <p>Payment transactions are processed securely through Creem. We do not store your complete payment card details. Payment information is handled in accordance with PCI-DSS standards.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Data Storage</h2>
          <p>Your data is securely stored using Supabase infrastructure. We implement appropriate security measures to protect your personal information. We do not share your personal information with third parties except as necessary to provide our service (e.g., payment processing, AI model providers).</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Subscription and Billing</h2>
          <p>If you subscribe to a membership plan, your subscription will automatically renew until cancelled. You can cancel your subscription at any time through your account settings or by contacting support.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Cancel your subscription at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact</h2>
          <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:3478137972@qq.com" className="text-blue-600 hover:underline">3478137972@qq.com</a></p>
        </section>

        <section>
          <p className="text-sm text-gray-500">Last updated: January 2026</p>
        </section>
      </div>
    </div>
  )
}
