'use client'

import {useState} from 'react'
import {FiMail, FiPhone, FiMapPin, FiSend, FiMessageCircle, FiClock} from 'react-icons/fi'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({name: '', email: '', subject: '', message: ''})
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-rose-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-rose-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <FiMessageCircle className="w-4 h-4 text-rose-400" />
            <span className="text-sm text-rose-200">We&apos;d love to hear from you</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-rose-200 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Have a question, feedback, or need help with your order? Our team is here to assist you.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-rose-100 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiMail className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Email Us</h3>
              <p className="text-slate-500 text-sm mb-2">We&apos;ll respond within 24 hours</p>
              <a href="mailto:support@needful.com" className="text-rose-600 font-medium text-sm hover:underline">
                support@needful.com
              </a>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-amber-100 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiPhone className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Call Us</h3>
              <p className="text-slate-500 text-sm mb-2">Mon-Fri, 9am to 6pm</p>
              <a href="tel:+12345678900" className="text-amber-600 font-medium text-sm hover:underline">
                +1 234 567 8900
              </a>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-emerald-100 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiMapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Visit Us</h3>
              <p className="text-slate-500 text-sm mb-2">Our main office</p>
              <p className="text-emerald-600 font-medium text-sm">
                123 Shopping St, Retail City, RC 12345
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-violet-100 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiClock className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Business Hours</h3>
              <p className="text-slate-500 text-sm">Mon - Fri: 9:00 AM - 6:00 PM</p>
              <p className="text-slate-500 text-sm">Sat: 10:00 AM - 4:00 PM</p>
              <p className="text-slate-500 text-sm">Sun: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a message</h2>
              <p className="text-slate-500 mb-8">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>

              {submitted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-emerald-700 text-sm font-medium">
                    Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-slate-900 bg-slate-50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-slate-900 bg-slate-50"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-slate-900 bg-slate-50"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-slate-900 bg-slate-50 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 flex items-center justify-center gap-2"
                >
                  <FiSend className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
