'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function Wallet() {
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchWallet = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('balance').eq('id', user.id).single()
        if (data) setBalance(data.balance)
      }
      setLoading(false)
    }
    fetchWallet()
  }, [supabase])

  return (
    <div className="font-sans">
      <h1 className="text-2xl font-black italic uppercase text-white mb-6">Energy Wallet</h1>

      <div className="space-y-6">
        <div className="bg-linear-to-br from-orange-600 to-orange-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-1">Available Energy</p>
            <div className="flex items-center gap-3">
              <div className="text-white">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" /></svg>
              </div>
              <h2 className="text-4xl font-black text-white">{loading ? '...' : balance}</h2>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 text-white/10">
             <svg className="w-32 h-32 fill-current" viewBox="0 0 24 24"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" /></svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="bg-[#111] border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-2 active:scale-95 transition-transform">
             <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center text-[#FF6B00]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
             </div>
             <span className="text-[10px] font-bold uppercase text-white">Add Energy</span>
          </button>
          <button className="bg-[#111] border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-2 active:scale-95 transition-transform">
             <div className="w-10 h-10 bg-gray-500/10 rounded-full flex items-center justify-center text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             </div>
             <span className="text-[10px] font-bold uppercase text-white">Withdraw</span>
          </button>
        </div>
      </div>
    </div>
  )
}