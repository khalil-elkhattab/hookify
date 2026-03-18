/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // في الإصدار 16، نستخدم هذا السطر لمنع تجميع مكتبات السيرفر في المتصفح
  serverExternalPackages: [
    "remotion",
    "@remotion/renderer",
    "@remotion/bundler",
    "@remotion/cli",
    "esbuild"
  ],

  typescript: {
    ignoreBuildErrors: true,
  },

  // هذا السطر يحل مشكلة تعارض Turbopack مع بعض المكتبات القديمة
  turbopack: {
    resolveAlias: {
      // إعدادات إضافية إذا لزم الأمر
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
    ],
  },

  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
};

export default nextConfig;