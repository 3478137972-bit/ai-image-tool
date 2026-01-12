import { NextRequest, NextResponse } from 'next/server'

const PLANS = {
  'Basic': { price: 420, credits: 380, name: '一级会员' },
  'Standard': { price: 710, credits: 681, name: '二级会员' },
  'Pro': { price: 1140, credits: 1197, name: '三级会员' },
  'credits-100': { price: 160, credits: 100, name: '100积分' },
  'credits-300': { price: 450, credits: 300, name: '300积分' },
  'credits-500': { price: 720, credits: 500, name: '500积分' },
  'credits-1000': { price: 1370, credits: 1000, name: '1000积分' },
  'credits-3000': { price: 3460, credits: 3000, name: '3000积分' },
}

export async function POST(req: NextRequest) {
  try {
    const { type, planId, userId } = await req.json()
    const plan = PLANS[planId as keyof typeof PLANS]

    if (!plan) {
      return NextResponse.json({ error: '无效的方案' }, { status: 400 })
    }

    const response = await fetch('https://test-api.creem.io/v1/checkouts', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CREEM_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: 'prod_6xFBPWsE0zQASZYaajXP7N',
        request_id: `req_${Date.now()}`,
        units: 1,
        customer: {
          email: userId,
        },
        success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/success`,
        cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/pricing`,
      }),
    })

    const data = await response.json()

    console.log('Creem API response status:', response.status)
    console.log('Creem API response data:', JSON.stringify(data, null, 2))

    if (!response.ok) {
      console.error('Creem API error:', data)
      const errorMessage = data.error?.message || data.message || JSON.stringify(data)
      return NextResponse.json({ error: `Creem API 错误: ${errorMessage}` }, { status: response.status })
    }

    if (!data.url) {
      console.error('No URL in response:', data)
      return NextResponse.json({ error: '未收到支付链接' }, { status: 500 })
    }

    return NextResponse.json({ url: data.url })
  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
