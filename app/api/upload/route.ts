import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    const uploadFormData = new FormData()
    uploadFormData.append("file", file)
    uploadFormData.append("uploadPath", "images/user-uploads")

    const uploadResponse = await fetch("https://kieai.redpandaai.co/api/file-stream-upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KIE_API_KEY}`,
      },
      body: uploadFormData,
    })

    if (!uploadResponse.ok) {
      const text = await uploadResponse.text()
      console.error("Upload API error:", { status: uploadResponse.status, body: text })
      return NextResponse.json({
        error: `上传失败 (${uploadResponse.status})`,
        details: text.substring(0, 200)
      }, { status: uploadResponse.status })
    }

    const data = await uploadResponse.json()
    console.log("KIE AI upload response:", data)

    const url = data.data?.downloadUrl || data.data?.url || data.url
    console.log("Extracted URL:", url)

    return NextResponse.json({ url, success: true })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
