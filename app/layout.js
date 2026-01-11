import "./globals.css";
import { ThemeProvider } from "../components/ui/provider";
import { AuthProvider } from "./_context/authContext";
import ConvexClientProvider from "./ConvexClientProvider"; // استيراد الملف الجديد

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <ConvexClientProvider> {/* أضف هذا هنا */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </ConvexClientProvider> {/* وأغلقه هنا */}
      </body>
    </html>
  );
}
