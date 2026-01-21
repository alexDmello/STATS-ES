'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function GameResults() {
  const [tournaments, setTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [resultData, setResultData] = useState({ 
    winner_name: '', 
    result_image_url: '' 
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchMatches = async () => {
      // Only fetch tournaments that aren't completed yet
      const { data } = await supabase
        .from('tournaments')
        .select('id, title')
        .eq('is_completed', false)
        .order('created_at', { ascending: false })
      if (data) setTournaments(data)
    }
    fetchMatches()
  }, [supabase])

  const handleFinishMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId) return alert('Select an arena!')
    setLoading(true)

    const { error } = await supabase
      .from('tournaments')
      .update({ 
        winner_name: resultData.winner_name,
        result_image_url: resultData.result_image_url,
        is_completed: true 
      })
      .eq('id', selectedId)

    if (error) alert(error.message)
    else {
      alert('Match Results Finalized!')
      window.location.reload() // Refresh to clear the list
    }
    setLoading(false)
  }

  return (
    <div className="font-sans pb-20 max-w-xl mx-auto px-4">
      {/* PERSISTENT BACK NAV */}
      <div className="flex items-center gap-4 mb-10 mt-6">
        <Link href="/admin" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all border border-white/5">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Game Results</h2>
          <p className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest mt-1">Return to Hub</p>
        </div>
      </div>

      <form onSubmit={handleFinishMatch} className="space-y-6">
        {/* Select Tournament */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2">Select Finished Arena</label>
          <select 
            required
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full bg-[#111] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-green-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Choose Tournament...</option>
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        {/* Winner Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2">Winner Name / Team ID</label>
            <input 
              type="text" placeholder="e.g. Team Soul or Gamer#123" required
              className="w-full bg-[#111] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-green-500 transition-all"
              onChange={(e) => setResultData({...resultData, winner_name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2">Result Screenshot URL</label>
            <input 
              type="text" placeholder="Link to match end-screen" 
              className="w-full bg-[#111] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-green-500 transition-all"
              onChange={(e) => setResultData({...resultData, result_image_url: e.target.value})}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-green-600 text-white font-black py-5 rounded-3xl uppercase tracking-widest shadow-lg shadow-green-900/20 active:scale-95 transition-all mt-4"
        >
          {loading ? 'Finalizing Standings...' : 'Finalize & Close Match'}
        </button>
      </form>

      {/* Warning Note */}
      <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
        <p className="text-[9px] text-yellow-500/60 font-bold uppercase leading-relaxed text-center">
          Note: Closing an arena will move it to the "Past Matches" section and notify all participants of the winner.
        </p>
      </div>
    </div>
  )
}