'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function AdminHub() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
        if (data?.is_admin) setIsAdmin(true)
        else window.location.href = '/'
      }
      setLoading(false)
    }
    checkAdmin()
  }, [])

  if (loading) return <div className="p-10 text-center text-[10px] font-black uppercase text-gray-500 animate-pulse">Checking Clearance...</div>

  const tools = [
    { title: 'Launch Arena', desc: 'Create New Tournament', icon: 'M12 4v16m8-8H4', color: 'text-orange-500', bg: 'bg-orange-500/10', path: '/admin/create' },
    { title: 'Match Credentials', desc: 'IDs & Passwords', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/admin/credentials' },
    { title: 'Game Results', desc: 'Scores & Payouts', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-500', bg: 'bg-green-500/10', path: '/admin/results' },
    { title: 'Banner Vault', desc: 'Hero Visuals', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-white', bg: 'bg-white/5', path: '/admin/banners' },
  ]

  return (
    <div className="font-sans pb-20">
      <div className="flex items-center gap-4 mb-10 mt-6">
        <Link href="/" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all border border-white/5">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">Command Center</h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Admin Operations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tools.map((tool) => (
          <Link key={tool.path} href={tool.path}>
            <div className="w-full bg-[#111] border border-white/5 p-6 rounded-4xl flex items-center justify-between hover:border-[#FF6B00]/40 transition-all active:scale-[0.98]">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center`}>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tool.icon} /></svg>
                </div>
                <div className="text-left">
                  <p className="text-base font-black text-white uppercase italic tracking-tighter">{tool.title}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{tool.desc}</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round"/></svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}