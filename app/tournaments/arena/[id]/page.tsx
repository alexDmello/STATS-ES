'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function TournamentDetails() {
  const params = useParams()
  const router = useRouter()
  const [tournament, setTournament] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchArenaData = async () => {
      setLoading(true)
      
      // 1. Fetch Tournament Details
      const { data: tourney } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', params.id)
        .single()
      
      if (tourney) setTournament(tourney)

      // 2. Fetch Registered Participants
      // We pull the leader's name (index 0 of the player_names array)
      const { data: regs } = await supabase
        .from('registrations')
        .select('player_names, created_at')
        .eq('tournament_id', params.id)
        .order('created_at', { ascending: true })

      if (regs) setParticipants(regs)
      
      setLoading(false)
    }
    fetchArenaData()
  }, [params.id, supabase])

  const getPrize = (pct: number) => Math.floor((tournament?.prize_pool || 0) * pct)

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] animate-pulse">Syncing Intel...</div>
    </div>
  )

  return (
    <div className="pb-32 px-4 max-w-xl mx-auto">
      {/* 1. BACK OPTION */}
      <div className="flex items-center gap-4 mb-8 mt-6">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 bg-[#111] border border-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Arena Briefing</h2>
      </div>

      <div className="space-y-6">
        {/* MAIN CARD */}
        <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">
              {tournament?.title}
          </h1>
          <div className="flex gap-3 mb-8">
              <span className="bg-[#FF6B00]/10 text-[#FF6B00] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#FF6B00]/20">
                  {tournament?.game_mode}
              </span>
              <span className="bg-white/5 text-gray-400 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/5">
                  {tournament?.format}
              </span>
          </div>

          {/* PRIZE DISTRIBUTION */}
          <div className="space-y-4 mb-8 bg-white/1 p-6 rounded-4xl border border-white/5">
              <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase">1st Place</span>
                  <span className="text-xl font-black text-[#FF6B00] italic">₹{getPrize(0.6)}</span>
              </div>
              <div className="flex justify-between items-center opacity-60">
                  <span className="text-xs font-bold text-gray-500 uppercase">2nd Place</span>
                  <span className="text-lg font-black text-white italic">₹{getPrize(0.3)}</span>
              </div>
          </div>

          <button 
            onClick={() => router.push(`/tournaments/arena/${params.id}/register`)}
            disabled={(tournament?.total_slots - tournament?.joined_count) <= 0}
            className="w-full bg-white text-black font-black py-6 rounded-2xl uppercase italic tracking-widest shadow-lg active:scale-95 disabled:opacity-50 transition-all"
          >
            { (tournament?.total_slots - tournament?.joined_count) <= 0 ? 'Arena Full' : 'Confirm Entry' }
          </button>
        </div>

        {/* 2. PARTICIPANTS LIST */}
        <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Confirmed Warriors</h3>
            <span className="text-[10px] font-black text-[#FF6B00] bg-[#FF6B00]/10 px-3 py-1 rounded-full uppercase">
                {tournament?.joined_count} / {tournament?.total_slots}
            </span>
          </div>

          <div className="space-y-3">
            {participants.length > 0 ? (
              participants.map((p, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/1 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-gray-700 w-4">{index + 1}</span>
                        <span className="text-sm font-black text-white uppercase italic tracking-tight">
                            {p.player_names[0]} {/* Displaying the Leader's IGN */}
                        </span>
                    </div>
                    {tournament?.format !== 'SOLO' && (
                        <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                            + Team
                        </span>
                    )}
                </div>
              ))
            ) : (
              <div className="py-10 text-center opacity-20 italic text-[10px] font-black uppercase tracking-widest">
                No deployments yet. Be the first!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}