import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "School Management System",
  description: "A comprehensive school management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 👇 suppressHydrationWarning prevents console errors if extensions inject attributes */}
      <body suppressHydrationWarning className={inter.className}>
        {children}
      </body>
    </html>
  );
}
