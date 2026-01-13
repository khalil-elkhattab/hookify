import "./globals.css";
import { ThemeProvider } from "../components/ui/provider";
import ConvexClientProvider from "./ConvexClientProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <ConvexClientProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}