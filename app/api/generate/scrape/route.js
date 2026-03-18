import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { productUrl } = await req.json(); 
    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST;

    console.log(`🚀 [Scraper] Viral Hunt Started for: ${productUrl}`);

    const apiUrl = `https://${apiHost}/feed/search?keywords=${encodeURIComponent(productUrl)}&count=10&cursor=0&region=US`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost
      }
    });

    const result = await response.json();
    const videos = result.data?.videos || result.aweme_list || [];

    if (videos.length === 0) {
      return NextResponse.json({ success: false, error: "لم يتم العثور على فيديوهات." });
    }

    // تحديد عدد الفيديوهات المطلوب جلبها (مثلاً 3)
    const numberOfVideos = 3;
    
    // استخراج بيانات أول 3 فيديوهات صالحة
    const topVideos = videos.slice(0, numberOfVideos).map(videoData => ({
      videoUrl: videoData.hdplay || videoData.play || videoData.video_url,
      title: videoData.title || videoData.desc || productUrl,
      stats: {
        views: videoData.play_count || videoData.statistics?.play_count || 0,
        likes: videoData.digg_count || videoData.statistics?.digg_count || 0
      }
    })).filter(v => v.videoUrl); // التأكد من وجود رابط للفيديو

    console.log(`✅ Found ${topVideos.length} viral videos`);

    return NextResponse.json({
      success: true,
      videos: topVideos, // نرسل مصفوفة كاملة هنا
      title: topVideos[0]?.title || productUrl // العنوان الافتراضي من أول فيديو
    });

  } catch (error) {
    console.error("❌ Scraper Critical Error:", error);
    return NextResponse.json({ success: false, error: "فشل الاتصال بالـ API" });
  }
}