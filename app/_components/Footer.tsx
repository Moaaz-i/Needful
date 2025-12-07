'use client'

import Link from 'next/link'
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-xl">Needful</span>
            </div>
            <p className="text-slate-400 text-sm">
              Your trusted online shopping destination for quality products and
              great deals.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <FiFacebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <FiTwitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <FiInstagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-slate-400 text-sm">
                <FiMail className="w-4 h-4" />
                <span>support@needful.com</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 text-sm">
                <FiPhone className="w-4 h-4" />
                <span>+1 234 567 8900</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 text-sm">
                <FiMapPin className="w-4 h-4" />
                <span>123 Shopping St, Retail City, RC 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            2024 Needful. All rights reserved. Made with for great shopping
            experience.
          </p>
        </div>
      </div>
    </footer>
  )
}
