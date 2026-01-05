import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { taskId } = await request.json()

    const response = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.KIE_API_KEY}`,
      },
    })

    const data = await response.json()
    console.log("Query response for taskId:", taskId, "data:", JSON.stringify(data, null, 2))
    return NextResponse.json(data)
  } catch (error) {
    console.error("Query error:", error)
    return NextResponse.json({ error: "Query failed" }, { status: 500 })
  }
}
