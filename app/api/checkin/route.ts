import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const today = new Date().toISOString().split('T')[0]

    // 检查今天是否已签到
    const { data: existingCheckin } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .eq('checkin_date', today)
      .single()

    if (existingCheckin) {
      return NextResponse.json({
        alreadyCheckedIn: true,
        message: '今天已签到'
      })
    }

    // 创建签到记录
    await supabase
      .from('checkins')
      .insert({ user_id: userId, checkin_date: today })

    // 赠送积分
    const DAILY_CREDITS = 10
    const { data: userCredits } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single()

    if (userCredits) {
      await supabase
        .from('user_credits')
        .update({ credits: userCredits.credits + DAILY_CREDITS })
        .eq('user_id', userId)
    } else {
      await supabase
        .from('user_credits')
        .insert({ user_id: userId, credits: DAILY_CREDITS })
    }

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
