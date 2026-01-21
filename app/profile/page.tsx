'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import EditProfileModal from '@/components/EditProfileModal'

export default function Profile() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchFullProfile = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      const { data: dbData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()
      
      if (dbData) {
        setProfile(dbData)
      } else {
        // Fallback to Auth metadata
        setProfile({
          id: authUser.id,
          username: authUser.user_metadata?.username || 'Player',
          gid: 'Generating...',
          is_admin: false,
          avatar_url: null,
          banner_url: null
        })
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchFullProfile()
  }, [supabase])

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#0a0a0a]">
      <div className="w-12 h-12 border-4 border-[#FF6B00]/20 border-t-[#FF6B00] rounded-full animate-spin mb-4"></div>
      <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em]">Loading Vault...</span>
    </div>
  )

  return (
    <div className="font-sans pb-28">
      
      {/* IMMERSIVE PROFILE HEADER */}
      <div className="bg-[#121212] border border-white/5 rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl ring-1 ring-white/10 relative">
        
        {/* Banner with Neon Overlay */}
        <div className="h-40 w-full bg-[#1a1a1a] relative">
          {profile?.banner_url ? (
            <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-[#FF6B00] to-black opacity-40"></div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#121212] via-transparent to-transparent"></div>
        </div>

        <div className="px-6 pb-8 relative">
          {/* Avatar with Status Ring */}
          <div className="relative -top-12 -mb-8">
            <div className="w-28 h-28 rounded-full border-[6px] border-[#121212] bg-[#1a1a1a] overflow-hidden flex items-center justify-center shadow-2xl">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-[#FF6B00] italic">
                  {profile?.username?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {/* Active Status Indicator */}
            <div className="absolute bottom-1 right-2 w-6 h-6 bg-green-500 border-4 border-[#121212] rounded-full shadow-lg"></div>
          </div>

          {/* Identity Section */}
          <div className="mt-4 flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                    {profile?.username}
                </h2>
                <div className="inline-flex items-center gap-2 mt-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest">
                        Gamer ID
                    </span>
                    <span className="text-xs font-black text-white tracking-widest">
                        #{profile?.gid}
                    </span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION MENU */}
      <div className="px-2 space-y-3">
        
        {/* MY MATCHES BUTTON */}
        <Link 
          href="/profile/my-matches"
          className="w-full group bg-[#151515] border border-white/5 p-6 rounded-4xl flex items-center justify-between hover:border-[#FF6B00]/40 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-2xl flex items-center justify-center text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-black transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-left">
                <span className="block text-sm font-black text-white uppercase italic tracking-tighter">My Matches</span>
                <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest">Your Joined Arenas</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round"/></svg>
          </div>
        </Link>

        {/* EDIT LOADOUT BUTTON */}
        <button 
          onClick={() => setIsEditOpen(true)}
          className="w-full group bg-[#151515] border border-white/5 p-6 rounded-4xl flex items-center justify-between hover:border-[#FF6B00]/40 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-[#FF6B00] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div className="text-left">
                <span className="block text-sm font-black text-white uppercase italic tracking-tighter">Edit Loadout</span>
                <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest">Avatar & Banner Vault</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#FF6B00] group-hover:border-transparent transition-all">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round"/></svg>
          </div>
        </button>

        {/* ADMIN PANEL */}
        {profile?.is_admin && (
          <Link href="/admin" className="w-full flex items-center justify-between p-6 bg-orange-950/5 border border-[#FF6B00]/20 rounded-4xl hover:bg-orange-950/10 transition-all">
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-2xl flex items-center justify-center text-[#FF6B00]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <span className="text-sm font-black text-white uppercase italic">Staff Command</span>
            </div>
            <div className="bg-[#FF6B00] text-black text-[9px] px-3 py-1 rounded-full font-black uppercase shadow-lg shadow-orange-600/30">Admin</div>
          </Link>
        )}

        {/* LOGOUT */}
        <button 
          onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
          className="w-full flex items-center gap-4 p-6 text-red-500/50 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="text-xs font-black uppercase tracking-[0.3em] italic">Logout</span>
        </button>
      </div>

      {/* LOADOUT VAULT MODAL */}
      <EditProfileModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        userId={profile?.id}
        profile={profile}
        onUpdate={fetchFullProfile}
      />
    </div>
  )
}