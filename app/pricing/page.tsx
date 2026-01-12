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

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(`支付失败: ${data.error || '未知错误'}`)
      }
    } catch (error) {
      alert(`支付失败: ${error}`)
    } finally {
      setLoading(null)
    }
  }

  const membershipPlans = [
    {
      name: "BASIC",
      nameZh: "基础版",
      subtitle: "适合初次探索 AI 创作",
      price: 29,
      originalPrice: 39,
      monthlyCredits: 352,
      extraCredits: "¥0.0825/积分",
      features: [
        "每月积分",
        "额外充值",
        "约58-117张图像",
      ],
      planId: "Basic",
    },
    {
      name: "PRO",
      nameZh: "标准版",
      subtitle: "适合高频创作与持续产出",
      price: 49,
      originalPrice: 69,
      monthlyCredits: 681,
      extraCredits: "¥0.072/积分",
      popular: true,
      bonus: "7折优惠",
      features: [
        "每月积分",
        "额外充值",
        "约113-227张图像",
      ],
      planId: "Standard",
    },
    {
      name: "ULTIMATE",
      nameZh: "专业版",
      subtitle: "适合大批量稳定产出与交付",
      price: 79,
      originalPrice: 119,
      monthlyCredits: 1197,
      extraCredits: "¥0.066/积分",
      bonus: "65折优惠",
      features: [
        "每月积分",
        "额外充值",
        "约199-399张图像",
      ],
      planId: "Pro",
    },
  ]

  const creditPacks = [
    { credits: 100, bonus: 0, images: "16-33", price: 11.00, discount: "原价" },
    { credits: 300, bonus: 0, images: "50-100", price: 31.00, discount: "94折" },
    { credits: 500, bonus: 0, images: "83-166", price: 50.00, discount: "91折" },
    { credits: 1000, bonus: 0, images: "166-333", price: 95.00, discount: "86折" },
    { credits: 3000, bonus: 0, images: "500-1000", price: 240.00, discount: "73折" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 px-6 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-100">
            限时优惠
          </div>
          <h1 className="text-5xl font-bold mb-4 text-gray-900">升级您的套餐</h1>
          <p className="text-gray-600 text-lg">选择最适合您的方案，立即开始创作</p>
        </div>

        {/* 会员套餐 */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {membershipPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative p-8 transition-all hover:shadow-2xl ${
                plan.popular
                  ? 'border-2 border-blue-500 shadow-xl scale-105'
                  : 'border border-gray-200 hover:border-blue-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  专业推荐
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-blue-600 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.subtitle}</p>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-gray-400 line-through text-lg">¥{plan.originalPrice}</span>
                  <span className="text-5xl font-bold text-gray-900">¥{plan.price}</span>
                  <span className="text-gray-600">/月</span>
                </div>
                <p className="text-sm text-gray-500">
                  首月优惠价，次月起 ¥{plan.originalPrice}/月
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">每月积分</span>
                  <span className="font-bold text-gray-900">{plan.monthlyCredits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">额外充值</span>
                  <span className="font-bold text-gray-900">{plan.extraCredits}</span>
                </div>
                {plan.bonus && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-2 rounded-lg">
                    <span className="text-blue-600 font-semibold text-sm">{plan.bonus}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => handleCheckout(plan.planId, 'subscription')}
                disabled={loading === plan.planId}
                className={`w-full py-6 text-lg font-semibold rounded-xl transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {loading === plan.planId ? '处理中...' : '升级'}
              </Button>

              <div className="mt-6 space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-3">最多约</p>
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* 积分包标题 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">购买积分</h2>
          <p className="text-gray-600 text-lg">选择积分套餐，立即开始创作</p>
        </div>

        {/* 积分包 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creditPacks.map((pack) => (
            <Card
              key={pack.credits}
              className="relative p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-pink-500 hover:shadow-2xl transition-all overflow-hidden group"
            >
              {/* 背景装饰 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform" />

              <div className="relative z-10">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-pink-500 text-3xl">⚡</div>
                  <div className="flex-1">
                    <div className="text-4xl font-bold text-white mb-1">{pack.credits}</div>
                    <div className="text-sm text-pink-400 font-medium">
                      {pack.discount}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      约可生成 {pack.images} 张图片
                    </div>
                    <div className="text-xs text-gray-500">
                      *积分长期有效
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-4 mt-6">
                  <span className="text-gray-400 text-lg">¥</span>
                  <span className="text-5xl font-bold text-white">{pack.price.toFixed(2)}</span>
                </div>

                <Button
                  onClick={() => handleCheckout(`credits-${pack.credits}`, 'payment')}
                  disabled={loading === `credits-${pack.credits}`}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg"
                >
                  {loading === `credits-${pack.credits}` ? '处理中...' : '立即购买'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
