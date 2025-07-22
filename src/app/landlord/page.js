"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LandlordDashboard from "../../components/dashboard/LandlordDashboard";
import Card from "../../components/ui/Card";

export default function LandlordPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkLandlord() {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error();
        const user = await res.json();
        if (user.role !== "landlord" && user.role !== "admin") {
          router.replace("/dashboard");
        } else {
          setAuthChecked(true);
        }
      } catch {
        router.replace("/dashboard");
      }
    }
    checkLandlord();
  }, [router]);

  if (!authChecked) {
    return (
      <Card borderColor="accent-teal" className="max-w-2xl mx-auto w-full text-center">
        Checking landlord access...
      </Card>
    );
  }

  return <LandlordDashboard />;
} 