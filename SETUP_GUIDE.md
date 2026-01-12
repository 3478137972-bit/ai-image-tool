# AI 生图工具站 - 完整搭建指南

这是一份小白也能看懂的完整教程，跟着步骤一步步做就能成功！

## 📋 目录
1. [项目介绍](#项目介绍)
2. [准备工作](#准备工作)
3. [数据库设置](#数据库设置)
4. [支付系统设置](#支付系统设置)
5. [部署上线](#部署上线)
6. [常见问题](#常见问题)

---

## 项目介绍

这是一个 AI 图像生成工具网站，主要功能包括：
- ✅ 用户注册登录（使用 Supabase）
- ✅ 积分系统（新用户自动获得 20 积分）
- ✅ 会员订阅和积分购买
- ✅ 支付功能（使用 Creem）
- ✅ 中英文双语支持
- ✅ 每日签到送积分

---

## 准备工作

### 需要注册的账号

1. **Supabase 账号**（免费）
   - 网址：https://supabase.com
   - 用途：数据库 + 用户登录系统

2. **Creem 账号**（支付平台）
   - 网址：https://creem.io
   - 用途：处理支付

3. **Vercel 账号**（免费）
   - 网址：https://vercel.com
   - 用途：部署网站

### 本地环境要求

- Node.js 18+
- Git
- 代码编辑器（推荐 VS Code）

---

## 数据库设置

### 第一步：创建 Supabase 项目

1. 登录 Supabase
2. 点击 "New Project"
3. 填写项目信息：
   - Name: `ai-image-tool`（随便起名）
   - Database Password: 设置一个强密码（记住它！）
   - Region: 选择 `Northeast Asia (Tokyo)` 或离你最近的
4. 点击 "Create new project"，等待 2-3 分钟

### 第二步：创建积分表

1. 在 Supabase 左侧菜单找到 **SQL Editor**
2. 点击 "New query"
3. 复制粘贴以下代码，点击 **Run**：

```sql
-- 创建用户积分表
CREATE TABLE IF NOT EXISTS public.user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON public.user_credits(user_id);

-- 启用行级安全
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的积分
CREATE POLICY "Users can view own credits" ON public.user_credits
  FOR SELECT USING (auth.uid() = user_id);

-- 用户可以更新自己的积分
CREATE POLICY "Users can update own credits" ON public.user_credits
  FOR UPDATE USING (auth.uid() = user_id);
```

✅ 看到 "Success" 就说明成功了！

### 第三步：设置自动触发器（新用户自动获得 20 积分）

1. 在 SQL Editor 新建一个查询
2. 复制粘贴以下代码，点击 **Run**：

```sql
-- 创建触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (NEW.id, 20);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

✅ 看到 "Success" 就说明成功了！

### 第四步：给现有用户添加积分（如果有的话）

如果你已经有测试用户，运行这个：

```sql
-- 给所有没有积分记录的用户添加 20 积分
INSERT INTO public.user_credits (user_id, credits)
SELECT id, 20 FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_credits);
```

### 第五步：获取 Supabase 密钥

1. 在 Supabase 左侧菜单找到 **Project Settings** (齿轮图标)
2. 点击 **API**
3. 复制以下两个值（保存到记事本）：
   - `Project URL`
   - `anon public` key

---

## 支付系统设置

### 第一步：创建 Creem 账号并获取密钥

1. 登录 Creem
2. 进入 **Settings** → **API Keys**
3. 复制 `Secret Key`（保存到记事本）

### 第二步：在 Creem 创建收款项目

#### 会员订阅（3个套餐）

1. 在 Creem 点击 **Products** → **New Product**
2. 创建以下 3 个订阅产品：

**基础版 (Basic)**
- Product Name: `Basic Plan`
- Product ID: `Basic`
- Type: `Subscription`
- Price: `¥29/month`
- First month: `¥29`
- Renewal: `¥39/month`

**标准版 (Standard)**
- Product Name: `Standard Plan`
- Product ID: `Standard`
- Type: `Subscription`
- Price: `¥49/month`
- First month: `¥49`
- Renewal: `¥69/month`

**专业版 (Pro)**
- Product Name: `Pro Plan`
- Product ID: `Pro`
- Type: `Subscription`
- Price: `¥79/month`
- First month: `¥79`
- Renewal: `¥119/month`

#### 积分包（5个套餐）

创建以下 5 个一次性支付产品：

1. `100 Credits` - Product ID: `credits-100` - Price: `¥11`
2. `300 Credits` - Product ID: `credits-300` - Price: `¥31`
3. `500 Credits` - Product ID: `credits-500` - Price: `¥50`
4. `1000 Credits` - Product ID: `credits-1000` - Price: `¥95`
5. `3000 Credits` - Product ID: `credits-3000` - Price: `¥240`

---

## 本地开发设置

### 第一步：配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=你的_Supabase_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_Supabase_anon_key

# Creem
CREEM_SECRET_KEY=你的_Creem_Secret_Key
NEXT_PUBLIC_CREEM_PUBLISHABLE_KEY=你的_Creem_Publishable_Key
```

### 第二步：安装依赖并运行

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev
```

打开浏览器访问 `http://localhost:3000`

---

## 部署上线

### 使用 Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 登录 Vercel
3. 点击 "New Project"
4. 选择你的 GitHub 仓库
5. 添加环境变量（和 `.env.local` 一样的内容）
6. 点击 "Deploy"

✅ 等待 2-3 分钟，你的网站就上线了！

---

## 管理功能

### 如何手动给用户发送积分

1. 打开 Supabase SQL Editor
2. 运行以下命令：

```sql
-- 通过邮箱给用户增加 100 积分
UPDATE public.user_credits
SET credits = credits + 100
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);
```

### 如何修改新用户初始积分

修改触发器中的数字（当前是 20）：

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (NEW.id, 50);  -- 改成你想要的数字
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 常见问题

### Q1: 用户登录后看不到积分？

**解决方法：**
1. 检查 `user_credits` 表是否创建成功
2. 运行第四步的 SQL 给现有用户添加积分
3. 刷新页面

### Q2: 支付后积分没有增加？

**检查清单：**
- [ ] Creem Webhook 是否配置正确
- [ ] Product ID 是否和代码中一致
- [ ] 查看 Vercel 日志是否有错误

### Q3: 如何查看所有用户的积分？

在 Supabase SQL Editor 运行：

```sql
SELECT
  u.email,
  uc.credits,
  uc.created_at
FROM auth.users u
LEFT JOIN public.user_credits uc ON u.id = uc.user_id
ORDER BY uc.credits DESC;
```

### Q4: 如何修改定价？

修改文件 `app/pricing/page.tsx` 中的 `membershipPlans` 和 `creditPacks` 数组。

---

## 项目结构说明

```
├── app/
│   ├── pricing/          # 定价页面
│   └── api/
│       ├── payment/      # 支付 API
│       └── checkin/      # 签到 API
├── components/
│   ├── PaymentModal.tsx  # 支付确认弹窗
│   ├── CreditBalance.tsx # 积分显示组件
│   └── language-provider.tsx  # 多语言支持
├── lib/
│   └── supabase.ts       # Supabase 配置
└── .env.local            # 环境变量（不要提交到 Git）
```

---

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **支付**: Creem
- **部署**: Vercel

---

## 需要帮助？

如果遇到问题：
1. 检查浏览器控制台是否有错误
2. 查看 Vercel 部署日志
3. 检查 Supabase 日志
4. 确认所有环境变量都配置正确

---

**祝你搭建成功！🎉**
