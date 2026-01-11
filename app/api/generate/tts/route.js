import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text, language } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // تحديد كود اللغة (مثلاً ar-SA أو en-US)
    const langCode = language?.toLowerCase().includes("arabic") ? "ar" : "en";
    
    // استخدام رابط Google TTS المجاني لتحويل النص لصوت
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text
    )}&tl=${langCode}&client=tw-ob`;

    const response = await fetch(ttsUrl);
    
    if (!response.ok) throw new Error("Failed to fetch from Google TTS");

    const audioBuffer = await response.arrayBuffer();

    // إرجاع الملف كصوت حقيقي وليس JSON
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg", // يخبر المتصفح أن هذا ملف صوتي مدعوم
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error("TTS Route Error:", error);
    return NextResponse.json({ error: "TTS failed to generate audio" }, { status: 500 });
  }
}