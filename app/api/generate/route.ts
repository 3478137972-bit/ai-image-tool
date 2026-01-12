import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  console.log("========== 生图API被调用 ==========")
  try {
    const { prompt, imageUrls, aspectRatio, resolution, userId, model = "nano-banana-pro" } = await request.json()
    console.log("收到的参数:", { prompt, imageUrls, aspectRatio, resolution, userId, model })

    if (!userId) {
      console.log("错误: 未登录")
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    // 根据模型和分辨率计算积分消耗
    let creditCost = 3
    if (model === "nano-banana-pro") {
      creditCost = resolution === "4K" ? 12 : 6
    } else if (model === "nano-banana" || model === "nano-banana-edit") {
      creditCost = 1
    }

    const { data: userCredits } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", userId)
      .single()

    if (!userCredits || userCredits.credits < creditCost) {
      return NextResponse.json({ error: "积分不足" }, { status: 400 })
    }

    // 扣除积分
    await supabase
      .from("user_credits")
      .update({ credits: userCredits.credits - creditCost })
      .eq("user_id", userId)

    console.log("Generating with:", { prompt, imageUrls, aspectRatio, resolution, model })

    // 根据模型类型构建不同的请求体
    const isNanoBanana = model === "nano-banana" || model === "nano-banana-edit"
    const requestBody: any = {
      model: model,
      input: {
        prompt,
        output_format: "png",
      },
    }

    if (isNanoBanana) {
      // nano-banana 使用 image_size 而不是 aspect_ratio 和 resolution
      requestBody.input.image_size = aspectRatio
      if (imageUrls && imageUrls.length > 0) {
        requestBody.input.image_urls = imageUrls
      }
    } else {
      // nano-banana-pro 使用 aspect_ratio 和 resolution
      requestBody.input.image_input = imageUrls
      requestBody.input.aspect_ratio = aspectRatio
      requestBody.input.resolution = resolution
    }

    console.log("Request body:", JSON.stringify(requestBody, null, 2))

    const response = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KIE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()
    console.log("KIE AI response:", JSON.stringify(data, null, 2))

    if (!response.ok) {
      console.error("API error:", data)
      return NextResponse.json({ error: data.message || "API调用失败" }, { status: response.status })
    }

    // 检查 KIEAI 返回的数据格式
    if (data.code !== 200 || !data.data?.taskId) {
      console.error("KIEAI API 返回格式错误:", data)
      return NextResponse.json({
        error: `KIEAI API 错误: ${data.message || '未知错误'}`,
        code: data.code,
        apiResponse: JSON.stringify(data)
      }, { status: 500 })
    }

    console.log("成功获取 taskId:", data.data.taskId)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}
