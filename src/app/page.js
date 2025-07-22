import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-8">
      <header className="w-full max-w-2xl flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight">RoomieRules</h1>
        <Link href="/login" className="px-4 py-2 rounded bg-foreground text-background font-semibold hover:bg-opacity-80 transition">Login</Link>
      </header>
      <main className="flex flex-col items-center gap-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-4">Flatmate Agreement Generator</h2>
        <p className="text-lg text-center max-w-xl mb-6">
          Create a custom, UK-focused flatmate agreement in minutes. Take the quiz, review your agreement, and export a professional PDF. No legal jargon, just clear house rules.
        </p>
        <Link href="/quiz" className="px-8 py-3 rounded bg-foreground text-background font-bold text-lg shadow hover:bg-opacity-90 transition">Get Started</Link>
      </main>
      <footer className="mt-16 text-sm text-center text-gray-500">&copy; {new Date().getFullYear()} RoomieRules. All rights reserved.</footer>
    </div>
  );
}
