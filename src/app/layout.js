// src/app/layout.js
import { Providers } from "./providers";
import { themeInitScript } from "./theme-script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthTokenSync from "@/components/AuthTokenSync";

export const metadata = {
  title: "PromptVerse - AI Prompt Marketplace",
  description:
    "Discover, share and sell high-quality AI prompts for ChatGPT, Midjourney, Claude and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-background text-foreground">
        <Providers>
          <AuthTokenSync />
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