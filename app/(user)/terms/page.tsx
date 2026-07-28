'use client'

import {FiShield, FiFileText} from 'react-icons/fi'

export default function TermsPage() {
  const lastUpdated = 'January 1, 2024'

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using Needful ("the Website"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this website. These Terms of Service apply to all visitors, users, and others who access or use the Service.`
    },
    {
      title: '2. Use of the Service',
      content: `You must be at least 18 years old to use this Service. By agreeing to these Terms, you represent and warrant that you are at least 18 years of age. You may not use our products for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction.`
    },
    {
      title: '3. Account Registration',
      content: `When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.`
    },
    {
      title: '4. Products and Pricing',
      content: `All product descriptions, pricing, and availability are subject to change at any time without notice, at our sole discretion. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service.`
    },
    {
      title: '5. Orders and Payment',
      content: `We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. In the event that we make a change to or cancel an order, we will attempt to notify you by contacting the email and/or billing address/phone number provided at the time the order was made.`
    },
    {
      title: '6. Shipping and Delivery',
      content: `Shipping times are estimates and are not guaranteed. We are not responsible for delays caused by the shipping carrier, customs, or other factors beyond our control. Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier. Please refer to our Shipping Information page for detailed shipping policies.`
    },
    {
      title: '7. Returns and Refunds',
      content: `Our return policy allows returns within 30 days of delivery for items in their original condition. Refunds will be processed within 5-7 business days after we receive and inspect the returned item. Please refer to our Returns & Exchanges page for complete return policy details.`
    },
    {
      title: '8. Intellectual Property',
      content: `The Service and its original content, features, and functionality are and will remain the exclusive property of Needful. The Service is protected by copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service without the prior written consent of Needful.`
    },
    {
      title: '9. Privacy Policy',
      content: `Your privacy is important to us. We collect and use personal information only as described in our Privacy Policy. By using the Service, you agree to the collection and use of information in accordance with our Privacy Policy. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.`
    },
    {
      title: '10. Limitation of Liability',
      content: `In no event shall Needful, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.`
    },
    {
      title: '11. Changes to Terms',
      content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.`
    },
    {
      title: '12. Contact Information',
      content: `If you have any questions about these Terms, please contact us at support@needful.com or visit our Contact page.`
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-slate-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-500 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <FiShield className="w-4 h-4 text-slate-300" />
            <span className="text-sm text-slate-300">Legal Information</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms & Conditions
          </h1>
          <p className="text-slate-400 text-sm">
            Last updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Quick Info Bar */}
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center gap-3">
            <FiFileText className="w-5 h-5 text-slate-400" />
            <p className="text-sm text-slate-500">
              Please read these terms carefully before using our services.
            </p>
          </div>

          {/* Sections */}
          <div className="p-8 md:p-12 space-y-10">
            {sections.map((section, i) => (
              <div key={i} className="group">
                <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-3">
                  <div className="w-1 h-5 bg-gradient-to-b from-rose-500 to-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {section.title}
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed pl-4 border-l-2 border-slate-100">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Note */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Questions about these terms?{' '}
            <a href="/contact" className="text-rose-500 hover:text-rose-600 font-medium">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
