"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function PricingPage() {
  const membershipPlans = [
    {
      name: "一级会员",
      nameEn: "Basic",
      price: 29,
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
      price: 49,
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
      price: 79,
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
    { credits: 100, price: 11 },
    { credits: 300, price: 31 },
    { credits: 500, price: 50 },
    { credits: 1000, price: 95 },
    { credits: 3000, price: 240, popular: true },
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">定价方案</h1>
          <p className="text-lg text-muted-foreground">选择适合你的方案，开始创作</p>
        </div>

        {/* 会员方案 */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">会员订阅</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {membershipPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-8 relative ${plan.popular ? "border-2 border-primary shadow-lg" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    推荐
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.nameEn}</p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">¥{plan.price}</span>
                    <span className="text-muted-foreground">/月</span>
                  </div>
                  <div className="text-sm text-primary font-medium">{plan.discount} 优惠</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  立即订阅
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* 积分包 */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">积分包</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {creditPacks.map((pack) => (
              <Card
                key={pack.credits}
                className={`p-6 text-center ${pack.popular ? "border-2 border-primary" : ""}`}
              >
                {pack.popular && (
                  <div className="text-xs text-primary font-medium mb-2">最优惠</div>
                )}
                <div className="text-3xl font-bold mb-2">{pack.credits}</div>
                <div className="text-sm text-muted-foreground mb-4">积分</div>
                <div className="text-2xl font-bold mb-4">¥{pack.price}</div>
                <Button className="w-full" variant="outline" size="sm">
                  购买
                </Button>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            积分永久有效 · 可随时使用
          </p>
        </div>

        {/* 积分消耗说明 */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">积分消耗说明</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="font-bold mb-2">Nano Banana</div>
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <div className="text-sm text-muted-foreground">积分/张</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="font-bold mb-2">Nano Banana Pro</div>
              <div className="text-sm text-muted-foreground mb-2">1k / 2k</div>
              <div className="text-3xl font-bold text-primary mb-2">6</div>
              <div className="text-sm text-muted-foreground">积分/张</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="font-bold mb-2">Nano Banana Pro</div>
              <div className="text-sm text-muted-foreground mb-2">4k</div>
              <div className="text-3xl font-bold text-primary mb-2">12</div>
              <div className="text-sm text-muted-foreground">积分/张</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
