/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 1. تعريف متغيرات البيئة
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },

  // 2. تجاهل أخطاء TypeScript (ضروري لأننا حولنا الكود لـ JS)
  typescript: {
    ignoreBuildErrors: true,
  },

  // 3. الحل لـ Next.js 16: تجاهل الـ Linting يتم عبر ملف منفصل أو إعدادات مختلفة
  // قمنا بإزالة مفتاح eslint لأنه لم يعد مدعوماً هنا في النسخ الحديثة
  
  output: 'standalone', 
};

export default nextConfig;