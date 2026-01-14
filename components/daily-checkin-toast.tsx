"use client"

import { useEffect, useState } from "react"
import { Gift, X } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function DailyCheckinToast() {
  const [show, setShow] = useState(false)
  const [credits, setCredits] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      checkAndShowDailyReward()
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const checkAndShowDailyReward = async () => {
    try {
      console.log('Starting daily checkin check...')
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        console.log('No user session found')
        return
      }

      console.log('User session found:', session.user.id)

      const today = new Date().toISOString().split('T')[0]
      const lastCheckin = localStorage.getItem('lastCheckin')

      console.log('Daily checkin check:', { today, lastCheckin, userId: session.user.id })

      if (lastCheckin !== today) {
        console.log('Showing daily reward popup...')
        const rewardCredits = 10

        // 先显示弹窗
        setCredits(rewardCredits)
        setShow(true)

        // 给用户添加积分
        const { error } = await supabase.rpc('add_credits', {
          user_id: session.user.id,
          amount: rewardCredits
        })

        if (error) {
          console.error('Failed to add daily credits:', error)
        } else {
          console.log('Daily credits added successfully')
          // 只有成功后才记录签到
          localStorage.setItem('lastCheckin', today)
        }

        // 5秒后自动关闭
        setTimeout(() => setShow(false), 5000)
      } else {
        console.log('Already checked in today')
      }
    } catch (error) {
      console.error('Error in daily checkin:', error)
    }
  }

  if (!show) return null

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-2xl p-4 max-w-sm flex items-start gap-3">
        <div className="bg-white/20 rounded-full p-2">
          <Gift className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">Daily Check-in Reward!</h3>
          <p className="text-xs opacity-90">You've received <span className="font-bold">{credits} free credits</span> for logging in today!</p>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
