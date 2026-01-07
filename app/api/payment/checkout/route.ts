import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { type, planId, userId } = await req.json()

    const response = await fetch('https://api.creem.io/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CREEM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing`,
        mode: type === 'subscription' ? 'subscription' : 'payment',
        customer_email: userId,
        metadata: {
          userId,
          planId,
          type,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Payment failed')
    }

    return NextResponse.json({ url: data.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
