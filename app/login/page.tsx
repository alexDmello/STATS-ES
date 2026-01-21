'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else window.location.href = '/'
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-[#FF6B00] rounded-2xl flex items-center justify-center transform -skew-x-12 mx-auto mb-4 shadow-lg shadow-[#FF6B00]/30">
          <span className="text-white font-black text-3xl">S</span>
        </div>
        <h1 className="text-3xl font-black italic text-white uppercase">Welcome Back</h1>
        <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">Enter the Arena</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <input 
          type="email" placeholder="Email" required
          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[#FF6B00] outline-none transition-all"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" required
          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[#FF6B00] outline-none transition-all"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          disabled={loading}
          className="w-full bg-[#FF6B00] text-white font-black py-4 rounded-xl uppercase tracking-widest shadow-lg shadow-orange-900/20 active:scale-95 transition-all mt-4"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-gray-500 text-xs mt-8 uppercase tracking-widest">
        New to Stats? <Link href="/signup" className="text-[#FF6B00] font-bold">Register Now</Link>
      </p>
    </div>
  )
}