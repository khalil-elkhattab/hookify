import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { post, platform, mediaUrls } = await req.json();

    // نتحقق من وجود المفتاح
    if (!process.env.AYRSHARE_API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const response = await fetch("https://api.ayrshare.com/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AYRSHARE_API_KEY}`,
      },
      body: JSON.stringify({
        post: post, // النص (Caption)
        platforms: [platform.toLowerCase()], // المنصة (facebook, tiktok, instagram, youtube)
        mediaUrls: mediaUrls, // مصفوفة روابط الفيديو أو الصور
      }),
    });

    const data = await response.json();

    if (data.status === "error") {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}