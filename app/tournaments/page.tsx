'use client'

import Link from 'next/link'

export default function TournamentsHub() {
  const gameModes = [
    { 
      id: 'br', 
      name: 'BATTLE ROYALE', 
      // UPDATED: Added /mode/ to the path to match your folder structure
      path: '/tournaments/mode/battle-royale', 
      img: 'https://ukwwnndlkuyhahmsxjma.supabase.co/storage/v1/object/sign/tournament/wp8356894-2021-free-fire-wallpapers.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wODc0MDE1ZC04YTlhLTRjODQtYmVkMC0xYzQyOWVjMGExOTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0b3VybmFtZW50L3dwODM1Njg5NC0yMDIxLWZyZWUtZmlyZS13YWxscGFwZXJzLmpwZyIsImlhdCI6MTc2ODkyMTA0MCwiZXhwIjoxODAwNDU3MDQwfQ.NX62RbsmI-ZofWS_jPC77I6rbVGyqufSBF9pwrHBFpw'
    },
    { 
      id: 'cs', 
      name: 'CLASH SQUAD', 
      // UPDATED: Added /mode/ to the path
      path: '/tournaments/mode/clash-squad', 
      img: 'https://ukwwnndlkuyhahmsxjma.supabase.co/storage/v1/object/sign/tournament/wp8571139-free-fire-team-wallpapers.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wODc0MDE1ZC04YTlhLTRjODQtYmVkMC0xYzQyOWVjMGExOTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0b3VybmFtZW50L3dwODU3MTEzOS1mcmVlLWZpcmUtdGVhbS13YWxscGFwZXJzLmpwZyIsImlhdCI6MTc2ODkyMTI2NCwiZXhwIjoxODAwNDU3MjY0fQ.gWXaFihIpPJjuEss4DCOI-eCgIG3sbZnBU0yBifX_0E'
    },
    { 
      id: 'lw', 
      name: 'LONE WOLF', 
      // UPDATED: Added /mode/ to the path
      path: '/tournaments/mode/lone-wolf', 
      img: 'https://ukwwnndlkuyhahmsxjma.supabase.co/storage/v1/object/sign/tournament/wp9055400-4k-garena-free-fire-wallpapers.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wODc0MDE1ZC04YTlhLTRjODQtYmVkMC0xYzQyOWVjMGExOTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0b3VybmFtZW50L3dwOTA1NTQwMC00ay1nYXJlbmEtZnJlZS1maXJlLXdhbGxwYXBlcnMuanBnIiwiaWF0IjoxNzY4OTIxMzQ0LCJleHAiOjE4MDA0NTczNDR9.gM3AIPDkOD7LqMGpb4W-pl89g8FOyL4fOYu_JSWgWVU'
    },
    { 
      id: 'sa', 
      name: 'STATS ARENA', 
      // UPDATED: Added /mode/ to the path
      path: '/tournaments/mode/stats-arena', 
      img: 'https://ukwwnndlkuyhahmsxjma.supabase.co/storage/v1/object/sign/tournament/wp8975622-hd-4k-free-fire-wallpapers.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wODc0MDE1ZC04YTlhLTRjODQtYmVkMC0xYzQyOWVjMGExOTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0b3VybmFtZW50L3dwODk3NTYyMi1oZC00ay1mcmVlLWZpcmUtd2FsbHBhcGVycy5qcGciLCJpYXQiOjE3Njg5MjExODUsImV4cCI6MTgwMDQ1NzE4NX0.T-kPFmhBzkS8_SHJauuAM4a__PG8KaWVe5qjaXBnZHE'
    },
  ]

  return (
    <div className="pb-32 px-4 max-w-xl mx-auto">
      <div className="mb-10 mt-6">
        <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none">
          Select <span className="text-[#FF6B00]">Mode</span>
        </h1>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Choose your battlefield</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {gameModes.map((mode) => (
          <Link key={mode.id} href={mode.path} className="block active:scale-95 transition-transform">
            <div className="relative aspect-square rounded-4xl overflow-hidden border border-white/10 shadow-2xl bg-[#111]">
              
              {/* Background Image */}
              <img 
                src={mode.img} 
                alt={mode.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Dark Overlay for Text Clarity */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>
              
              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
                <span className="text-[12px] font-black text-white uppercase tracking-[0.2em] text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {mode.name}
                </span>
                
                {/* Decorative Accent Line */}
                <div className="w-6 h-1 bg-[#FF6B00] mt-2 rounded-full"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}