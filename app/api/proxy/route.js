export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) return new Response("No URL provided", { status: 400 });

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new Response(blob, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Access-Control-Allow-Origin": "*", // هذا السطر يسمح للمتصفح بقراءة الصورة داخل الفيديو
      },
    });
  } catch (error) {
    return new Response("Error fetching image", { status: 500 });
  }
}