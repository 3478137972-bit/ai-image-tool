import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    console.log('[Check-in] Request received for userId:', userId)

    if (!userId) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const today = new Date().toISOString().split('T')[0]
    console.log('[Check-in] Today date:', today)

    // 检查今天是否已签到
    const { data: existingCheckin, error: checkError } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .eq('checkin_date', today)
      .single()

    console.log('[Check-in] Existing check-in:', existingCheckin, 'Error:', checkError)

    if (existingCheckin) {
      console.log('[Check-in] Already checked in today')
      return NextResponse.json({
        alreadyCheckedIn: true,
        message: '今天已签到'
      })
    }

    // 创建签到记录
    const { error: insertError } = await supabase
      .from('checkins')
      .insert({ user_id: userId, checkin_date: today })

    console.log('[Check-in] Insert check-in record error:', insertError)

    // 赠送积分
    const DAILY_CREDITS = 6
    const { data: userCredits } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single()

    console.log('[Check-in] Current credits:', userCredits?.credits)

    if (userCredits) {
      const newCredits = userCredits.credits + DAILY_CREDITS
      console.log('[Check-in] Updating credits from', userCredits.credits, 'to', newCredits)
      await supabase
        .from('user_credits')
        .update({ credits: newCredits })
        .eq('user_id', userId)
    } else {
      console.log('[Check-in] Creating new credit record with', DAILY_CREDITS, 'credits')
      await supabase
        .from('user_credits')
        .insert({ user_id: userId, credits: DAILY_CREDITS })
    }

    console.log('[Check-in] Check-in successful, awarded', DAILY_CREDITS, 'credits')
    return NextResponse.json({
      success: true,
      credits: DAILY_CREDITS,
      message: `签到成功，获得 ${DAILY_CREDITS} 积分`
    })
  } catch (error: any) {
    console.error('Check-in error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
