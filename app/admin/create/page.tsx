'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function ArenaStudio() {
  const [activeTab, setActiveTab] = useState<'create' | 'live'>('create')
  const [loading, setLoading] = useState(false)
  const [tournaments, setTournaments] = useState<any[]>([])
  
  // --- EDITING STATE ---
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<any>({})

  // --- CREATE FORM STATE ---
  const [form, setForm] = useState({
    title: '',
    game_mode: 'BATTLE ROYALE',
    format: 'SQUAD',
    total_slots: 48,
    prize_pool: '',
    entry_fee: '',
    start_time: '',
    map: 'BERMUDA'
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchLiveArenas = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('is_completed', false)
      if (error) throw error
      if (data) setTournaments(data)
    } catch (err) {
      console.error("Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'live') fetchLiveArenas()
  }, [activeTab])

  // --- HELPER: FORMAT TIME FOR DB ---
  const formatTimeForDB = (timeString: string) => {
    const localDate = new Date(timeString)
    const offsetDate = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000))
    return offsetDate.toISOString()
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const finalTime = formatTimeForDB(form.start_time)
    const { error } = await supabase.from('tournaments').insert([{ ...form, start_time: finalTime, joined_count: 0 }])
    if (error) alert(error.message)
    else { alert('Arena Deployed!'); setActiveTab('live'); }
    setLoading(false)
  }

  const handleUpdate = async (id: string) => {
    setLoading(true)
    // Re-process time in case it was changed during edit
    const updatedData = { ...editForm }
    if (updatedData.start_time) {
      updatedData.start_time = formatTimeForDB(updatedData.start_time)
    }

    const { error } = await supabase.from('tournaments').update(updatedData).eq('id', id)
    if (!error) {
      setEditingId(null)
      fetchLiveArenas()
    } else {
      alert(error.message)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Destroy this arena?')) return
    await supabase.from('tournaments').delete().eq('id', id)
    fetchLiveArenas()
  }

  return (
    <div className="font-sans pb-20 max-w-2xl mx-auto px-4">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-10 mt-6 px-2">
        <Link href="/admin" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/5 active:scale-90 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Arena Studio</h2>
          <p className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest mt-1">Full Control Hub</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex p-1 bg-[#111] rounded-4xl mb-10 border border-white/5">
        <button onClick={() => setActiveTab('create')} className={`flex-1 py-4 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'create' ? 'bg-[#FF6B00] text-white shadow-lg' : 'text-gray-500'}`}>Create</button>
        <button onClick={() => setActiveTab('live')} className={`flex-1 py-4 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'live' ? 'bg-[#FF6B00] text-white shadow-lg' : 'text-gray-500'}`}>Manage</button>
      </div>

      {activeTab === 'create' ? (
        /* CREATE FORM - Same as before but with Time-Lock Helper */
        <form onSubmit={handleCreate} className="space-y-6">
          <input type="text" placeholder="Title" required className="w-full bg-[#111] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-[#FF6B00]" onChange={(e) => setForm({...form, title: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <select className="bg-[#111] border border-white/5 rounded-2xl p-5 text-white" onChange={(e) => setForm({...form, game_mode: e.target.value})}>
              <option value="BATTLE ROYALE">BATTLE ROYALE</option><option value="CLASH SQUAD">CLASH SQUAD</option><option value="LONE WOLF">LONE WOLF</option><option value="STATS ARENA">STATS ARENA</option>
            </select>
            <select className="bg-[#111] border border-white/5 rounded-2xl p-5 text-white" onChange={(e) => setForm({...form, format: e.target.value})}>
              <option value="SQUAD">SQUAD</option><option value="DUO">DUO</option><option value="SOLO">SOLO</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Slots" required className="bg-[#111] border border-white/5 rounded-2xl p-5 text-white" onChange={(e) => setForm({...form, total_slots: parseInt(e.target.value)})} />
            <select className="bg-[#111] border border-white/5 rounded-2xl p-5 text-white" onChange={(e) => setForm({...form, map: e.target.value})}>
              <option>BERMUDA</option><option>PURGATORY</option><option>KALAHARI</option>
            </select>
          </div>
          <input type="datetime-local" required className="w-full bg-[#111] border border-white/5 rounded-2xl p-5 text-white scheme-dark" onChange={(e) => setForm({...form, start_time: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Prize Pool" required className="bg-[#111] border border-white/5 rounded-2xl p-5 text-white" onChange={(e) => setForm({...form, prize_pool: e.target.value})} />
            <input type="number" placeholder="Entry Fee" required className="bg-[#111] border border-white/5 rounded-2xl p-5 text-white" onChange={(e) => setForm({...form, entry_fee: e.target.value})} />
          </div>
          <button className="w-full bg-[#FF6B00] text-white font-black py-6 rounded-4xl uppercase italic">Launch Mission</button>
        </form>
      ) : (
        /* MANAGE LIST WITH FULL EDIT MODE */
        <div className="space-y-4">
          {tournaments.map((t) => (
            <div key={t.id} className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6">
              {editingId === t.id ? (
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest px-2">Editing: {t.title}</p>
                  
                  <input className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-sm" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <select className="bg-black border border-white/10 rounded-xl p-3 text-xs text-white" value={editForm.game_mode} onChange={(e) => setEditForm({...editForm, game_mode: e.target.value})}>
                      <option value="BATTLE ROYALE">BATTLE ROYALE</option><option value="CLASH SQUAD">CLASH SQUAD</option><option value="LONE WOLF">LONE WOLF</option><option value="STATS ARENA">STATS ARENA</option>
                    </select>
                    <select className="bg-black border border-white/10 rounded-xl p-3 text-xs text-white" value={editForm.format} onChange={(e) => setEditForm({...editForm, format: e.target.value})}>
                      <option value="SQUAD">SQUAD</option><option value="DUO">DUO</option><option value="SOLO">SOLO</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input className="bg-black border border-white/10 rounded-xl p-3 text-xs text-white" type="number" value={editForm.total_slots} onChange={(e) => setEditForm({...editForm, total_slots: parseInt(e.target.value)})} placeholder="Slots" />
                    <select className="bg-black border border-white/10 rounded-xl p-3 text-xs text-white" value={editForm.map} onChange={(e) => setEditForm({...editForm, map: e.target.value})}>
                      <option>BERMUDA</option><option>PURGATORY</option><option>KALAHARI</option>
                    </select>
                  </div>

                  <input type="datetime-local" className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs text-white scheme-dark" onChange={(e) => setEditForm({...editForm, start_time: e.target.value})} />

                  <div className="grid grid-cols-2 gap-2">
                    <input className="bg-black border border-white/10 rounded-xl p-3 text-xs text-white" type="number" value={editForm.prize_pool} onChange={(e) => setEditForm({...editForm, prize_pool: e.target.value})} placeholder="Prize" />
                    <input className="bg-black border border-white/10 rounded-xl p-3 text-xs text-white" type="number" value={editForm.entry_fee} onChange={(e) => setEditForm({...editForm, entry_fee: e.target.value})} placeholder="Fee" />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button onClick={() => handleUpdate(t.id)} className="flex-1 bg-green-600 text-white font-black py-4 rounded-xl text-[10px] uppercase">Update Match</button>
                    <button onClick={() => setEditingId(null)} className="px-8 bg-white/5 text-gray-500 font-black rounded-xl text-[10px] uppercase">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-white italic uppercase leading-none tracking-tight">{t.title}</h3>
                    <p className="text-[9px] text-[#FF6B00] font-bold uppercase mt-2 tracking-widest">{t.game_mode} • {t.format} • ₹{t.entry_fee}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingId(t.id); setEditForm(t); }} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2.5" /></svg>
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}