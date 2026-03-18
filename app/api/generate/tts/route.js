import { ElevenLabsClient } from "elevenlabs";
import { NextResponse } from "next/server";

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY, 
});

export async function POST(req) {
  try {
    const { text } = await req.json();

    const audioStream = await client.textToSpeech.convert(
      "pNInz6obpgDQGcFmaJgB", // صوت Adam
      {
        text: text,
        model_id: "eleven_multilingual_v2",
        output_format: "mp3_44100_128",
      }
    );

    // تحويل الـ Stream إلى Buffer
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    return new Response(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });

  } catch (error) {
    console.error("ElevenLabs API Error:", error);
    return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}