import "./globals.css";
import { ThemeProvider } from "../components/ui/provider";
import ConvexClientProvider from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Hookify OS - AI Video Generator",
  description: "Create viral ads in seconds",
};

export default function RootLayout({ children }) {
  return (
    // 1. ClerkProvider هو الغلاف الخارجي لإدارة الهوية
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body>
          {/* 2. ConvexClientProvider يربط Clerk بقاعدة البيانات */}
          <ConvexClientProvider>
            {/* 3. ThemeProvider لإدارة شكل الموقع (Dark Mode) */}
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
            >
              {/* قمنا بحذف AuthProvider هنا لأنه كان تابعاً لـ Firebase */}
              {children}
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}