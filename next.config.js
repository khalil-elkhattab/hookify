/** @type {import('next').NextConfig} */
const nextConfig = {
  // هذا سيسمح للمتصفح بتجاوز قيود COEP التي تظهر في سجل الخطأ عندك
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'unsafe-none' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
        ],
      },
    ];
  },
};
export default nextConfig;