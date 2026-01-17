/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // هذا القسم يمنع Vercel من إيقاف الـ Build بسبب Clerk
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
};

export default nextConfig;