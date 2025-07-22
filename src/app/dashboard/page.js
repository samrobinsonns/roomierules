"use client";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-8">
      <div className="w-full max-w-2xl bg-white dark:bg-black rounded-lg shadow p-8 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>
        <p className="text-lg text-center">This is your RoomieRules dashboard. More features coming soon!</p>
      </div>
    </div>
  );
} 