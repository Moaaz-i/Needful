'use client'

import {FormEvent, useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {signup, SignupPayload} from '../../_api/signup'

export default function Signup() {
  const router = useRouter()

  const [form, setForm] = useState<SignupPayload>({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    phone: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      router.replace('/categories')
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setForm((prev) => ({...prev, [name]: value}))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await signup(form)
      router.push('/login')
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Signup failed. Please check your data and try again.'
      setError(msg)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white p-4">
      <div className="w-full max-w-md bg-white border border-amber-100 rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-2xl mb-4">
            <i className="fa-solid fa-user-plus text-2xl text-rose-500"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm">
            Join us to start your shopping journey
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl p-3 text-xs text-center flex items-center justify-center space-x-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            required
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            required
          />
          {/* Password Field */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <i
                className={`fa-solid ${
                  showPassword ? 'fa-eye-slash' : 'fa-eye'
                } text-sm`}
              ></i>
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              name="rePassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={form.rePassword}
              onChange={handleChange}
              className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <i
                className={`fa-solid ${
                  showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'
                } text-sm`}
              ></i>
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-4 inline-flex justify-center items-center rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-3 text-sm font-semibold text-white hover:from-rose-600 hover:to-rose-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 focus:ring-2 focus:ring-rose-200 focus:ring-offset-2 focus:outline-none"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 text-center">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium text-rose-500 hover:text-rose-600 transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
