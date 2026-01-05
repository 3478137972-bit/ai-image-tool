import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    const uploadFormData = new FormData()
    uploadFormData.append("file", file)

    const uploadResponse = await fetch("https://api.kie.ai/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KIE_API_KEY}`,
      },
      body: uploadFormData,
    })

    const data = await uploadResponse.json()
    return NextResponse.json({ url: data.data?.url || data.url, success: true })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
