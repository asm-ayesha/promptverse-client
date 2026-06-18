import { Providers } from "./providers";
import "./globals.css";

import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Providers>
          <Navbar></Navbar>
          {children}</Providers>
      </body>
    </html>
  );
}