"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={inter.className}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}