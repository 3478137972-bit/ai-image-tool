"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "zh"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Header
    "nav.home": "Home",
    "nav.features": "Features",
    "nav.showcase": "Showcase",
    "nav.testimonials": "Testimonials",
    "nav.faq": "FAQ",
    "nav.pricing": "Pricing",

    // Hero
    "hero.badge": "AI Image Pro Now Available",
    "hero.title": "Revolutionary AI Image Generation & Editing",
    "hero.subtitle":
      "Transform your images with simple text commands. Experience state-of-the-art AI that's revolutionizing text-based image editing with unmatched quality.",
    "hero.cta": "Start Creating",
    "hero.feature1": "AI-Powered Editing",
    "hero.feature2": "Natural Language",
    "hero.feature3": "Professional Quality",

    // Generator
    "gen.imageToImage": "Image to Image",
    "gen.textToImage": "Text to Image",
    "gen.model": "Model",
    "gen.upload": "Click to upload or drag & drop",
    "gen.uploadHint": "PNG, JPG, JPEG, WEBP (8 remaining)",
    "gen.prompt": "Prompt",
    "gen.promptPlaceholder": "Describe your image edits...",
    "gen.resolution": "Resolution",
    "gen.aspectRatio": "Aspect Ratio",
    "gen.generate": "Generate",
    "gen.ready": "Ready to Create",
    "gen.readyHint": "Upload an image and describe your edits",

    // Features
    "features.title": "Application Scenarios",
    "features.subtitle":
      "Discover versatility - from style transformations to scene modifications, delivering professional-quality editing outcomes.",
    "features.badge": "AI Capabilities",
    "features.clothing.title": "Virtual Clothing Try-On",
    "features.clothing.desc": "Revolutionary virtual fitting technology with perfect fit and realistic draping.",
    "features.text.title": "Text Removal",
    "features.text.desc": "Remove unwanted text while maintaining perfect image quality.",
    "features.bg.title": "Background Change",
    "features.bg.desc": "Modify backgrounds with natural-looking results that blend seamlessly.",
    "features.restore.title": "Restore Image",
    "features.restore.desc": "Restore vintage photographs with AI-powered enhancement.",

    // Why section
    "why.title": "Why Choose Our AI?",
    "why.subtitle":
      "The breakthrough AI model revolutionizing how creators edit and generate images with unprecedented accuracy.",
    "why.perfect.title": "One-Shot Perfect Edits",
    "why.perfect.desc": "Get perfect results on your first try. Describe what you want in natural language.",
    "why.consistency.title": "Unmatched Character Consistency",
    "why.consistency.desc": "Maintain perfect character identity across multiple edits and scenes.",
    "why.natural.title": "Natural Language Understanding",
    "why.natural.desc": "Simply describe your edits in plain language. AI understands complex instructions.",
    "why.cta": "Start Creating Now",

    // Showcase
    "showcase.title": "Amazing Creations from Our Community",
    "showcase.subtitle": "Watch incredible creations from our global community using advanced AI technology.",

    // Testimonials
    "testimonials.title": "Trusted by Creators Worldwide",
    "testimonials.subtitle": "See how designers, photographers, and digital artists are transforming their workflows.",
    "testimonials.1.text":
      "One-shot editing is mind-blowing! I describe complex edits and get perfect results immediately. Our team's productivity increased by 300%!",
    "testimonials.1.name": "Emily Rodriguez",
    "testimonials.1.title": "Creative Director",
    "testimonials.2.text":
      "Character consistency is unmatched. I create entire visual stories with the same characters in different scenes perfectly.",
    "testimonials.2.name": "David Chen",
    "testimonials.2.title": "Professional Photographer",
    "testimonials.3.text":
      "It understands context like no other AI. Complex multi-step instructions execute flawlessly. This is the future of image editing!",
    "testimonials.3.name": "Dr. Sarah Thompson",
    "testimonials.3.title": "Digital Artist & Educator",

    // FAQ
    "faq.title": "Frequently Asked Questions",
    "faq.subtitle": "Find answers to common questions",
    "faq.q1": "What is this AI Image Tool?",
    "faq.a1":
      "A breakthrough AI model offering state-of-the-art text-to-image generation and text-based editing with multi-image fusion and character consistency.",
    "faq.q2": "What image formats are supported?",
    "faq.a2":
      "We support all major formats including PNG, JPEG, and WebP. The model maintains exceptional quality across all resolutions.",
    "faq.q3": "Why is this better than other AI models?",
    "faq.a3":
      "Unique features include multi-image fusion, natural language editing, perfect character consistency, and scene-aware transformations with perfect first-try results.",
    "faq.q4": "Can I edit faces and portraits?",
    "faq.a4":
      "Yes! Advanced facial editing and completion. Modify expressions, add features, fix imperfections using simple text descriptions.",
    "faq.q5": "Can I use images for commercial purposes?",
    "faq.a5":
      "Yes, all generated or edited images can be used commercially including marketing, advertising, and business applications.",
    "faq.q6": "How fast is image generation?",
    "faq.a6": "Generate and edit images in just 15-30 seconds with optimized architecture for rapid iteration.",

    // Footer CTA
    "cta.title": "Ready to Transform Your Images with AI?",
    "cta.subtitle": "Join thousands of creators using revolutionary AI technology.",
    "cta.button": "Start Creating Now",

    // Pricing
    "pricing.badge": "Limited Time Offer",
    "pricing.title": "Upgrade Your Plan",
    "pricing.subtitle": "Choose the plan that fits your needs and start creating",
    "pricing.credits": "Credits",
    "pricing.upgrade": "Upgrade",
    "pricing.processing": "Processing...",
    "pricing.buyNow": "Buy Now",
    "pricing.monthlyCredits": "Monthly Credits",
    "pricing.extraCredits": "Extra Credits",
    "pricing.perCredit": "/credit",
    "pricing.perMonth": "/month",
    "pricing.firstMonth": "First month promotional price, then",
    "pricing.mostValue": "Best Value",
    "pricing.recommended": "Recommended",
    "pricing.about": "About",
    "pricing.images": "images",
    "pricing.creditsValid": "*Credits valid long-term",
    "pricing.buyCredits": "Buy Credits",
    "pricing.buyCreditsSubtitle": "Choose a credit package and start creating",
    "pricing.basic": "BASIC",
    "pricing.basicSubtitle": "Perfect for exploring AI creation",
    "pricing.pro": "PRO",
    "pricing.proSubtitle": "For frequent creators and consistent output",
    "pricing.ultimate": "ULTIMATE",
    "pricing.ultimateSubtitle": "For large-scale stable production and delivery",
    "pricing.loginRequired": "Please login first",
    "pricing.paymentFailed": "Payment failed",
    "pricing.unknownError": "Unknown error",

    // Credit Balance
    "credit.balance": "Credits",

    // Payment Modal
    "payment.confirmTitle": "Confirm Payment",
    "payment.reviewDetails": "Review your purchase details",
    "payment.plan": "Plan",
    "payment.credits": "Credits",
    "payment.total": "Total",
    "payment.confirm": "Confirm Payment",
    "payment.cancel": "Cancel",
    "payment.processing": "Processing...",
  },
  zh: {
    // Header
    "nav.home": "首页",
    "nav.features": "功能",
    "nav.showcase": "案例展示",
    "nav.testimonials": "用户评价",
    "nav.faq": "常见问题",
    "nav.pricing": "定价",

    // Hero
    "hero.badge": "AI 图像专业版现已推出",
    "hero.title": "革命性的 AI 图像生成与编辑",
    "hero.subtitle": "通过简单的文字命令转换您的图像。体验革命性的文本图像编辑 AI，具有无与伦比的质量。",
    "hero.cta": "开始创作",
    "hero.feature1": "AI 驱动编辑",
    "hero.feature2": "自然语言",
    "hero.feature3": "专业品质",

    // Generator
    "gen.imageToImage": "图像转图像",
    "gen.textToImage": "文字转图像",
    "gen.model": "模型",
    "gen.upload": "点击上传或拖放文件",
    "gen.uploadHint": "PNG, JPG, JPEG, WEBP（剩余 8 张）",
    "gen.prompt": "提示词",
    "gen.promptPlaceholder": "描述您想要的图像编辑...",
    "gen.resolution": "分辨率",
    "gen.aspectRatio": "宽高比",
    "gen.generate": "生成",
    "gen.ready": "准备创作",
    "gen.readyHint": "上传图像并描述您的编辑",

    // Features
    "features.title": "应用场景",
    "features.subtitle": "探索多样性 - 从风格转换到场景修改，提供专业品质的编辑结果。",
    "features.badge": "AI 能力",
    "features.clothing.title": "虚拟服装试穿",
    "features.clothing.desc": "革命性的虚拟试衣技术，完美贴合和逼真的褶皱效果。",
    "features.text.title": "文字移除",
    "features.text.desc": "移除不需要的文字，同时保持完美的图像质量。",
    "features.bg.title": "背景更换",
    "features.bg.desc": "修改背景，呈现自然融合的效果。",
    "features.restore.title": "图像修复",
    "features.restore.desc": "使用 AI 增强技术修复老照片。",

    // Why section
    "why.title": "为什么选择我们的 AI？",
    "why.subtitle": "突破性的 AI 模型，以前所未有的准确性革新创作者编辑和生成图像的方式。",
    "why.perfect.title": "一次性完美编辑",
    "why.perfect.desc": "第一次尝试就能获得完美结果。用自然语言描述您想要的效果。",
    "why.consistency.title": "无与伦比的角色一致性",
    "why.consistency.desc": "在多次编辑和场景中保持完美的角色身份。",
    "why.natural.title": "自然语言理解",
    "why.natural.desc": "只需用简单的语言描述您的编辑。AI 理解复杂的指令。",
    "why.cta": "立即开始创作",

    // Showcase
    "showcase.title": "来自我们社区的精彩创作",
    "showcase.subtitle": "观看全球社区使用先进 AI 技术创作的精彩作品。",

    // Testimonials
    "testimonials.title": "受到全球创作者信赖",
    "testimonials.subtitle": "了解设计师、摄影师和数字艺术家如何改变他们的工作流程。",
    "testimonials.1.text":
      "一次性编辑功能令人惊叹！我描述复杂的编辑内容，立即就能得到完美的结果。我们团队的生产力提高了 300%！",
    "testimonials.1.name": "Emily Rodriguez",
    "testimonials.1.title": "创意总监",
    "testimonials.2.text": "角色一致性无与伦比。我可以在不同场景中创建完整的视觉故事，角色完美保持一致。",
    "testimonials.2.name": "David Chen",
    "testimonials.2.title": "专业摄影师",
    "testimonials.3.text": "它像其他 AI 一样理解上下文。复杂的多步骤指令完美执行。这就是图像编辑的未来！",
    "testimonials.3.name": "Dr. Sarah Thompson",
    "testimonials.3.title": "数字艺术家和教育工作者",

    // FAQ
    "faq.title": "常见问题",
    "faq.subtitle": "查找常见问题的答案",
    "faq.q1": "什么是 AI 图像工具？",
    "faq.a1": "突破性的 AI 模型，提供最先进的文本到图像生成和基于文本的编辑，具有多图像融合和角色一致性。",
    "faq.q2": "支持哪些图像格式？",
    "faq.a2": "我们支持所有主要格式，包括 PNG、JPEG 和 WebP。该模型在所有分辨率下都保持卓越的质量。",
    "faq.q3": "为什么这比其他 AI 模型更好？",
    "faq.a3": "独特功能包括多图像融合、自然语言编辑、完美的角色一致性和场景感知转换，首次尝试即可获得完美结果。",
    "faq.q4": "可以编辑面部和肖像吗？",
    "faq.a4": "可以！先进的面部编辑和完成功能。使用简单的文本描述修改表情、添加特征、修复瑕疵。",
    "faq.q5": "我可以将图像用于商业目的吗？",
    "faq.a5": "可以，所有生成或编辑的图像都可以用于商业用途，包括营销、广告和业务应用。",
    "faq.q6": "图像生成有多快？",
    "faq.a6": "仅需 15-30 秒即可生成和编辑图像，优化的架构支持快速迭代。",

    // Footer CTA
    "cta.title": "准备好用 AI 转换您的图像了吗？",
    "cta.subtitle": "加入数千名使用革命性 AI 技术的创作者。",
    "cta.button": "立即开始创作",

    // Pricing
    "pricing.badge": "限时优惠",
    "pricing.title": "升级您的套餐",
    "pricing.subtitle": "选择最适合您的方案，立即开始创作",
    "pricing.credits": "积分",
    "pricing.upgrade": "升级",
    "pricing.processing": "处理中...",
    "pricing.buyNow": "立即购买",
    "pricing.monthlyCredits": "每月积分",
    "pricing.extraCredits": "额外充值",
    "pricing.perCredit": "/积分",
    "pricing.perMonth": "/月",
    "pricing.firstMonth": "首月优惠价，次月起",
    "pricing.mostValue": "最多约",
    "pricing.recommended": "专业推荐",
    "pricing.about": "约",
    "pricing.images": "张图像",
    "pricing.creditsValid": "*积分长期有效",
    "pricing.buyCredits": "购买积分",
    "pricing.buyCreditsSubtitle": "选择积分套餐，立即开始创作",
    "pricing.basic": "基础版",
    "pricing.basicSubtitle": "适合初次探索 AI 创作",
    "pricing.pro": "标准版",
    "pricing.proSubtitle": "适合高频创作与持续产出",
    "pricing.ultimate": "专业版",
    "pricing.ultimateSubtitle": "适合大批量稳定产出与交付",
    "pricing.loginRequired": "请先登录",
    "pricing.paymentFailed": "支付失败",
    "pricing.unknownError": "未知错误",

    // Credit Balance
    "credit.balance": "积分",

    // Payment Modal
    "payment.confirmTitle": "确认支付",
    "payment.reviewDetails": "查看您的购买详情",
    "payment.plan": "套餐",
    "payment.credits": "积分",
    "payment.total": "总计",
    "payment.confirm": "确认支付",
    "payment.cancel": "取消",
    "payment.processing": "处理中...",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
