"use client";
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null); // null = loading, false = not logged in, object = user
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      // Check if user ID exists in localStorage
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setUser(false);
        setLoading(false);
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
    setLoading(false);
  };

  const login = (userData) => {
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('userRole', userData.role);
    // Convert the login data to match the API response structure
    setUser({
      id: userData.userId,
      username: userData.username,
      role: userData.role
    });
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    setUser(false);
  };

  useEffect(() => {
    fetchUser();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'userId') {
        if (e.newValue) {
          // User logged in, fetch user data
          fetchUser();
        } else {
          // User logged out
          setUser(false);
          setLoading(false);
        }
      }
    };

    // Listen for custom login/logout events
    const handleLogin = (e) => {
      // Convert the login event data to match the API response structure
      setUser({
        id: e.detail.id,
        username: e.detail.username,
        role: e.detail.role
      });
      setLoading(false);
    };

    const handleLogout = () => {
      setUser(false);
      setLoading(false);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleLogin);
    window.addEventListener('userLogout', handleLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleLogin);
      window.removeEventListener('userLogout', handleLogout);
    };
  }, []);

  return { user, loading, login, logout, refetch: fetchUser };
} 