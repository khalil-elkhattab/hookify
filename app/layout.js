import "./globals.css";
import { ThemeProvider } from "../components/ui/provider";
import ConvexClientProvider from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Hookify OS - AI Video Generator",
  description: "Create viral ads in seconds",
};

export default function RootLayout({ children }) {
  // استخراج المفتاح من البيئة
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body suppressHydrationWarning>
          {/* 1. ربط Clerk بقاعدة بيانات Convex */}
          <ConvexClientProvider>
            {/* 2. إدارة الثيم (Dark Mode) */}
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
            >
              {/* محتوى التطبيق */}
              {children}
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}