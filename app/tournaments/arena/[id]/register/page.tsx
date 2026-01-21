'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function RegisterTeam() {
  const params = useParams()
  const router = useRouter()
  const [tournament, setTournament] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [roster, setRoster] = useState<string[]>([])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchFormat = async () => {
      const { data } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', params.id)
        .single()
      
      if (data) {
        setTournament(data)
        const slotCount = data.format === 'SQUAD' ? 4 : data.format === 'DUO' ? 2 : 1
        setRoster(new Array(slotCount).fill(''))
      }
    }
    fetchFormat()
  }, [params.id, supabase])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      // 1. Calculate how many slots this registration takes
      const incrementValue = tournament.format === 'SQUAD' ? 4 : tournament.format === 'DUO' ? 2 : 1;

      // 2. Check if there are enough slots left
      const remaining = tournament.total_slots - tournament.joined_count;
      if (incrementValue > remaining) {
        throw new Error(`Only ${remaining} slots left! This ${tournament.format} registration requires ${incrementValue}.`);
      }

      // 3. Create the registration entry
      const { error: regError } = await supabase.from('registrations').insert({
        user_id: user.id,
        tournament_id: parseInt(params.id as string),
        player_names: roster
      })

      if (regError) throw regError

      // 4. Trigger the updated SQL function with the correct amount
      const { error: rpcError } = await supabase.rpc('increment_joined_count', { 
        row_id: parseInt(params.id as string),
        amount: incrementValue // Passing 4, 2, or 1
      })

      if (rpcError) throw rpcError

      alert('Squad Registered! Slots Updated.')
      router.push('/profile/my-matches')
    } catch (err: any) {
      alert(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pb-32 px-4 max-w-xl mx-auto">
      <div className="mt-10 mb-8">
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Assemble Roster</h2>
        <p className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-widest mt-2">
            Registering for {tournament?.format} ({tournament?.format === 'SQUAD' ? '4 Slots' : tournament?.format === 'DUO' ? '2 Slots' : '1 Slot'})
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {roster.map((name, index) => (
          <div key={index} className="space-y-2 bg-[#111] p-5 rounded-3xl border border-white/5">
            <label className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">
              {index === 0 ? 'Your IGN (Leader)' : `Teammate ${index + 1} IGN`}
            </label>
            <input 
              type="text" required
              placeholder="ENTER NAME"
              className="w-full bg-transparent text-white font-black italic uppercase outline-none placeholder:text-gray-800"
              value={name}
              onChange={(e) => {
                const newRoster = [...roster]
                newRoster[index] = e.target.value
                setRoster(newRoster)
              }}
            />
          </div>
        ))}
        
        <button 
          disabled={loading}
          className="w-full bg-[#FF6B00] text-white font-black py-6 rounded-2xl uppercase italic tracking-widest mt-6 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-orange-950/20"
        >
          {loading ? 'Securing Slots...' : 'Confirm Registration'}
        </button>
      </form>
    </div>
  )
}