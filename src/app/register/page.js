"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-8">
      <div className="w-full max-w-md bg-white dark:bg-black rounded-lg shadow p-8 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold mb-2">Register for RoomieRules</h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent text-base"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent text-base"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent text-base"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full py-3 px-6 rounded bg-foreground text-background font-semibold hover:bg-opacity-90 transition text-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {error && <div className="text-red-600 font-medium">{error}</div>}
        <div className="text-sm mt-2">Already have an account? <Link href="/login" className="underline">Login</Link></div>
      </div>
    </div>
  );
} 