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
  title: "RoomieRules – Complete Tenancy Management",
  description: "Streamline your property management with our comprehensive platform for landlords and property developers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}> 
        <AppNav />
        {children}
      </body>
    </html>
  );
}
