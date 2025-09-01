import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext"; // Import your UserProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "School Management System",
  description: "A comprehensive school management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          {" "}
          {/* Wrap your app with UserProvider */}
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
