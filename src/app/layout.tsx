import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Clinical Trials Matcher",
  description: "AI-powered clinical trials matching using patient-doctor conversation transcripts",
};

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
        <div className="flex flex-col h-screen overflow-x-hidden overflow-y-hidden">
          <div className="flex-1 bg-gradient-to-b from-[var(--color-background)] to-[var(--color-primary)]/40 overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
