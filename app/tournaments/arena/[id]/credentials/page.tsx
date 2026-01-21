'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function MatchCredentials() {
  const params = useParams()
  const router = useRouter()
  const [tournament, setTournament] = useState<any>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchCreds = async () => {
      const { data } = await supabase.from('tournaments').select('*').eq('id', params.id).single()
      if (data) setTournament(data)
    }
    fetchCreds()

    // Real-time update listener
    const channel = supabase
      .channel('room_updates')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'tournaments', filter: `id=eq.${params.id}` },
        (payload) => setTournament(payload.new)
      ).subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [params.id, supabase])

  const copyToClipboard = (text: string, field: string) => {
    if (!text || text === 'PENDING') return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  return (
    <div className="min-h-screen flex flex-col px-4 bg-black pb-24">
      <div className="flex items-center gap-4 mb-10 mt-10">
        <button onClick={() => router.back()} className="w-10 h-10 bg-[#111] rounded-full flex items-center justify-center text-white border border-white/5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" /></svg>
        </button>
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Match Access</h2>
      </div>

      <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl space-y-8">
        {/* ROOM ID */}
        <div className="flex items-center justify-between bg-black/40 p-6 rounded-3xl border border-white/5">
            <div>
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Room ID</p>
                <h3 className="text-2xl font-black text-white tracking-widest uppercase italic">{tournament?.room_id || 'PENDING'}</h3>
            </div>
            <button onClick={() => copyToClipboard(tournament?.room_id, 'id')} className={`p-3 rounded-xl ${copiedField === 'id' ? 'bg-green-500 text-white' : 'bg-[#FF6B00] text-black'}`}>
                {copiedField === 'id' ? '✓' : 'COPY'}
            </button>
        </div>

        {/* PASSWORD */}
        <div className="flex items-center justify-between bg-black/40 p-6 rounded-3xl border border-white/5">
            <div>
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Password</p>
                <h3 className="text-2xl font-black text-[#FF6B00] tracking-widest uppercase italic">{tournament?.room_password || '*****'}</h3>
            </div>
            <button onClick={() => copyToClipboard(tournament?.room_password, 'pass')} className={`p-3 rounded-xl ${copiedField === 'pass' ? 'bg-green-500 text-white' : 'bg-white text-black'}`}>
                {copiedField === 'pass' ? '✓' : 'COPY'}
            </button>
        </div>

        {/* LAUNCH BUTTON */}
        {tournament?.game_link && (
          <div className="pt-4">
            <a 
              href={tournament.game_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-linear-to-r from-green-600 to-emerald-600 text-white font-black py-6 rounded-4xl uppercase italic tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Launch Free Fire
            </a>
          </div>
        )}
      </div>
    </div>
  )
}