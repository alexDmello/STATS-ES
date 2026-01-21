'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function BannerVault() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form States
  const [newBanner, setNewBanner] = useState({ name: '', url: '', link_path: '/' })
  const [editForm, setEditForm] = useState({ name: '', url: '', link_path: '/' })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchBanners = async () => {
    setLoading(true)
    const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false })
    if (data) setBanners(data)
    setLoading(false)
  }

  useEffect(() => { fetchBanners() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('banners').insert([newBanner])
    if (!error) {
      setNewBanner({ name: '', url: '', link_path: '/' })
      setShowAddForm(false)
      fetchBanners()
    }
  }

  const handleUpdate = async (id: string) => {
    const { error } = await supabase.from('banners').update(editForm).eq('id', id)
    if (!error) {
      setEditingId(null)
      fetchBanners()
    }
  }

  const startEditing = (banner: any) => {
    setEditingId(banner.id)
    setEditForm({ name: banner.name, url: banner.url, link_path: banner.link_path })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete asset?')) return
    const { error } = await supabase.from('banners').delete().eq('id', id)
    if (!error) fetchBanners()
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('banners').update({ is_active: !currentStatus }).eq('id', id)
    if (!error) fetchBanners()
  }

  return (
    <div className="font-sans pb-20 max-w-5xl mx-auto px-4">
      {/* PERSISTENT BACK NAV */}
      <div className="flex items-center gap-4 mb-10 mt-6">
        <Link href="/admin" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all border border-white/5">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Banner Vault</h2>
          <p className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest mt-1">Return to Hub</p>
        </div>
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-end mb-12">
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#FF6B00] hover:text-white transition-all"
        >
          {showAddForm ? 'Close' : 'Add New'}
        </button>
      </div>

      {/* ADD FORM */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="mb-12 p-8 bg-[#111] border-2 border-[#FF6B00]/20 rounded-[3rem] animate-in slide-in-from-top duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input placeholder="Asset Name" required className="bg-black border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-[#FF6B00]" onChange={(e) => setNewBanner({...newBanner, name: e.target.value})} />
            <input placeholder="Image URL" required className="bg-black border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-[#FF6B00]" onChange={(e) => setNewBanner({...newBanner, url: e.target.value})} />
            <input placeholder="Target Link" required className="bg-black border-[#FF6B00]/20 border rounded-2xl p-5 text-[#FF6B00] outline-none" onChange={(e) => setNewBanner({...newBanner, link_path: e.target.value})} />
          </div>
          <button className="w-full mt-6 bg-[#FF6B00] text-white font-black py-5 rounded-2xl uppercase tracking-widest italic shadow-lg">Store & Link Asset</button>
        </form>
      )}

      {/* ASSET LIST */}
      <div className="grid grid-cols-1 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden group">
            <div className="flex flex-col md:flex-row">
              {/* Image Preview */}
              <div className="w-full md:w-48 h-48 relative shrink-0">
                <img src={banner.url} className="w-full h-full object-cover" alt="" />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[8px] font-black uppercase ${banner.is_active ? 'bg-green-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                  {banner.is_active ? 'Live' : 'Hidden'}
                </div>
              </div>

              {/* Data Content */}
              <div className="p-8 flex-1 flex flex-col justify-center">
                {editingId === banner.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input className="bg-black border border-white/10 rounded-xl p-3 text-xs text-white" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                    <input className="bg-black border border-white/10 rounded-xl p-3 text-xs text-white" value={editForm.url} onChange={(e) => setEditForm({...editForm, url: e.target.value})} />
                    <input className="bg-black border border-[#FF6B00]/40 rounded-xl p-3 text-xs text-[#FF6B00]" value={editForm.link_path} onChange={(e) => setEditForm({...editForm, link_path: e.target.value})} />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic">{banner.name}</h3>
                    <p className="text-[10px] text-[#FF6B00] font-bold uppercase tracking-widest mt-1">Target: {banner.link_path}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-8 flex items-center gap-3 bg-black/20">
                {editingId === banner.id ? (
                  <>
                    <button onClick={() => handleUpdate(banner.id)} className="px-6 py-3 bg-green-600 text-white rounded-xl font-black text-[10px] uppercase">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-6 py-3 bg-white/5 text-gray-400 rounded-xl font-black text-[10px] uppercase">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleToggle(banner.id, banner.is_active)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${banner.is_active ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-500'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5.636 18.364a9 9 0 1112.728 0M12 3v9" /></svg>
                    </button>
                    <button onClick={() => startEditing(banner)} className="w-12 h-12 rounded-2xl bg-white/5 text-gray-400 hover:text-white flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(banner.id)} className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}