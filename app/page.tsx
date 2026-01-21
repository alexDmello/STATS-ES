'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import TournamentCard from '@/components/TournamentCard'

export default function Home() {
  const [banners, setBanners] = useState<any[]>([])
  const [tournaments, setTournaments] = useState<any[]>([])
  const [activeSlide, setActiveSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data: bannerData } = await supabase.from('banners').select('*').eq('is_active', true)
      if (bannerData) setBanners(bannerData)

      const { data: tourneyData } = await supabase
        .from('tournaments')
        .select('*')
        .eq('is_completed', false)
        .order('start_time', { ascending: true })
      if (tourneyData) setTournaments(tourneyData)
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners])

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
        <div className="w-10 h-10 border-4 border-[#FF6B00]/20 border-t-[#FF6B00] rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Establishing Uplink...</p>
    </div>
  )

  return (
    <div className="px-4 pb-32">
      
      {/* 1. HERO SLIDER */}
      <section className="relative h-64 w-full rounded-[3rem] overflow-hidden mb-8 border border-white/5 shadow-2xl mt-4">
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
            >
              <img src={banner.url} className="w-full h-full object-cover" alt={banner.name} />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <div className="bg-[#FF6B00] text-black text-[8px] font-black px-2 py-0.5 rounded mb-2 inline-block uppercase tracking-tighter">Featured Event</div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-tight max-w-50">
                  {banner.name}
                </h2>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full bg-[#111] flex items-center justify-center">
             <p className="text-gray-700 font-black text-xs uppercase tracking-widest">No Active Promos</p>
          </div>
        )}
        <div className="absolute bottom-8 right-8 flex gap-2">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setActiveSlide(i)} className={`h-1.5 rounded-full transition-all duration-500 ${i === activeSlide ? 'w-8 bg-[#FF6B00]' : 'w-2 bg-white/20'}`} />
          ))}
        </div>
      </section>

      {/* 2. ACTION GRID (Replaced Header Text) */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {/* MY MATCHES */}
        <Link href="/profile/my-matches" className="block active:scale-95 transition-transform">
          <div className="aspect-square rounded-4xl bg-[#111] border border-white/5 flex flex-col items-center justify-center p-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-[#FF6B00]/10 to-transparent"></div>
            <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-xl flex items-center justify-center text-[#FF6B00] mb-2 relative z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[9px] font-black text-white uppercase tracking-tighter text-center relative z-10 leading-tight">
              My<br/>Matches
            </span>
          </div>
        </Link>

        {/* EMPTY CONTAINER 1 */}
        <div className="aspect-square rounded-4xl bg-[#111] border border-white/5 flex flex-col items-center justify-center p-2 opacity-40">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-600 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <span className="text-[9px] font-black text-gray-600 uppercase tracking-tighter text-center leading-tight">
            Locked<br/>Slot
          </span>
        </div>

        {/* EMPTY CONTAINER 2 */}
        <div className="aspect-square rounded-4xl bg-[#111] border border-white/5 flex flex-col items-center justify-center p-2 opacity-40">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-600 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <span className="text-[9px] font-black text-gray-600 uppercase tracking-tighter text-center leading-tight">
            Locked<br/>Slot
          </span>
        </div>
      </div>

      {/* 3. TOURNAMENT LIST */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full"></div>
            <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Active Arenas</h3>
          </div>
          <Link href="/tournaments" className="text-[10px] font-black text-gray-500 hover:text-white uppercase transition-colors">
            View All Arena →
          </Link>
        </div>
        <div className="space-y-6">
          {tournaments.length > 0 ? (
            tournaments.map((t) => <TournamentCard key={t.id} tournament={t} />)
          ) : (
            <div className="py-20 border-2 border-dashed border-white/5 rounded-[3rem] text-center">
              <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.3em]">No Arenas Available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}