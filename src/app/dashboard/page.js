"use client";
import { useEffect, useState } from "react";
import LandlordDashboard from "../../components/dashboard/LandlordDashboard";
import TenantDashboard from "../../components/dashboard/TenantDashboard";
import Card from "../../components/ui/Card";
import PageWrapper from "../../components/layout/PageWrapper";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/me?memberships=1", {
          headers: {
            'x-user-id': userId,
          },
        });
        
        if (res.ok) {
          setUser(await res.json());
        } else {
          // Clear invalid authentication data
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          localStorage.removeItem('userRole');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <Card className="max-w-2xl mx-auto w-full text-center">
          Loading dashboard...
        </Card>
      </PageWrapper>
    );
  }
  
  if (!user) {
    return (
      <PageWrapper>
        <Card className="max-w-2xl mx-auto w-full text-center">
          Not logged in. <a href="/login" className="text-blue-600 underline">Login here</a>
        </Card>
      </PageWrapper>
    );
  }

  // If user is a landlord in any household, show landlord dashboard
  if (user.memberships?.some(m => m.role === 'landlord')) {
    return (
      <PageWrapper>
        <LandlordDashboard />
      </PageWrapper>
    );
  }
  
  // Otherwise, show tenant dashboard
  return (
    <PageWrapper>
      <TenantDashboard user={user} />
    </PageWrapper>
  );
} 