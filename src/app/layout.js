// src/app/layout.js
import { Providers } from "./providers";
import { themeInitScript } from "./theme-script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-background text-foreground">
        <Providers>
          <Navbar></Navbar>
          <main className="min-h-screen">
            {children}
          </main>
          <Footer></Footer>
        </Providers>
      </body>
    </html>
  );
}