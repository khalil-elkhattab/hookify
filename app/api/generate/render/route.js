import { NextResponse } from 'next/server';

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    
    // استلام كل البيانات التي أرسلها المستخدم من AdPreview
    const { 
      aiScript, videoUrl, userLogo, selectedMusic,
      storeName, activeOffer, logoPos, namePos, offerPos,
      aiVoiceUrl 
    } = body;

    const SHOTSTACK_API_KEY = process.env.NEXT_PUBLIC_SHOTSTACK_API_KEY;

    // دالة لتحويل إحداثيات الشاشة (0-340) إلى إحداثيات Shotstack (-0.5 إلى 0.5)
    const mapPos = (pos) => {
      if (!pos) return { x: 0, y: 0 };
      return {
        x: parseFloat(((pos.x / 340) - 0.5).toFixed(2)),
        y: parseFloat((0.5 - (pos.y / 600)).toFixed(2))
      };
    };

    const lPos = mapPos(logoPos);
    const nPos = mapPos(namePos);
    const oPos = mapPos(offerPos);

    const tracks = [];

    // 1. تراك النصوص (AI Script) - يظهر في المنتصف
    tracks.push({
      clips: [{
        asset: { type: 'title', text: aiScript || "", style: 'subtitle' },
        start: 0, length: 15, position: 'center'
      }]
    });

    // 2. تراك الشعار (User Logo) - في المكان الذي سحبه المستخدم
    if (userLogo) {
      tracks.push({
        clips: [{
          asset: { type: 'image', src: userLogo },
          start: 0, length: 15, scale: 0.15, offset: { x: lPos.x, y: lPos.y }
        }]
      });
    }

    // 3. تراك اسم المتجر
    if (storeName) {
      tracks.push({
        clips: [{
          asset: { type: 'title', text: storeName, size: 'x-small' },
          start: 0, length: 15, offset: { x: nPos.x, y: nPos.y }
        }]
      });
    }

    // 4. الفيديو الأساسي (الذي جاء من السكرابر)
    tracks.push({
      clips: [{
        asset: { type: 'video', src: videoUrl, volume: 0 },
        start: 0, length: 15, fit: 'cover'
      }]
    });

    // 5. تراك الصوت (الموسيقى + تعليق AI)
    const audioClips = [];
    if (aiVoiceUrl) {
      audioClips.push({ asset: { type: 'audio', src: aiVoiceUrl, volume: 1.0 }, start: 0, length: 15 });
    }
    audioClips.push({ 
      asset: { type: 'audio', src: selectedMusic || 'https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/music/rockstar.mp3', volume: 0.2 }, 
      start: 0, length: 15 
    });
    tracks.push({ clips: audioClips });

    // إرسال الطلب لـ Shotstack
    const response = await fetch('https://api.shotstack.io/stage/render', {
      method: 'POST',
      headers: {
        'x-api-key': SHOTSTACK_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timeline: { tracks: tracks.reverse() }, // نعكس ليكون الفيديو في الخلف
        output: { format: 'mp4', resolution: 'hd', aspectRatio: '9:16' }
      })
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}