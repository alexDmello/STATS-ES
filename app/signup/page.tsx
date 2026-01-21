'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 1. UNIQUE CHECK (Prevents duplicate usernames before attempting signup)
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase().trim())
      .maybeSingle()

    if (existingUser) {
      alert('This username is already taken. Try another.')
      setLoading(false)
      return
    }

    // 2. AUTH SIGNUP (Passing metadata correctly)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          username: username.toLowerCase().trim(), 
          phone_number: phone 
        }
      }
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Signup successful! Redirecting...')
      window.location.href = '/login'
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-[#0a0a0a]">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-[#FF6B00] rounded-2xl flex items-center justify-center transform -skew-x-12 mx-auto mb-4">
          <span className="text-white font-black text-3xl italic">S</span>
        </div>
        <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">Join Stats</h1>
      </div>

      <form onSubmit={handleSignup} className="space-y-4 max-w-sm mx-auto w-full">
        <input 
          type="text" placeholder="Username" required
          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[#FF6B00] outline-none transition-all"
          onChange={(e) => setUsername(e.target.value)}
        />
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
          className="w-full bg-[#FF6B00] text-white font-black py-4 rounded-xl uppercase tracking-widest active:scale-95 transition-all mt-4"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  )
}