import { clerkMiddleware } from "@clerk/nextjs/server";

// تصدير الوظيفة الافتراضية بشكل صريح
export default clerkMiddleware();

export const config = {
  matcher: [
    // تخطي ملفات Next.js الداخلية والملفات الثابتة
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // تشغيل الميدل وير دائماً لـ API routes
    '/(api|trpc)(.*)',
  ],
};