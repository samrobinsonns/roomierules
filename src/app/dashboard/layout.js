"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  // Placeholder for user info; in a real app, fetch from session
  const [user] = useState({ username: "User" });

  function handleLogout() {
    // TODO: Clear session/cookie in a real app
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      <header className="w-full flex items-center justify-between px-8 py-4 bg-white dark:bg-black shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-700">
            {user.username[0]}
          </div>
          <span className="font-semibold">{user.username}</span>
        </div>
        <button
          className="px-4 py-2 rounded bg-foreground text-background font-semibold hover:bg-opacity-80 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
} 