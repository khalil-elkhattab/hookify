/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  // تم حذف قسم eslint لأنه غير مدعوم في النسخة 16 ويسبب فشل الرفع
  typescript: { 
    ignoreBuildErrors: true 
  },
  output: 'standalone',
};

export default nextConfig;