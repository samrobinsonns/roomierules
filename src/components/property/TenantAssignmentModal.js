"use client";
import { useState, useEffect } from "react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function TenantAssignmentModal({ 
  propertyId, 
  currentTenants = [], 
  onAssign, 
  onRemove, 
  onClose 
}) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableUsers = filteredUsers.filter(user => 
    !currentTenants.some(tenant => tenant.user.id === user.id)
  );

  const handleAssign = async (userId) => {
    try {
      await onAssign(propertyId, userId);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await onRemove(propertyId, userId);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card borderColor="accent-teal" className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-accent-teal">Manage Tenants</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>

        {error && (
          <div className="text-red-600 font-medium mb-4">{error}</div>
        )}

        {/* Current Tenants */}
        {currentTenants.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Current Tenants</h3>
            <div className="space-y-2">
              {currentTenants.map(tenant => (
                <div key={tenant.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium">{tenant.user.username}</p>
                    <p className="text-sm text-gray-600">{tenant.user.email}</p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemove(tenant.user.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assign New Tenants */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Assign New Tenant</h3>
          
          <Input
            placeholder="Search users by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : availableUsers.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Role: {user.role}</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAssign(user.id)}
                  >
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {searchTerm ? "No users found matching your search" : "No available users to assign"}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
} 