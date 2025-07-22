"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Button from "../components/ui/Button";

export default function AppNav() {
  const [user, setUser] = useState(null); // null = loading, false = not logged in, object = user
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  useEffect(() => {
    async function fetchUser() {
      try {
        // Check if user ID exists in localStorage
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          setUser(false);
          return;
        }

        const res = await fetch("/api/me", {
          headers: {
            'x-user-id': userId,
          },
        });
        
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Clear invalid authentication data
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          localStorage.removeItem('userRole');
          setUser(false);
        }
      } catch {
        // Clear invalid authentication data
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        setUser(false);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    setUser(false);
    window.location.href = '/';
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", roles: ["admin", "landlord", "tenant"] },
    { href: "/properties", label: "Properties", roles: ["admin", "landlord"] },
    { href: "/admin", label: "Admin Tools", roles: ["admin"] },
    { href: "/landlord", label: "Landlord", roles: ["landlord"] },
    { href: "/tenant", label: "Tenant", roles: ["tenant"] },
  ];

  // Landing page header - simple and clean
  if (isLandingPage) {
    return (
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏠</span>
              <span className="text-2xl font-bold text-gray-900">RoomieRules</span>
            </div>
            <div className="flex items-center gap-4">
              {user === null ? (
                <span className="text-gray-600">Loading...</span>
              ) : user ? (
                <Link href="/dashboard">
                  <Button variant="secondary" size="sm">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button variant="secondary" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Regular navbar for other pages
  if (user === null) {
    return (
      <nav className="w-full bg-white dark:bg-black shadow flex items-center justify-between px-4 py-3 md:px-8 sticky top-0 z-20">
        <span className="text-2xl font-bold tracking-tight">RoomieRules</span>
        <span className="text-gray-500">Loading...</span>
      </nav>
    );
  }

  if (!user) {
    // Not logged in
    return (
      <nav className="w-full bg-white dark:bg-black shadow flex items-center justify-between px-4 py-3 md:px-8 sticky top-0 z-20">
        <span className="text-2xl font-bold tracking-tight">RoomieRules</span>
        <div className="flex gap-4">
          <Link href="/login" className="font-medium hover:underline underline-offset-4 transition">Login</Link>
          <Link href="/register" className="font-medium hover:underline underline-offset-4 transition">Register</Link>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="w-full bg-white dark:bg-black shadow flex items-center justify-between px-4 py-3 md:px-8 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-tight">RoomieRules</span>
          <span className="hidden md:inline text-sm text-gray-500 ml-2">({user.role})</span>
        </div>
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className="sr-only">Toggle menu</span>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.filter(l => l.roles.includes(user.role)).map(link => (
            <Link key={link.href} href={link.href} className="font-medium hover:underline underline-offset-4 transition">
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="font-medium hover:underline underline-offset-4 transition text-red-600"
          >
            Logout
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-700 ml-2">
            {user.username[0]}
          </div>
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-black shadow px-4 py-2 flex flex-col gap-4">
          {navLinks.filter(l => l.roles.includes(user.role)).map(link => (
            <Link key={link.href} href={link.href} className="font-medium hover:underline underline-offset-4 transition" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="font-medium hover:underline underline-offset-4 transition text-red-600 text-left"
          >
            Logout
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-700">
            {user.username[0]}
          </div>
        </div>
      )}
    </>
  );
} 