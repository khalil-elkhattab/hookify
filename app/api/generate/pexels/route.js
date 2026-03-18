export async function GET(req) {
  // الحصول على كلمة البحث من الرابط (مثلاً: query=unboxing)
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "lifestyle product phone";

  try {
    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${query}&per_page=15&orientation=portrait`,
      {
        headers: {
          // هذا السطر يقرأ المفتاح من ملف .env.local الذي أنشأناه
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );

    const data = await response.json();

    if (!data.videos || data.videos.length === 0) {
      return new Response(JSON.stringify({ error: "No videos found" }), { status: 404 });
    }

    // اختيار فيديو عشوائي من النتائج ليعطي تنوعاً للعميل في كل مرة
    const randomIndex = Math.floor(Math.random() * data.videos.length);
    const video = data.videos[randomIndex];

    // نختار جودة متوسطة (SD أو HD) لتكون عملية الدمج سريعة في FFmpeg
    const videoFile = video.video_files.find(f => f.width >= 720) || video.video_files[0];

    return new Response(JSON.stringify({ 
      videoUrl: videoFile.link,
      id: video.id 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Pexels API Error" }), { status: 500 });
  }
}