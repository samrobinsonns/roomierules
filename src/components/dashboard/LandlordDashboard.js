"use client";
import { useEffect, useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function LandlordDashboard() {
  const [households, setHouseholds] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchHouseholds() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/landlord/households");
      if (!res.ok) throw new Error("Failed to fetch households");
      const data = await res.json();
      setHouseholds(data);
      if (data.length > 0 && !selectedHousehold) {
        setSelectedHousehold(data[0]);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchHouseholds();
  }, []);

  async function createHousehold(name) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/landlord/households", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create household");
      await fetchHouseholds();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  async function removeTenant(userId) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/landlord/households/remove-tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, householdId: selectedHousehold.id }),
      });
      if (!res.ok) throw new Error("Failed to remove tenant");
      await fetchHouseholds();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <Card borderColor="accent-teal">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🏡</span>
          <h1 className="text-2xl font-bold text-accent-teal">Landlord Dashboard</h1>
        </div>
        {loading && <div className="text-gray-500 mb-4">Loading...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}
      </Card>

      {/* Households Section */}
      <Card borderColor="accent-teal">
        <h2 className="text-xl font-bold mb-4 text-accent-teal">Your Households</h2>
        {households.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You don't have any households yet.</p>
            <Button 
              onClick={() => createHousehold("My First Property")}
              disabled={loading}
            >
              Create Your First Household
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {households.map(household => (
              <div key={household.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{household.name}</h3>
                  <Button
                    variant={selectedHousehold?.id === household.id ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedHousehold(household)}
                  >
                    {selectedHousehold?.id === household.id ? "Selected" : "Select"}
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Invite Code: <code className="bg-gray-100 px-2 py-1 rounded">{household.inviteCode}</code>
                </p>
                <p className="text-sm text-gray-600">{household.memberships?.length || 0} members</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Tenants Section */}
      {selectedHousehold && (
        <Card borderColor="accent-teal">
          <h2 className="text-xl font-bold mb-4 text-accent-teal">Tenants in {selectedHousehold.name}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedHousehold.memberships?.map(membership => (
                  <tr key={membership.id} className="bg-gray-100 dark:bg-gray-800 rounded">
                    <td className="py-2 px-3 font-mono">{membership.user.username}</td>
                    <td className="py-2 px-3">{membership.user.email}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        membership.role === 'landlord' 
                          ? 'bg-accent-teal text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {membership.role}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      {membership.role === 'tenant' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeTenant(membership.user.id)}
                          disabled={loading}
                        >
                          Remove
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
} 