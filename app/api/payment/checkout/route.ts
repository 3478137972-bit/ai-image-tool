import { NextRequest, NextResponse } from 'next/server'

const PLANS = {
  'Basic': { price: 2900, credits: 380, name: '一级会员' },
  'Standard': { price: 4900, credits: 681, name: '二级会员' },
  'Pro': { price: 7900, credits: 1197, name: '三级会员' },
  'credits-100': { price: 1100, credits: 100, name: '100积分' },
  'credits-300': { price: 3100, credits: 300, name: '300积分' },
  'credits-500': { price: 5000, credits: 500, name: '500积分' },
  'credits-1000': { price: 9500, credits: 1000, name: '1000积分' },
  'credits-3000': { price: 24000, credits: 3000, name: '3000积分' },
}

export async function POST(req: NextRequest) {
  try {
    const { type, planId, userId } = await req.json()
    const plan = PLANS[planId as keyof typeof PLANS]

    if (!plan) {
      return NextResponse.json({ error: '无效的方案' }, { status: 400 })
    }

    const response = await fetch('https://test-api.creem.io/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CREEM_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/pricing`,
        mode: type === 'subscription' ? 'subscription' : 'payment',
        customer_email: userId,
        line_items: [{
          price_data: {
            currency: 'cny',
            product_data: {
              name: plan.name,
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        }],
        metadata: {
          userId,
          planId,
          type,
          credits: plan.credits,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Creem API error:', data)
      throw new Error(data.message || 'Payment failed')
    }

    return NextResponse.json({ url: data.url })
  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
