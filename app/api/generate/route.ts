import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageUrls, aspectRatio, resolution } = await request.json()

    console.log("Generating with:", { prompt, imageUrls, aspectRatio, resolution })

    const response = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KIE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nano-banana-pro",
        input: {
          prompt,
          image_input: imageUrls,
          aspect_ratio: aspectRatio,
          resolution: resolution,
          output_format: "png",
        },
      }),
    })

    const data = await response.json()
    console.log("KIE AI response:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}
