'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const AVATARS = [
  { id: 'a1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { id: 'a2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
  { id: 'a3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casper' },
  { id: 'a4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy' },
]

const BANNERS = [
  { id: 'b1', url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800' },
  { id: 'b2', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800' },
  { id: 'b3', url: 'https://images.unsplash.com/photo-1579546671170-43428217916c?w=800' },
]

export default function EditProfileModal({ isOpen, onClose, userId, profile, onUpdate }: any) {
  // Initialize selections with current profile data
  const [tempAvatar, setTempAvatar] = useState(profile?.avatar_url)
  const [tempBanner, setTempBanner] = useState(profile?.banner_url)
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSaveLoadout = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({ 
        avatar_url: tempAvatar, 
        banner_url: tempBanner 
      })
      .eq('id', userId)

    if (!error) {
      onUpdate()
      onClose()
    }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-200 bg-[#050505] flex flex-col font-sans overflow-hidden">
      
      {/* TOP HEADER */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div>
          <h2 className="text-3xl font-black italic uppercase text-white leading-none">Loadout Vault</h2>
          <p className="text-[9px] font-bold text-[#FF6B00] uppercase tracking-[0.3em] mt-1">Customize Appearance</p>
        </div>
        <button 
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl hover:bg-white/10 transition-all"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-12">
        
        {/* BANNER SELECTION SECTION */}
        <section>
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-1 h-4 bg-[#FF6B00]"></div>
            <h3 className="text-sm font-black text-white uppercase italic tracking-wider">Select Banner</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BANNERS.map((item) => (
              <button 
                key={item.id}
                onClick={() => setTempBanner(item.url)}
                className={`relative h-28 rounded-2xl overflow-hidden border-2 transition-all ${tempBanner === item.url ? 'border-[#FF6B00] ring-4 ring-[#FF6B00]/20' : 'border-white/5 opacity-50 hover:opacity-100'}`}
              >
                <img src={item.url} className="w-full h-full object-cover" alt="Banner Option" />
                {tempBanner === item.url && (
                   <div className="absolute top-3 right-3 bg-[#FF6B00] text-black p-1 rounded-md shadow-lg">
                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                   </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* AVATAR SELECTION SECTION */}
        <section>
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-1 h-4 bg-[#FF6B00]"></div>
            <h3 className="text-sm font-black text-white uppercase italic tracking-wider">Select Avatar</h3>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {AVATARS.map((item) => (
              <button 
                key={item.id}
                onClick={() => setTempAvatar(item.url)}
                className={`relative aspect-square rounded-2xl bg-[#111] border-2 transition-all p-1 ${tempAvatar === item.url ? 'border-[#FF6B00] ring-4 ring-[#FF6B00]/20 scale-105' : 'border-white/5 opacity-40 hover:opacity-100'}`}
              >
                <img src={item.url} className="w-full h-full object-cover rounded-xl" alt="Avatar Option" />
              </button>
            ))}
          </div>
        </section>

      </div>

      {/* FIXED ACTION BAR */}
      <div className="p-8 bg-black/60 backdrop-blur-2xl border-t border-white/5 flex gap-4">
        <button 
          onClick={onClose}
          className="flex-1 py-4 text-xs font-black uppercase text-gray-500 tracking-widest border border-white/10 rounded-2xl hover:bg-white/5 transition-all"
        >
          Discard
        </button>
        <button 
          onClick={handleSaveLoadout}
          disabled={loading}
          className="flex-2 py-4 bg-[#FF6B00] text-white text-xs font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_10px_40px_rgba(255,107,0,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'Equipping...' : 'Equip Loadout'}
        </button>
      </div>
    </div>
  )
}