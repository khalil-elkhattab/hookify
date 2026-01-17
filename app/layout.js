import "./globals.css";
import { ThemeProvider } from "../components/ui/provider";
import ConvexClientProvider from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";

// هذا السطر يمنع الخطأ في Vercel أثناء الـ Build
export const dynamic = "force-dynamic";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider 
      // تمرير المفتاح يدوياً هنا هو الحل النهائي لخطأ Missing publishableKey
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" className="dark" suppressHydrationWarning>
        <body suppressHydrationWarning>
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