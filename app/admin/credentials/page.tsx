'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { formatTournamentTime } from '@/utils/formatTime'

export default function MatchCredentials() {
  const [tournaments, setTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [creds, setCreds] = useState({ 
    room_id: '', 
    room_password: '', 
    game_link: '' // Added game_link field
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('id, title, is_completed')
        .eq('is_completed', false) 
        .order('created_at', { ascending: false })
      
      if (data) setTournaments(data)
      if (error) console.error("Fetch Error:", error.message)
    }
    fetchMatches()
  }, [supabase])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId) return alert('Select a target arena!')
    setLoading(true)

    const { error } = await supabase
      .from('tournaments')
      .update({ 
        room_id: creds.room_id, 
        room_password: creds.room_password,
        game_link: creds.game_link // Dispatched to DB
      })
      .eq('id', selectedId)

    if (error) {
      alert("Broadcast Failed: " + error.message)
    } else {
      alert('Credentials & Link Dispatched!')
      setCreds({ room_id: '', room_password: '', game_link: '' })
    }
    setLoading(false)
  }

  return (
    <div className="font-sans pb-20 max-w-xl mx-auto px-4">
      <div className="flex items-center gap-4 mb-10 mt-6">
        <Link href="/admin" className="w-12 h-12 bg-[#111] rounded-2xl flex items-center justify-center text-white border border-white/5">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Command Center</h2>
          <p className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest mt-1">Deploy Room Access</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2 mb-4 block">Select Active Arena</label>
          <select 
            required
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-[#FF6B00] appearance-none cursor-pointer italic font-black uppercase"
          >
            <option value="">-- STANDBY --</option>
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2 mb-4 block">Room ID</label>
            <input 
              type="text" placeholder="ID FROM GAME" required
              value={creds.room_id}
              className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-[#FF6B00] font-black tracking-[0.3em]"
              onChange={(e) => setCreds({...creds, room_id: e.target.value})}
            />
          </div>
          <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2 mb-4 block">Room Password</label>
            <input 
              type="text" placeholder="SECRET KEY" required
              value={creds.room_password}
              className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-[#FF6B00] font-black tracking-[0.3em]"
              onChange={(e) => setCreds({...creds, room_password: e.target.value})}
            />
          </div>
          {/* NEW LINK FIELD */}
          <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2 mb-4 block">Direct Launch Link (Optional)</label>
            <input 
              type="text" placeholder="https://..." 
              value={creds.game_link}
              className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-[#FF6B00] text-xs"
              onChange={(e) => setCreds({...creds, game_link: e.target.value})}
            />
          </div>
        </div>

        <button 
          disabled={loading || tournaments.length === 0}
          className="w-full bg-[#FF6B00] text-white font-black py-6 rounded-3xl uppercase italic tracking-widest shadow-lg active:scale-95 disabled:opacity-20"
        >
          {loading ? 'Transmitting...' : 'Broadcast to Players'}
        </button>
      </form>
    </div>
  )
}