import { TiktokDL } from "@tobyg74/tiktok-api-dl"
import { NextRequest, NextResponse } from "next/server"

const isUrl = (url: string) => url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, "gi"))

export async function GET(
  req: NextRequest
) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url) return NextResponse
  .json({ status: false, message: 'missing params \'url\'' }, { status: 400 })

  if (!isUrl(url) || !url.includes("tiktok.com")) return NextResponse
  .json({ status: false, message: 'invalid url' }, { status: 400 })
  
  try {
    const result = await TiktokDL(url, { version: "v1"})
    return NextResponse.json(result, { status: 200})
  } catch {
    return NextResponse.json({ status: false, message: "internal server error"}, { status: 500})
  }
}