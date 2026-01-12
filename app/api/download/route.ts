import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')

    if (!url) {
      return NextResponse.json({ error: '缺少 URL 参数' }, { status: 400 })
    }

    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json({ error: '下载失败' }, { status: response.status })
    }

    const blob = await response.blob()

    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
        'Content-Disposition': `attachment; filename="image-${Date.now()}.png"`,
      },
    })
  } catch (error) {
    console.error('下载错误:', error)
    return NextResponse.json({ error: '下载失败' }, { status: 500 })
  }
}
