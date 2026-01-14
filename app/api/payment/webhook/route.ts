import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PLANS = {
  'Basic': { credits: 352 },
  'Standard': { credits: 681 },
  'Pro': { credits: 1197 },
  'credits-100': { credits: 100 },
  'credits-300': { credits: 300 },
  'credits-500': { credits: 500 },
  'credits-1000': { credits: 1000 },
  'credits-3000': { credits: 3000 },
}

const PRODUCT_ID_MAP: Record<string, keyof typeof PLANS> = {
  'prod_5zY6k18pp32ry5DSfSfsfT': 'Basic',
  'prod_4iRgcEm39caf3jvubd8bR6': 'Standard',
  'prod_7O1Puz3IAf4tK0A6GlLtJg': 'Pro',
  'prod_7aS4RjY0sOkat5mpF6MlE2': 'credits-100',
  'prod_6t2EwoXzQhgLJdDpED3VBS': 'credits-300',
  'prod_1fIoubCxCQro1F7sdFraZI': 'credits-500',
  'prod_6V3Tv6i778fCiyhHqFQZlM': 'credits-1000',
  'prod_1WHEODEOAZGC9c6AaEA61x': 'credits-3000',
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('creem-signature')
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await req.text()
    const event = JSON.parse(payload)

    console.log('Webhook event received:', event.type)
    console.log('Event data:', JSON.stringify(event, null, 2))

    if (event.eventType === 'checkout.completed') {
      const orderId = event.object?.order?.id
      const productId = event.object?.order?.product
      const customerEmail = event.object?.customer?.email

      if (!orderId || !customerEmail) {
        console.error('Missing order ID or customer email')
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      // 检查订单是否已处理
      const { data: existingOrder } = await supabase
        .from('payment_records')
        .select('id')
        .eq('order_id', orderId)
        .single()

      if (existingOrder) {
        console.log(`Order ${orderId} already processed, skipping`)
        return NextResponse.json({ success: true, message: 'Already processed' })
      }

      const planKey = PRODUCT_ID_MAP[productId]
      if (!planKey) {
        console.error('Unknown product ID:', productId)
        return NextResponse.json({ error: 'Unknown product' }, { status: 400 })
      }

      const plan = PLANS[planKey]
      const creditsToAdd = plan.credits

      const { data: user } = await supabase.auth.admin.listUsers()
      const targetUser = user.users.find(u => u.email === customerEmail)

      if (!targetUser) {
        console.error('User not found:', customerEmail)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const { data: currentCredits } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', targetUser.id)
        .single()

      const newCredits = (currentCredits?.credits || 0) + creditsToAdd

      const { error } = await supabase
        .from('user_credits')
        .upsert({
          user_id: targetUser.id,
          credits: newCredits,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Failed to update credits:', error)
        return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 })
      }

      // 记录订单
      await supabase
        .from('payment_records')
        .insert({
          order_id: orderId,
          user_id: targetUser.id,
          credits: creditsToAdd,
          created_at: new Date().toISOString(),
        })

      console.log(`Successfully added ${creditsToAdd} credits to user ${customerEmail}`)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
