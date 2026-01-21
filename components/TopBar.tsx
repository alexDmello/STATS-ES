'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { usePathname } from 'next/navigation'

export default function TopBar() {
  const [energy, setEnergy] = useState(0)
  const pathname = usePathname()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Hide TopBar on Auth and Admin pages
  const isHidden = pathname === '/login' || pathname === '/signup' || pathname === '/admin'

  useEffect(() => {
    if (isHidden) return

    const fetchBalance = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('balance').eq('id', user.id).single()
        if (data) setEnergy(data.balance)
      }
    }
    fetchBalance()
    
    // Real-time listener for balance updates
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload) => {
        setEnergy(payload.new.balance)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [isHidden, supabase])

  if (isHidden) return null

  return (
    <div className="fixed top-0 left-0 w-full z-50 h-auto pt-14 pb-4 bg-[#0a0a0a]/95 backdrop-blur-md flex items-center justify-between px-4 shadow-lg transition-all">
      <Link href="/" className="flex items-center gap-2">
        {/* Neon Orange Logo Box */}
        <div className="w-8 h-8 bg-[#FF6B00] rounded-lg flex items-center justify-center transform -skew-x-12 shadow-lg shadow-[#FF6B00]/20">
          <span className="text-white font-black text-lg not-italic">S</span>
        </div>
        <span className="text-white font-black tracking-tight text-lg uppercase">Stats</span>
      </Link>

      <Link href="/wallet">
        {/* Neon Orange Energy Pill */}
        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#FF6B00]/20 px-3 py-1.5 rounded-full hover:bg-[#222] transition-colors">
          <div className="text-[#FF6B00]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" /></svg>
          </div>
          <span className="text-[#FF6B00] font-bold text-sm tabular-nums">{energy}</span>
        </div>
      </Link>
    </div>
  )
}