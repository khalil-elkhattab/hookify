import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import fs from 'fs'; // للتعامل مع ملف الفيديو الناتج

export async function POST(request) {
  try {
    // 1. استلام بيانات الفيديو (العنوان والوصف ومسار الملف الناتج من الـ AI)
    const { title, description, videoPath } = await request.json();

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/api/auth/google/callback'
    );

    // نضع المفاتيح التي حصلنا عليها
    oauth2Client.setCredentials({
      access_token: 'YA29.A0AUMWG...', // ضع التوكن الطويل هنا
      refresh_token: '1//03FOQ...',    // ضع الريفرش توكن هنا
    });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // 2. البدء بعملية الرفع الفعلية ليوتيوب
    const res = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: title || "AI Generated Video by Hookify",
          description: description || "Created automatically using AI.",
          tags: ['AI', 'Automation', 'YouTube Bot'],
          categoryId: '22',
        },
        status: {
          privacyStatus: 'unlisted', // نرفعه غير مدرج في البداية للتجربة
        },
      },
      media: {
        body: fs.createReadStream(videoPath), // هنا نمرر الفيديو الذي صنعه الذكاء الاصطناعي
      },
    });

    return NextResponse.json({ 
      success: true, 
      videoId: res.data.id,
      link: `https://www.youtube.com/watch?v=${res.data.id}` 
    });

  } catch (error) {
    console.error("YouTube Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}