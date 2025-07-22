import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppNav from "./AppNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RoomieRules – Flatmate Agreement Generator",
  description: "Create a custom, UK-focused flatmate agreement in minutes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-primary-light via-background to-accent-blue min-h-screen`}> 
        <AppNav />
        <div className="max-w-[95%] mx-auto w-full px-2 sm:px-4 lg:px-6 py-8 min-h-[calc(100vh-64px)]">
          {children}
        </div>
      </body>
    </html>
  );
}
