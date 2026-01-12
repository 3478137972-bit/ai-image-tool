"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleCheckout = async (planId: string, type: 'subscription' | 'payment') => {
    if (!user) {
      alert('请先登录')
      return
    }

    const userId = user.email || user.id || 'guest'

    setLoading(planId)
    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, planId, userId }),
      })
      const data = await res.json()

      console.log('Payment response:', data)

      if (data.url) {
        window.location.href = data.url
      } else {
        const errorMsg = data.error || '支付失败'
        console.error('Payment error:', errorMsg)
        alert(`支付失败: ${errorMsg}`)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      alert(`支付失败: ${error}`)
    } finally {
      setLoading(null)
    }
  }
  const membershipPlans = [
    {
      name: "一级会员",
      nameEn: "Basic",
      price: 4.20,
      credits: 380,
      discount: "75折",
      features: [
        "每月380积分",
        "约63-126张图片",
        "所有AI模型",
        "标准生成速度",
      ],
    },
    {
      name: "二级会员",
      nameEn: "Standard",
      price: 7.10,
      credits: 681,
      discount: "7折",
      popular: true,
      features: [
        "每月681积分",
        "约113-227张图片",
        "所有AI模型",
        "优先生成队列",
      ],
    },
    {
      name: "三级会员",
      nameEn: "Pro",
      price: 11.40,
      credits: 1197,
      discount: "65折",
      features: [
        "每月1197积分",
        "约199-399张图片",
        "所有AI模型",
        "最高优先级",
      ],
    },
  ]

  const creditPacks = [
    { credits: 100, price: 1.60 },
    { credits: 300, price: 4.50 },
    { credits: 500, price: 7.20 },
    { credits: 1000, price: 13.70 },
    { credits: 3000, price: 34.60, popular: true },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            🎉 限时优惠：年付享8折优惠
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">选择您的完美方案</h1>
          <p className="text-lg text-gray-600">无限创意从这里开始</p>
        </div>

        {/* 会员方案 */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">会员订阅</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {membershipPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-8 relative bg-white hover:shadow-xl transition-all ${plan.popular ? "border-3 border-purple-400 shadow-xl scale-105" : "border-2 border-blue-200"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    ⭐ 最受欢迎
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.nameEn}</p>
                  <div className="mb-3">
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${plan.price}</span>
                    <span className="text-gray-500 text-lg">/月</span>
                  </div>
                  <div className="text-sm text-blue-700 font-bold bg-gradient-to-r from-blue-100 to-purple-100 inline-block px-4 py-1.5 rounded-full">{plan.discount} 优惠</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full font-bold ${plan.popular ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg" : "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-2 border-blue-400 hover:from-blue-100 hover:to-purple-100"}`}
                  onClick={() => handleCheckout(plan.nameEn, 'subscription')}
                  disabled={loading === plan.nameEn}
                >
                  {loading === plan.nameEn ? '处理中...' : '立即订阅'}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* 积分包 */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">积分包</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {creditPacks.map((pack) => (
              <Card
                key={pack.credits}
                className={`p-6 text-center bg-white hover:shadow-lg transition-all ${pack.popular ? "border-3 border-purple-400 shadow-md" : "border-2 border-blue-200"}`}
              >
                {pack.popular && (
                  <div className="text-xs text-blue-700 font-bold mb-2 bg-gradient-to-r from-blue-100 to-purple-100 inline-block px-3 py-1 rounded-full">最优惠</div>
                )}
                <div className="text-3xl font-bold mb-2 text-gray-800">{pack.credits}</div>
                <div className="text-sm text-gray-500 mb-4">积分</div>
                <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${pack.price}</div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-2 border-blue-400 hover:from-blue-100 hover:to-purple-100 font-bold"
                  size="sm"
                  onClick={() => handleCheckout(`credits-${pack.credits}`, 'payment')}
                  disabled={loading === `credits-${pack.credits}`}
                >
                  {loading === `credits-${pack.credits}` ? '处理中...' : '购买'}
                </Button>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-8">
            积分永久有效 · 可随时使用
          </p>
        </div>

        {/* 积分消耗说明 */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">积分消耗说明</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center bg-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="font-bold mb-2 text-gray-800">Nano Banana</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">3</div>
              <div className="text-sm text-gray-500">积分/张</div>
            </Card>
            <Card className="p-6 text-center bg-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="font-bold mb-2 text-gray-800">Nano Banana Pro</div>
              <div className="text-sm text-gray-500 mb-2">1k / 2k</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">6</div>
              <div className="text-sm text-gray-500">积分/张</div>
            </Card>
            <Card className="p-6 text-center bg-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="font-bold mb-2 text-gray-800">Nano Banana Pro</div>
              <div className="text-sm text-gray-500 mb-2">4k</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">12</div>
              <div className="text-sm text-gray-500">积分/张</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
