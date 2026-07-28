'use client'

import {useState} from 'react'
import {FiChevronDown, FiHelpCircle, FiSearch} from 'react-icons/fi'

const faqData = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How can I track my order?',
        a: 'Once your order ships, you\'ll receive an email with a tracking number. You can use this number to track your package on our website or the carrier\'s website.'
      },
      {
        q: 'How long does delivery take?',
        a: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. International orders may take 10-15 business days depending on the destination.'
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! We offer free standard shipping on all orders over $50 within the continental United States.'
      },
      {
        q: 'Can I change my shipping address after placing an order?',
        a: 'You can update your shipping address within 2 hours of placing your order by contacting our support team. After the order has been processed, address changes may not be possible.'
      }
    ]
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 30 days of delivery. Items must be in their original, unused condition with all tags attached. Visit our Returns & Exchanges page for detailed information.'
      },
      {
        q: 'How long does it take to process a refund?',
        a: 'Once we receive and inspect your return, refunds are processed within 5-7 business days. The refund will be credited to your original payment method.'
      },
      {
        q: 'Can I exchange an item?',
        a: 'Yes! You can request an exchange for a different size or color. Simply initiate a return and select "Exchange" as the reason. We\'ll ship the replacement once we receive your return.'
      }
    ]
  },
  {
    category: 'Account & Payment',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click the "Sign Up" button in the navigation bar. Fill in your details including name, email, and password, and you\'re all set!'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All payments are processed securely.'
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. We use industry-standard SSL encryption and never store your full credit card information on our servers. All transactions are processed through secure payment gateways.'
      }
    ]
  },
  {
    category: 'Products',
    questions: [
      {
        q: 'Are your products authentic?',
        a: 'Yes, we guarantee 100% authentic products. We source directly from authorized distributors and manufacturers.'
      },
      {
        q: 'How can I find the right size?',
        a: 'Each product page includes a detailed size guide. If you\'re unsure, our customer service team is happy to help you find the perfect fit.'
      },
      {
        q: 'Can I save items for later?',
        a: 'Yes! Use the Wishlist feature to save items you love. Simply click the heart icon on any product to add it to your wishlist. You\'ll need an account to use this feature.'
      }
    ]
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({...prev, [key]: !prev[key]}))
  }

  const filteredFaq = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-500 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <FiHelpCircle className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-200">Got Questions? We&apos;ve Got Answers</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
            Find quick answers to common questions about orders, shipping, returns, and more.
          </p>

          {/* Search */}
          <div className="max-w-lg mx-auto relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto max-w-4xl px-4 py-16">
        {filteredFaq.length === 0 ? (
          <div className="text-center py-12">
            <FiHelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No questions found matching your search.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-rose-500 hover:text-rose-600 font-medium text-sm"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredFaq.map((category, ci) => (
              <div key={ci}>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-rose-500 to-amber-500 rounded-full" />
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((item, qi) => {
                    const key = `${ci}-${qi}`
                    const isOpen = openItems[key]
                    return (
                      <div
                        key={qi}
                        className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 transition-colors"
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                        >
                          <span className="font-medium text-slate-900 text-sm md:text-base">{item.q}</span>
                          <FiChevronDown
                            className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <p className="px-6 pb-4 text-slate-500 text-sm leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            Can&apos;t find what you&apos;re looking for? Our support team is ready to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 rounded-xl font-semibold hover:from-rose-600 hover:to-amber-600 transition-all shadow-lg"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
