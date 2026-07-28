'use client'

import {FiTruck, FiPackage, FiGlobe, FiClock, FiShield, FiAlertCircle} from 'react-icons/fi'

export default function ShippingPage() {
  const shippingMethods = [
    {
      icon: FiTruck,
      title: 'Standard Shipping',
      time: '5-7 Business Days',
      price: 'Free on orders over $50',
      color: 'from-emerald-500 to-emerald-600',
      shadowColor: 'shadow-emerald-200',
      description: 'Reliable delivery for everyday orders. Track your package every step of the way.'
    },
    {
      icon: FiPackage,
      title: 'Express Shipping',
      time: '2-3 Business Days',
      price: '$9.99',
      color: 'from-amber-500 to-amber-600',
      shadowColor: 'shadow-amber-200',
      description: 'Need it faster? Express shipping gets your order to you in no time.'
    },
    {
      icon: FiGlobe,
      title: 'International Shipping',
      time: '10-15 Business Days',
      price: 'From $19.99',
      color: 'from-violet-500 to-violet-600',
      shadowColor: 'shadow-violet-200',
      description: 'We ship worldwide. Customs and duties may apply depending on your country.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <FiTruck className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-200">Fast & Reliable Delivery</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
            Shipping Information
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            We offer multiple shipping options to get your purchases to your doorstep quickly and safely.
          </p>
        </div>
      </div>

      {/* Shipping Methods */}
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {shippingMethods.map((method, i) => (
            <div key={i} className="group bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`w-14 h-14 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg ${method.shadowColor}`}>
                <method.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{method.title}</h3>
              <p className="text-slate-500 text-sm mb-4">{method.description}</p>
              <div className="flex items-center gap-2 text-sm mb-2">
                <FiClock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 font-medium">{method.time}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-lg font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
                  {method.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Policies */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Shipping Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiPackage className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Order Processing</h4>
                  <p className="text-slate-500 text-sm">
                    Orders are processed within 1-2 business days. You&apos;ll receive a confirmation email with tracking information once your order ships.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiShield className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Package Insurance</h4>
                  <p className="text-slate-500 text-sm">
                    All shipments are insured. If your package is lost or damaged during transit, we&apos;ll send a replacement or issue a full refund.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiTruck className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Free Shipping</h4>
                  <p className="text-slate-500 text-sm">
                    Enjoy free standard shipping on all orders over $50 within the continental United States.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiAlertCircle className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Delivery Issues</h4>
                  <p className="text-slate-500 text-sm">
                    If you experience any issues with your delivery, please contact our support team within 48 hours of the expected delivery date.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
