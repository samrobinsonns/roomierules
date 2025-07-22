"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

export default function AppNav() {
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  const handleLogout = () => {
    logout();
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('userLogout'));
    window.location.href = '/';
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: "📊", roles: ["admin", "landlord", "tenant"] },
    { href: "/properties", label: "Properties", icon: "🏠", roles: ["admin", "landlord"] },
    { href: "/admin", label: "Admin Tools", icon: "⚙️", roles: ["admin"] },
    { href: "/landlord", label: "Landlord", icon: "👨‍💼", roles: ["landlord"] },
    { href: "/tenant", label: "Tenant", icon: "👤", roles: ["tenant"] },
  ];

  // Landing page - keep the original header
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
              {loading ? (
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

  // Show regular header for non-authenticated users
  if (!loading && !user) {
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

  // Show loading header while checking authentication
  if (loading) {
    return (
      <nav className="w-full bg-white dark:bg-black shadow flex items-center justify-between px-4 py-3 md:px-8 sticky top-0 z-20">
        <span className="text-2xl font-bold tracking-tight">RoomieRules</span>
        <span className="text-gray-500">Loading...</span>
      </nav>
    );
  }

  // Sidebar for authenticated users
  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 w-64 flex flex-col`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">RoomieRules</span>
          </div>
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links - Takes up remaining space */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navLinks.filter(l => l.roles.includes(user.role)).map(link => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}>
                    <span className="text-lg">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info and Logout - Fixed to bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{user.username}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            >
              <span className="text-lg">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </>
  );
} 