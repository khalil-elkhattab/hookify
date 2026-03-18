import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 1. استقبال البيانات من الـ Dashboard
    const { videoUrl, caption, platform, userEmail } = await req.json();

    // التحقق من وجود البيانات الأساسية
    if (!videoUrl || !caption) {
      return NextResponse.json(
        { error: "Video URL and Caption are required" },
        { status: 400 }
      );
    }

    // 2. رابط Pipedream الخاص بك
    const PIPEDREAM_ENDPOINT = "https://e93aa22d438c84b959d2999c970bc566.m.pipedream.net";

    // 3. إرسال البيانات إلى Pipedream
    const response = await fetch(PIPEDREAM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoUrl,
        caption,
        platform,
        userEmail,
        timestamp: new Date().toISOString(),
        projectName: "Hookify AI",
      }),
    });

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: "Data sent to Pipedream successfully!" 
      });
    } else {
      const errorData = await response.text();
      return NextResponse.json(
        { error: "Pipedream rejected the request", details: errorData },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Publish Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}