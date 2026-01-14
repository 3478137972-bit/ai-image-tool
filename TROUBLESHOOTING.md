# 问题排查记录

## 2026-01-13: Creem 支付成功但积分未到账

### 问题描述
用户完成支付后，Creem 显示支付成功，但用户账户积分没有增加。

### 问题排查过程

1. **检查 Webhook 配置**
   - ✅ Creem 后台已配置 Webhook URL: `https://www.xuelelestext.site/api/payment/webhook`
   - ✅ Webhook 状态：Enabled（启用）
   - ✅ 监听事件：`checkout.completed`

2. **检查 Webhook 调用日志**
   - ✅ Creem 成功调用了 Webhook（时间：2026/1/13 23:23:06）
   - ✅ HTTP 状态码：200
   - ✅ 响应内容：`{"received":true}`

3. **分析 Webhook 请求数据**
   ```json
   {
     "eventType": "checkout.completed",
     "object": {
       "id": "ch_620Vavy2rx1JWKfYwBa5JA",
       "object": "checkout",
       "order": {
         "product": "prod_7aS4RjY0sOkat5mpF6MlE2",
         "amount": 100,
         "currency": "USD"
       },
       "customer": {
         "email": "user@example.com"
       }
     }
   }
   ```

### 根本原因

**Webhook 代码解析 Creem 数据结构错误**

原代码期望的数据结构：
```typescript
event.type === 'checkout.completed'
event.data.product_id
event.data.customer.email
```

实际 Creem 发送的数据结构：
```typescript
event.eventType === 'checkout.completed'
event.object.order.product
event.object.customer.email
```

因为字段路径不匹配，代码无法获取 Product ID 和用户邮箱，直接返回 `{"received":true}`，没有执行积分充值逻辑。

### 解决方案

修改 `app/api/payment/webhook/route.ts` 第 47-49 行：

```typescript
// 修改前
if (event.type === 'checkout.completed') {
  const productId = event.data.product_id
  const customerEmail = event.data.customer?.email

// 修改后
if (event.eventType === 'checkout.completed') {
  const productId = event.object?.order?.product
  const customerEmail = event.object?.customer?.email
```

### 验证方法

1. 部署修复后的代码到 Vercel
2. 在 Creem 后台 Webhooks 页面点击 **Resend（重新发送）** 测试
3. 或者进行一次新的支付测试
4. 检查用户积分是否正确增加

### 手动补充积分（临时方案）

如果用户已经支付但积分未到账，可以在 Supabase SQL Editor 手动补充：

```sql
-- 查看用户当前积分
SELECT
  u.email,
  uc.credits
FROM auth.users u
LEFT JOIN public.user_credits uc ON u.id = uc.user_id
WHERE u.email = '用户邮箱';

-- 手动增加积分
UPDATE public.user_credits
SET
  credits = credits + 100,  -- 根据购买的套餐调整数量
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = '用户邮箱'
);
```

### 预防措施

1. **添加详细日志**：在 Webhook 中记录完整的请求数据，方便排查
2. **测试环境验证**：使用 Creem 的 "Send test event" 功能测试 Webhook
3. **监控告警**：定期检查 Webhook 失败日志
4. **文档同步**：参考 Creem 官方 API 文档确保数据结构正确

### 相关文件
- `app/api/payment/webhook/route.ts` - Webhook 处理逻辑
- `CREEM_PAYMENT_CONFIG.md` - Creem 支付配置文档
- `SETUP_GUIDE.md` - 项目搭建指南

### 提交记录
- Commit: `7b98c62` - 修复 Creem Webhook 数据结构解析问题

---

## 2026-01-14: KIEAI API 模型名称不支持错误

### 问题描述
使用 nano-banana 模型生成图片时，KIEAI API 返回错误：
```
"code": 422
"msg": "The model name you specified is not supported. Please verify your input and use one of the supported models provided by KIE."
"data": null
```

