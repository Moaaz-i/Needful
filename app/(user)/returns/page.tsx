'use client'

import {FiRefreshCw, FiBox, FiCheckCircle, FiAlertTriangle, FiArrowRight} from 'react-icons/fi'

export default function ReturnsPage() {
  const steps = [
    {
      step: '01',
      title: 'Initiate Return',
      description: 'Log into your account and go to your order history. Select the item you want to return and click "Request Return".',
      icon: FiRefreshCw,
      color: 'from-rose-500 to-rose-600'
    },
    {
      step: '02',
      title: 'Pack Your Item',
      description: 'Place the item in its original packaging. Include all tags, accessories, and the packing slip that came with your order.',
      icon: FiBox,
      color: 'from-amber-500 to-amber-600'
    },
    {
      step: '03',
      title: 'Ship It Back',
      description: 'Use the prepaid shipping label we send to your email. Drop the package at any authorized shipping location.',
      icon: FiArrowRight,
      color: 'from-violet-500 to-violet-600'
    },
    {
      step: '04',
      title: 'Get Refunded',
      description: 'Once we receive and inspect your return, we\'ll process your refund within 5-7 business days to your original payment method.',
      icon: FiCheckCircle,
      color: 'from-emerald-500 to-emerald-600'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-violet-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-500 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <FiRefreshCw className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-200">Hassle-Free Returns</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
            Returns & Exchanges
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Not satisfied with your purchase? We make returns easy. You have 30 days to return any item for a full refund.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-4">How Returns Work</h2>
        <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">Follow these simple steps to return or exchange your items.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, i) => (
            <div key={i} className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl flex items-center justify-center text-xs font-bold shadow-lg">
                {step.step}
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 mt-4 group-hover:scale-110 transition-transform`}>
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Policy Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              Eligible for Return
            </h3>
            <ul className="space-y-3">
              {[
                'Items in original, unused condition',
                'Items with all tags and labels attached',
                'Items returned within 30 days of delivery',
                'Items in original packaging',
                'Defective or damaged items (any condition)'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                <FiAlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              Not Eligible for Return
            </h3>
            <ul className="space-y-3">
              {[
                'Items that have been worn, washed, or altered',
                'Items without original tags or packaging',
                'Items returned after 30 days',
                'Gift cards and downloadable products',
                'Personal care and hygiene products'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                  <svg className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
