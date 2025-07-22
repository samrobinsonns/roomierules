import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-10">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-5xl md:text-6xl mb-2">🏠</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary-dark drop-shadow-sm mb-2">RoomieRules</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">Flatmate Agreement Generator</h2>
        <p className="text-base md:text-lg text-gray-600 max-w-xl mb-4">
          Create a custom, UK-focused flatmate agreement in minutes. Take the quiz, review your agreement, and export a professional PDF. No legal jargon, just clear house rules. Perfect for students, young professionals, and house shares!
        </p>
        <Link href="/register" className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-primary via-accent-blue to-accent-teal text-white font-bold text-lg shadow hover:scale-105 transition-transform">
          Get Started Free
        </Link>
      </div>
      <footer className="mt-16 text-sm text-center text-gray-400">&copy; {new Date().getFullYear()} RoomieRules. All rights reserved.</footer>
    </div>
  );
}
