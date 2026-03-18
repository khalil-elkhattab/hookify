import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, request) => {
  // 1. اكتشاف البيانات الجغرافية من الطلب (Request)
  // ملاحظة: geo تتوفر بشكل كامل عند الرفع على Vercel
  const country = request.geo?.country || "US";
  const city = request.geo?.city || "Unknown";
  const region = request.geo?.region || "Unknown";
  
  // 2. اكتشاف لغة المتصفح
  const languages = request.headers.get("accept-language") || "en";
  const primaryLanguage = languages.split(",")[0];

  // 3. الحصول على الاستجابة (Response)
  const response = NextResponse.next();

  // 4. تخزين البيانات في Cookies لكي نتمكن من الوصول إليها في الـ Client والـ Server
  // نضعها في Cookies لأنها أسرع وسيلة لنقل البيانات الثقافية بين الطبقات
  response.cookies.set("x-user-country", country, { path: "/" });
  response.cookies.set("x-user-language", primaryLanguage, { path: "/" });
  response.cookies.set("x-user-city", city, { path: "/" });

  return response;
});

export const config = {
  matcher: [
    // هذا السطر يخبر Next.js بتجاهل الملفات الثابتة وتشغيل الميدل وير على كل شيء آخر
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};