"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CreditBalance() {
  const [credits, setCredits] = useState(0)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchCredits(session.user.id)
        performDailyCheckin(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchCredits(session.user.id)
        performDailyCheckin(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchCredits = async (userId: string) => {
    const { data } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single()

    if (data) {
      setCredits(data.credits)
    }
  }

  const performDailyCheckin = async (userId: string) => {
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()

      if (data.success) {
        fetchCredits(userId)
      }
    } catch (error) {
      console.error('Check-in error:', error)
    }
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-full border border-blue-200">
      <div className="flex items-center gap-2">
        <span className="text-pink-500 text-xl">⚡</span>
        <div className="text-sm">
          <div className="text-gray-500 text-xs">花椒粒</div>
          <div className="font-bold text-gray-900">{credits}</div>
        </div>
      </div>
      <Link href="/pricing">
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-1 text-sm rounded-full">
          升级
        </Button>
      </Link>
    </div>
  )
}
