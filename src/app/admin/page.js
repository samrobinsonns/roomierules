"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      try {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          router.replace("/login");
          return;
        }

        const res = await fetch("/api/me", {
          headers: {
            'x-user-id': userId,
          },
        });
        
        if (!res.ok) {
          // Clear invalid authentication data
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          localStorage.removeItem('userRole');
          router.replace("/login");
          return;
        }
        
        const user = await res.json();
        if (user.role !== "admin") {
          router.replace("/dashboard");
        } else {
          setAuthChecked(true);
        }
      } catch {
        router.replace("/login");
      }
    }
    checkAdmin();
  }, [router]);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch("/api/admin/users", {
        headers: {
          'x-user-id': userId,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      setUsers(await res.json());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (authChecked) fetchUsers();
  }, [authChecked]);

  async function handleRoleChange(id, newRole) {
    setLoading(true);
    setError("");
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch("/api/admin/users/role", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'x-user-id': userId,
        },
        body: JSON.stringify({ userId: id, newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      await fetchUsers();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    setLoading(true);
    setError("");
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch("/api/admin/users/delete", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'x-user-id': userId,
        },
        body: JSON.stringify({ userId: id }),
      });
      if (!res.ok) throw new Error("Failed to delete user");
      await fetchUsers();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  if (!authChecked) {
    return (
      <Card className="max-w-2xl mx-auto w-full text-center">
        Checking admin access...
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🛠️</span>
        <h1 className="text-2xl font-bold text-primary-dark">Admin Tools – User Management</h1>
      </div>
      {loading && <div className="text-gray-500 mb-4">Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
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
            {users.map(user => (
              <tr key={user.id} className="bg-gray-100 dark:bg-gray-800 rounded">
                <td className="py-2 px-3 font-mono">{user.username}</td>
                <td className="py-2 px-3">{user.email}</td>
                <td className="py-2 px-3">
                  <select
                    className="rounded-xl border border-gray-300 bg-white px-2 py-1 text-sm"
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                    disabled={loading}
                  >
                    <option value="admin">Admin</option>
                    <option value="landlord">Landlord</option>
                    <option value="tenant">Tenant</option>
                  </select>
                </td>
                <td className="py-2 px-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
} 