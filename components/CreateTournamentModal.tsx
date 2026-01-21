'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function CreateTournamentModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    game_mode: 'Battle Royale',
    map: '',
    prize_pool: 0,
    entry_fee: 0,
    start_time: ''
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('tournaments').insert([formData])
    
    if (error) alert(error.message)
    else {
      alert('Tournament created successfully!')
      onClose()
      window.location.reload()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-[#111] border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-white italic uppercase">New Arena</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Tournament Title" required
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6B00] outline-none transition-all"
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          
          <select 
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6B00] outline-none transition-all"
            onChange={(e) => setFormData({...formData, game_mode: e.target.value})}
          >
            <option value="Battle Royale">Battle Royale</option>
            <option value="TDM">TDM</option>
            <option value="Clash Squad">Clash Squad</option>
          </select>

          <input 
            type="text" placeholder="Map Name" required
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6B00] outline-none transition-all"
            onChange={(e) => setFormData({...formData, map: e.target.value})}
          />

          <div className="grid grid-cols-2 gap-4">
            <input 
              type="number" placeholder="Prize Pool (₹)" required
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6B00] outline-none transition-all"
              onChange={(e) => setFormData({...formData, prize_pool: parseInt(e.target.value)})}
            />
            <input 
              type="number" placeholder="Entry Fee (₹)" required
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6B00] outline-none transition-all"
              onChange={(e) => setFormData({...formData, entry_fee: parseInt(e.target.value)})}
            />
          </div>

          <input 
            type="datetime-local" required
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6B00] outline-none transition-all"
            onChange={(e) => setFormData({...formData, start_time: e.target.value})}
          />

          <button className="w-full bg-[#FF6B00] text-white font-black py-4 rounded-xl uppercase tracking-widest shadow-lg shadow-orange-900/20 active:scale-95 transition-all mt-2">
            Confirm & Launch
          </button>
        </form>
      </div>
    </div>
  )
}