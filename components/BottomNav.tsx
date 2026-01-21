'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()
  
  // Define Neon Orange as the active color
  const isActive = (path: string) => pathname === path ? 'text-[#FF6B00]' : 'text-gray-500'

  // Hide BottomNav on Auth and Admin pages
  const isHidden = pathname === '/login' || pathname === '/signup' || pathname === '/admin'
  if (isHidden) return null

  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 bg-[#0a0a0a] border-t border-white/5 flex justify-around items-center pb-2 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
      
      {/* Home */}
      <Link href="/" className={`flex flex-col items-center gap-1 w-16 transition-all ${isActive('/')}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
      </Link>

      {/* Energy / Wallet */}
      <Link href="/wallet" className={`flex flex-col items-center gap-1 w-16 transition-all ${isActive('/wallet')}`}>
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
         </svg>
        <span className="text-[10px] font-bold uppercase tracking-wider">Energy</span>
      </Link>

      {/* Tournaments (Battle) */}
      <Link href="/tournaments" className={`flex flex-col items-center gap-1 w-16 transition-all ${isActive('/tournaments')}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-wider">Battle</span>
      </Link>

      {/* Profile */}
      <Link href="/profile" className={`flex flex-col items-center gap-1 w-16 transition-all ${isActive('/profile')}`}>
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
         </svg>
        <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
      </Link>

    </nav>
  )
}