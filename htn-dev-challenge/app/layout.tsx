import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hack the North Events",
  description: "Browse and explore Hack the North events",
};

/**
 * Root layout — wraps the entire app with:
 * - AuthProvider for login state
 * - Navbar for navigation
 * - Responsive container
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
