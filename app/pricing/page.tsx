"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

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
      price: billingCycle === 'monthly' ? 9 : 15,
      originalPrice: billingCycle === 'monthly' ? 15 : 25,
      monthlyCredits: 1500,
      extraCredits: "$1=100",
      features: [
        "每月积分",
        "额外充值",
        "750张图像",
        "250个视频",
      ],
      planId: "Basic",
    },
    {
      name: "PRO",
      nameZh: "专业版",
      subtitle: "适合高频创作与持续产出",
      price: billingCycle === 'monthly' ? 30 : 35,
      originalPrice: billingCycle === 'monthly' ? 35 : 45,
      monthlyCredits: 3500,
      extraCredits: "$1=107",
      popular: true,
      bonus: "+赠送7%",
      features: [
        "每月积分",
        "额外充值",
        "1750张图像",
        "583个视频",
      ],
      planId: "Standard",
    },
    {
      name: "ULTIMATE",
      nameZh: "旗舰版",
      subtitle: "适合大批量稳定产出与交付",
      price: billingCycle === 'monthly' ? 306 : 360,
      originalPrice: billingCycle === 'monthly' ? 360 : 420,
      monthlyCredits: 36000,
      extraCredits: "$1=115",
      bonus: "+赠送15%",
      features: [
        "每月积分",
        "额外充值",
        "18000张图像",
        "6000个视频",
      ],
      planId: "Pro",
    },
  ]

  const creditPacks = [
    { credits: 650, bonus: 50, images: 160, price: 28.00 },
    { credits: 1450, bonus: 200, images: 362, price: 58.00 },
    { credits: 2650, bonus: 550, images: 662, price: 98.00 },
    { credits: 5700, bonus: 1460, images: 1425, price: 198.00 },
    { credits: 9600, bonus: 3218, images: 2400, price: 298.00 },
    { credits: 22800, bonus: 10000, images: 5700, price: 598.00 },
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

        {/* 计费周期切换 */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            月付
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-full font-medium transition-all relative ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            年付
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">
              30% OFF
            </span>
          </button>
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
                  <span className="text-gray-400 line-through text-lg">${plan.originalPrice}</span>
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/月</span>
                </div>
                <p className="text-sm text-gray-500">
                  按{billingCycle === 'monthly' ? '月' : '年'}计费，次月起 ${plan.originalPrice}/月
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">购买椒图积分</h2>
          <p className="text-gray-600 text-lg">选择花椒粒套餐，立即开始创作</p>
        </div>

        {/* 积分包 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creditPacks.map((pack) => (
            <Card
              key={pack.credits}
              className="p-6 border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="text-pink-500 text-2xl">⚡</div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-gray-900">{pack.credits}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    含赠送 {pack.bonus}
                  </div>
                  <div className="text-sm text-gray-500">
                    约可生成 {pack.images} 张图片 *花椒粒长期有效
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-gray-400">¥</span>
                <span className="text-4xl font-bold text-gray-900">{pack.price.toFixed(2)}</span>
              </div>

              <Button
                onClick={() => handleCheckout(`credits-${pack.credits}`, 'payment')}
                disabled={loading === `credits-${pack.credits}`}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold"
              >
                {loading === `credits-${pack.credits}` ? '处理中...' : '立即购买'}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
