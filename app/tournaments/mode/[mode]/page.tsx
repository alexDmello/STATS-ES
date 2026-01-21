'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import TournamentCard from '@/components/TournamentCard'

export default function ModePage() {
  const params = useParams()
  const [tournaments, setTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Use the exact name of your folder slug (mode)
  const rawMode = params.mode as string
  const modeTitle = rawMode ? rawMode.replace(/-/g, ' ').toUpperCase() : ''

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (!modeTitle) return
    
    const fetchMatches = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('game_mode', modeTitle)
        .eq('is_completed', false)
        .order('start_time', { ascending: true })
      
      if (data) setTournaments(data)
      if (error) console.error("Mode Fetch Error:", error.message)
      setLoading(false)
    }
    fetchMatches()
  }, [modeTitle, supabase])

  return (
    <div className="px-4 pb-24 max-w-xl mx-auto">
      {/* HEADER WITH BACK BUTTON */}
      <div className="flex items-center gap-4 mb-8 mt-6">
        <Link href="/tournaments" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white active:scale-95 transition-all border border-white/5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
            {modeTitle}
          </h2>
          <p className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest mt-1">Combat Zones</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-[#FF6B00]/20 border-t-[#FF6B00] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Scanning Frequencies...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {tournaments.length > 0 ? (
            tournaments.map((t) => <TournamentCard key={t.id} tournament={t} />)
          ) : (
            <div className="py-24 border-2 border-dashed border-white/5 rounded-[3rem] text-center px-10">
              <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                No active {modeTitle} deployments found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}