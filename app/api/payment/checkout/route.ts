import { NextRequest, NextResponse } from 'next/server'

const PLANS = {
  'Basic': { price: 499, credits: 352, name: 'Basic Plan' },
  'Standard': { price: 699, credits: 681, name: 'Standard Plan' },
  'Pro': { price: 1099, credits: 1197, name: 'Pro Plan' },
  'credits-100': { price: 199, credits: 100, name: '100 Credits' },
  'credits-300': { price: 499, credits: 300, name: '300 Credits' },
  'credits-500': { price: 699, credits: 500, name: '500 Credits' },
  'credits-1000': { price: 1399, credits: 1000, name: '1000 Credits' },
  'credits-3000': { price: 3399, credits: 3000, name: '3000 Credits' },
}

const PRODUCT_IDS = {
  'Basic': 'prod_5zY6k18pp32ry5DSfSfsfT',
  'Standard': 'prod_4iRgcEm39caf3jvubd8bR6',
  'Pro': 'prod_7O1Puz3IAf4tK0A6GlLtJg',
  'credits-100': 'prod_7crRfuLb0zchETDvLdCaWp',
  'credits-300': 'prod_6t2EwoXzQhgLJdDpED3VBS',
  'credits-500': 'prod_1fIoubCxCQro1F7sdFraZI',
  'credits-1000': 'prod_6V3Tv6i778fCiyhHqFQZlM',
  'credits-3000': 'prod_1WHEODEOAZGC9c6AaEA61x',
}

export async function POST(req: NextRequest) {
  try {
    const { type, planId, userId } = await req.json()
    const plan = PLANS[planId as keyof typeof PLANS]

    if (!plan) {
      return NextResponse.json({ error: '无效的方案' }, { status: 400 })
    }

    const response = await fetch('https://api.creem.io/v1/checkouts', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CREEM_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: PRODUCT_IDS[planId as keyof typeof PRODUCT_IDS],
        request_id: `req_${Date.now()}`,
        units: 1,
        customer: {
          email: userId,
        },
        success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/success`,
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

    // Creem 返回的字段是 checkout_url
    const checkoutUrl = data.checkout_url

    if (!checkoutUrl) {
      console.error('No checkout_url in response:', data)
      return NextResponse.json({
        error: '未收到支付链接',
        debug: data
      }, { status: 500 })
    }

    return NextResponse.json({ url: checkoutUrl })
  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
