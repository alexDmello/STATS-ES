'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { formatTournamentTime } from '@/utils/formatTime'

export default function MyMatches() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchMyMatches = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data, error } = await supabase
          .from('registrations')
          .select(`
            player_names,
            tournaments (*)
          `)
          .eq('user_id', user.id)

        if (data) {
          const formatted = data.map((reg: any) => ({
            ...reg.tournaments,
            my_roster: reg.player_names
          }))
          setMatches(formatted)
        }
      }
      setLoading(false)
    }
    fetchMyMatches()
  }, [supabase])

  return (
    <div className="px-4 pb-32 max-w-xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8 mt-6">
        <Link href="/profile" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white border border-white/5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">My Matches</h2>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-[10px] font-black text-gray-600 uppercase tracking-widest">Accessing Vault...</div>
      ) : (
        <div className="space-y-8">
          {matches.length > 0 ? (
            matches.map((m) => (
              <div key={m.id} className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                {/* MATCH HEADER */}
                <div className="bg-[#FF6B00] px-6 py-2 flex justify-between items-center">
                    <span className="text-[9px] font-black text-black uppercase tracking-widest">DEPLOYMENT ACTIVE</span>
                    <span className="text-[9px] font-black text-black/60 uppercase">{m.game_mode}</span>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{m.title}</h3>
                            <p className="text-[10px] font-bold text-gray-500 uppercase mt-2">{m.map} • {m.format}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Entry Fee</p>
                            <p className="text-sm font-black text-white italic">₹{m.entry_fee}</p>
                        </div>
                    </div>

                    {/* REGISTERED ROSTER SECTION */}
                    <div className="bg-white/1 rounded-2xl p-4 border border-white/5 mb-6">
                        <p className="text-[8px] font-black text-[#FF6B00] uppercase tracking-widest mb-3">Your Registered Roster</p>
                        <div className="grid grid-cols-2 gap-2">
                            {m.my_roster.map((name: string, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                                    <span className="text-[11px] font-black text-gray-300 uppercase italic truncate">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ACTION AREA */}
                    <div className="flex gap-2">
                        <Link 
                            href={`/tournaments/arena/${m.id}/credentials`}
                            className="flex-1 bg-white text-black text-center py-4 rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                        >
                            View Credentials
                        </Link>
                        <Link 
                            href={`/tournaments/arena/${m.id}`}
                            className="px-6 bg-white/5 text-gray-400 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all border border-white/5"
                        >
                            Details
                        </Link>
                    </div>
                </div>
              </div>
            ))
          ) : (            <div className="py-24 border-2 border-dashed border-white/5 rounded-[3rem] text-center opacity-30 italic text-[10px] font-black uppercase tracking-widest">
              No Deployments Found
            </div>
          )}
        </div>
      )}
    </div>
  )
}