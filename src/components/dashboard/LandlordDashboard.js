"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function LandlordDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [allTenants, setAllTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchProperties() {
    setLoading(true);
    setError("");
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch("/api/landlord/properties", {
        headers: {
          'x-user-id': userId
        }
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch properties");
      }
      
      const data = await res.json();
      setProperties(data);
      
      // Extract all tenants from all properties
      const tenants = [];
      data.forEach(property => {
        if (property.memberships) {
          property.memberships.forEach(membership => {
            if (membership.role === 'tenant') {
              tenants.push({
                ...membership.user,
                propertyName: property.name,
                propertyId: property.id
              });
            }
          });
        }
      });
      setAllTenants(tenants);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  const getPropertyTypeIcon = (type) => {
    const icons = {
      house: "🏠",
      flat: "🏢",
      studio: "🏠",
      shared: "🏘️",
      student: "🎓"
    };
    return icons[type] || "🏠";
  };

  const formatAddress = (property) => {
    const parts = [
      property.addressLine1,
      property.addressLine2,
      property.city,
      property.county,
      property.postcode
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="max-w-[98%] mx-auto w-full space-y-6">
      {/* Header */}
      <Card borderColor="accent-teal">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🏡</span>
          <h1 className="text-2xl font-bold text-accent-teal">Landlord Dashboard</h1>
        </div>
        {loading && <div className="text-gray-500 mb-4">Loading...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}
      </Card>

      {/* Properties Section */}
      <Card borderColor="accent-teal">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-accent-teal">Your Properties</h2>
          <Button onClick={() => router.push('/properties')}>
            Manage Properties
          </Button>
        </div>
        
        {properties.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">🏠</span>
            <p className="text-gray-600 mb-4">You don't have any properties yet.</p>
            <Button onClick={() => router.push('/properties')}>
              Add Your First Property
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Property</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Address</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Bedrooms</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tenants</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr 
                    key={property.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getPropertyTypeIcon(property.propertyType)}</span>
                        <div>
                          <div className="font-medium text-gray-900">{property.name}</div>
                          <div className="text-sm text-gray-500">ID: {property.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div>{property.addressLine1}</div>
                        {property.addressLine2 && <div className="text-gray-500">{property.addressLine2}</div>}
                        <div className="text-gray-500">{property.city}, {property.postcode}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {property.propertyType}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {property.bedrooms} bed, {property.bathrooms} bath
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{property.memberships?.filter(m => m.role === 'tenant').length || 0} assigned</div>
                        <div className="text-gray-500">{property.invitations?.filter(i => i.status === 'pending').length || 0} pending</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/properties/${property.id}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* All Tenants Section */}
      <Card borderColor="accent-teal">
        <h2 className="text-xl font-bold mb-4 text-accent-teal">All Your Tenants</h2>
        
        {allTenants.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">👥</span>
            <p className="text-gray-600 mb-4">No tenants assigned to your properties yet.</p>
            <p className="text-sm text-gray-500">Add properties and invite tenants to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tenant</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Property</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {allTenants.map((tenant, index) => (
                  <tr 
                    key={`${tenant.id}-${tenant.propertyId}`} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {tenant.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{tenant.username}</div>
                          <div className="text-sm text-gray-500">ID: {tenant.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">{tenant.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{tenant.propertyName}</div>
                        <div className="text-gray-500">Property ID: {tenant.propertyId}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active Tenant
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card borderColor="accent-teal">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-teal">{properties.length}</div>
            <div className="text-sm text-gray-600">Total Properties</div>
          </div>
        </Card>
        <Card borderColor="accent-teal">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-teal">{allTenants.length}</div>
            <div className="text-sm text-gray-600">Total Tenants</div>
          </div>
        </Card>
        <Card borderColor="accent-teal">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-teal">
              {properties.reduce((total, property) => 
                total + (property.invitations?.filter(i => i.status === 'pending').length || 0), 0
              )}
            </div>
            <div className="text-sm text-gray-600">Pending Invitations</div>
          </div>
        </Card>
      </div>
    </div>
  );
} 