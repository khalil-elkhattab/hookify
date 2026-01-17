import "./globals.css";
import { ThemeProvider } from "../components/ui/provider";
import ConvexClientProvider from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs"; // أضف هذا

export default function RootLayout({ children }) {
  return (
    <ClerkProvider> {/* اجعل Clerk هو الغطاء الخارجي */}
      <html lang="en" className="dark" suppressHydrationWarning>
        <body>
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