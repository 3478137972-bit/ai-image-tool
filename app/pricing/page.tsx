"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/components/language-provider"
import PaymentModal from "@/components/PaymentModal"

export default function PricingPage() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    planId: string
    type: 'subscription' | 'payment'
    name: string
    price: number
    credits: number
  } | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const openPaymentModal = (planId: string, type: 'subscription' | 'payment', name: string, price: number, credits: number) => {
    if (!user) {
      alert(t('pricing.loginRequired'))
      return
    }
    setSelectedPlan({ planId, type, name, price, credits })
    setModalOpen(true)
  }

  const handleConfirmPayment = async () => {
    if (!selectedPlan || !user) return

    const userId = user.email || user.id || 'guest'
    setLoading(selectedPlan.planId)

    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedPlan.type, planId: selectedPlan.planId, userId }),
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(`Payment failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      alert(`Payment failed: ${error}`)
    } finally {
      setLoading(null)
    }
  }

  const membershipPlans = [
    {
      name: "BASIC",
      nameZh: "基础版",
      subtitle: "适合初次探索 AI 创作",
      price: 4.99,
      originalPrice: 5.99,
      monthlyCredits: 352,
      extraCredits: "$0.012/积分",
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
      price: 6.99,
      originalPrice: 9.99,
      monthlyCredits: 681,
      extraCredits: "$0.010/积分",
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
      price: 10.99,
      originalPrice: 16.99,
      monthlyCredits: 1197,
      extraCredits: "$0.009/积分",
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
    { credits: 100, bonus: 0, images: "16-33", price: 1.99, discount: "原价" },
    { credits: 300, bonus: 0, images: "50-100", price: 4.99, discount: "94折" },
    { credits: 500, bonus: 0, images: "83-166", price: 6.99, discount: "91折" },
    { credits: 1000, bonus: 0, images: "166-333", price: 13.99, discount: "86折" },
    { credits: 3000, bonus: 0, images: "500-1000", price: 33.99, discount: "73折" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 px-6 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-100">
            {t('pricing.badge')}
          </div>
          <h1 className="text-5xl font-bold mb-4 text-gray-900">{t('pricing.title')}</h1>
          <p className="text-gray-600 text-lg">{t('pricing.subtitle')}</p>
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
                  {t('pricing.recommended')}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-blue-600 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.subtitle}</p>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-gray-400 line-through text-lg">${plan.originalPrice}</span>
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">{t('pricing.perMonth')}</span>
                </div>
                <p className="text-sm text-gray-500">
                  {t('pricing.firstMonth')} ${plan.originalPrice}{t('pricing.perMonth')}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">{t('pricing.monthlyCredits')}</span>
                  <span className="font-bold text-gray-900">{plan.monthlyCredits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">{t('pricing.extraCredits')}</span>
                  <span className="font-bold text-gray-900">{plan.extraCredits}</span>
                </div>
                {plan.bonus && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-2 rounded-lg">
                    <span className="text-blue-600 font-semibold text-sm">{plan.bonus}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => openPaymentModal(plan.planId, 'subscription', plan.nameZh, plan.price, plan.monthlyCredits)}
                disabled={loading === plan.planId}
                className={`w-full py-6 text-lg font-semibold rounded-xl transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {loading === plan.planId ? t('pricing.processing') : t('pricing.upgrade')}
              </Button>

              <div className="mt-6 space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-3">{t('pricing.mostValue')}</p>
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('pricing.buyCredits')}</h2>
          <p className="text-gray-600 text-lg">{t('pricing.buyCreditsSubtitle')}</p>
        </div>

        {/* 积分包 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creditPacks.map((pack) => (
            <Card
              key={pack.credits}
              className="relative p-8 border border-gray-200 hover:border-blue-200 hover:shadow-2xl transition-all"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-blue-600 mb-1">{pack.credits} {t('pricing.credits')}</h3>
                <p className="text-sm text-gray-600 mb-4">{t('pricing.about')}{pack.images} {t('pricing.images')}</p>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-gray-900">${pack.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500">{t('pricing.creditsValid')}</p>
              </div>

              <div className="space-y-3 mb-6">
                {pack.discount !== "原价" && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-2 rounded-lg">
                    <span className="text-blue-600 font-semibold text-sm">{pack.discount}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => openPaymentModal(`credits-${pack.credits}`, 'payment', `${pack.credits} Credits`, pack.price, pack.credits)}
                disabled={loading === `credits-${pack.credits}`}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-lg font-semibold rounded-xl transition-all"
              >
                {loading === `credits-${pack.credits}` ? t('pricing.processing') : t('pricing.buyNow')}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        planName={selectedPlan?.name || ''}
        price={selectedPlan?.price || 0}
        credits={selectedPlan?.credits || 0}
        onConfirm={handleConfirmPayment}
        loading={loading !== null}
      />
    </div>
  )
}
