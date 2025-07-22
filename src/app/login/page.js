import { getProviders, signIn } from "next-auth/react";

export default async function LoginPage() {
  // For MVP, just show Google login
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-8">
      <div className="w-full max-w-md bg-white dark:bg-black rounded-lg shadow p-8 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold mb-2">Sign in to RoomieRules</h1>
        <button
          className="w-full py-3 px-6 rounded bg-foreground text-background font-semibold hover:bg-opacity-90 transition text-lg"
          onClick={() => signIn("google")}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
} 