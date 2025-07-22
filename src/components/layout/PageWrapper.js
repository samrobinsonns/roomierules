"use client";
import { useAuth } from "../../hooks/useAuth";

export default function PageWrapper({ children }) {
  const { user, loading } = useAuth();
  
  // If user is authenticated, apply sidebar layout
  if (user) {
    return (
      <div className="lg:pl-64 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-6 min-h-screen">
          {children}
        </div>
      </div>
    );
  }
  
  // If not authenticated or loading, use regular layout
  return (
    <div className="bg-gradient-to-br from-primary-light via-background to-accent-blue min-h-screen">
      <div className="max-w-[95%] mx-auto w-full px-2 sm:px-4 lg:px-6 py-8 min-h-[calc(100vh-64px)]">
        {children}
      </div>
    </div>
  );
} 