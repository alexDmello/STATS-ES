'use client'

import React from 'react'
import { useRouter } from 'next/navigation' // Added for navigation
import { formatTournamentTime } from '@/utils/formatTime'

export default function TournamentCard({ tournament }: { tournament: any }) {
  const router = useRouter() // Initialize the router

  // Use the utility to get locked time and date
  const { date: formattedDate, time: formattedTime } = formatTournamentTime(tournament.start_time);

  return (
    <div className="relative bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden group mb-4">
      {/* HIGH VISIBILITY DATE HEADER */}
      <div className="bg-linear-to-r from-[#FF6B00] to-[#CC5500] px-6 py-2">
        <span className="text-[10px] font-black text-black uppercase tracking-widest leading-none">
          MATCH DATE: {formattedDate}
        </span>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="max-w-[60%]">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none wrap-break-word">
              {tournament.title}
            </h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="text-[#FF6B00]">●</span> {tournament.game_mode}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Prize Pool</p>
            <p className="text-2xl font-black text-[#FF6B00] italic leading-none">₹{tournament.prize_pool}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 py-4 border-y border-white/5 my-5 bg-white/1 rounded-2xl">
          <div className="text-center">
            <p className="text-[7px] font-bold text-gray-600 uppercase mb-1">Entry</p>
            <p className="text-xs font-black text-white italic">₹{tournament.entry_fee}</p>
          </div>
          <div className="text-center border-x border-white/10">
            <p className="text-[7px] font-bold text-gray-600 uppercase mb-1">Map</p>
            <p className="text-xs font-black text-white italic uppercase">{tournament.map}</p>
          </div>
          <div className="text-center">
            <p className="text-[7px] font-bold text-gray-600 uppercase mb-1">Slots Left</p>
            <p className="text-xs font-black text-white italic">
              {(tournament.total_slots || 48) - (tournament.joined_count || 0)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#FF6B00] border border-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <p className="text-[8px] font-bold text-gray-600 uppercase leading-none mb-1">Starts At</p>
                <p className="text-sm font-black text-white uppercase italic tracking-tighter">{formattedTime}</p>
            </div>
          </div>
          
          {/* UPDATED: Added onClick to navigate to the detailed arena page */}
          <button 
            onClick={() => router.push(`/tournaments/arena/${tournament.id}`)}
            className="bg-white text-black px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-90 transition-all cursor-pointer"
          >
            Join Match
          </button>
        </div>
      </div>
    </div>
  )
}