### 问题排查过程

1. **检查 API 请求日志**
   - ✅ 请求成功发送到 KIEAI API
   - ❌ 返回 422 错误，提示模型名称不支持

2. **分析请求数据**
   ```json
   {
     "model": "nano-banana",
     "input": {
       "prompt": "...",
       "image_size": "1:1",
       "output_format": "png"
     }
   }
   ```

3. **对比 KIEAI 官方文档**
   - 官方文档要求的模型名称：`google/nano-banana`
   - 代码中使用的模型名称：`nano-banana`
   - ❌ 缺少 `google/` 前缀

### 根本原因

**模型名称缺少命名空间前缀**

KIEAI API 要求使用完整的模型名称，包含命名空间前缀：
- ❌ 错误：`nano-banana`
- ✅ 正确：`google/nano-banana`
- ❌ 错误：`nano-banana-edit`
- ✅ 正确：`google/nano-banana-edit`

### 解决方案

**1. 修改 UI 组件模型选择值**

`components/image-generator.tsx`:
```typescript
// 文生图模型选择
<SelectItem value="google/nano-banana">Nano Banana</SelectItem>

// 图生图模型选择
<SelectItem value="google/nano-banana-edit">Nano Banana Edit</SelectItem>
```

**2. 修改 API 路由模型判断逻辑**

`app/api/generate/route.ts`:
```typescript
// 积分计算
if (model === "google/nano-banana" || model === "google/nano-banana-edit") {
  creditCost = 1
}

// 请求体构建
const isNanoBanana = model === "google/nano-banana" || model === "google/nano-banana-edit"
```

**3. 修改 UI 条件判断**

```typescript
// 文生图
{t2iModel === "google/nano-banana" ? "Image Size" : t("gen.aspectRatio")}

// 图生图
{i2iModel === "google/nano-banana-edit" ? "Image Size" : t("gen.aspectRatio")}
```

### 验证方法

1. 部署修复后的代码
2. 选择 Nano Banana 模型进行文生图测试
3. 选择 Nano Banana Edit 模型进行图生图测试
4. 检查是否成功生成图片

### 预防措施

1. **参考官方文档**：集成第三方 API 时，严格按照官方文档的模型命名规范
2. **测试覆盖**：新增模型时，先在测试环境验证模型名称是否正确
3. **错误处理**：在前端显示更详细的 API 错误信息，方便快速定位问题

### 相关文件
- `components/image-generator.tsx` - UI 组件模型选择
- `app/api/generate/route.ts` - API 路由模型处理逻辑

### 提交记录
- Commit: `b740f8f` - 添加 nano-banana 和 nano-banana-edit 模型支持
- Commit: `9e69b03` - 修复 nano-banana 模型名称，添加 google/ 前缀

---

## 常见问题快速检查清单

### 支付后积分未到账

- [ ] 检查 Creem Webhook 是否配置并启用
- [ ] 查看 Creem Webhook 调用日志（Status 是否为 Success）
- [ ] 检查 Vercel 环境变量 `SUPABASE_SERVICE_ROLE_KEY` 是否配置
- [ ] 查看 Vercel Functions 日志是否有错误
- [ ] 确认 Product ID 映射是否正确
- [ ] 验证用户邮箱在 Supabase 中是否存在

### Webhook 返回 401 Unauthorized

- [ ] 检查 `CREEM_WEBHOOK_SECRET` 环境变量是否配置
- [ ] 确认 Webhook Secret 与 Creem 后台一致

### Webhook 返回 404 User not found

- [ ] 确认用户已在网站注册
- [ ] 检查支付时填写的邮箱与注册邮箱是否一致
- [ ] 验证 Supabase `auth.users` 表中是否有该用户

### Webhook 返回 400 Unknown product

- [ ] 检查 `PRODUCT_ID_MAP` 中是否包含该 Product ID
- [ ] 确认 Creem 后台 Product ID 与代码中的映射一致
