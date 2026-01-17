import "./globals.css";
import { ThemeProvider } from "../components/ui/provider";
import ConvexClientProvider from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";

// إجبار Next.js على التعامل مع الصفحة كصفحة ديناميكية لتجنب أخطاء الـ Build مع Clerk
export const dynamic = "force-dynamic";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" className="dark" suppressHydrationWarning>
        <body suppressHydrationWarning className="antialiased">
          {/* تحميل مكتبة Paddle.js - يتم التحميل بعد أن تصبح الصفحة تفاعلية */}
          <Script
            src="https://cdn.paddle.com/paddle/v2/paddle.js"
            strategy="afterInteractive"
            onLoad={() => {
              console.log("✅ Paddle library loaded successfully");
            }}
          />

          <ConvexClientProvider>
            <ThemeProvider attribute="class" defaultTheme="dark">
              {children}
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}