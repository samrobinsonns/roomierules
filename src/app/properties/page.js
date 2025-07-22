"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PropertyForm from "../../components/property/PropertyForm";
import PropertyCard from "../../components/property/PropertyCard";
import TenantAssignmentModal from "../../components/property/TenantAssignmentModal";
import PageWrapper from "../../components/layout/PageWrapper";

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState(() => {
    // Get view mode from localStorage, default to 'cards'
    if (typeof window !== 'undefined') {
      return localStorage.getItem('propertiesViewMode') || 'cards';
    }
    return 'cards';
  }); // 'cards' or 'list'

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);
    setError("");
    try {
      const userId = localStorage.getItem('userId');
      console.log('Fetching properties with userId:', userId);
      
      const res = await fetch("/api/landlord/properties", {
        headers: {
          'x-user-id': userId
        }
      });
      
      console.log('Properties response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Properties fetch error:', errorText);
        throw new Error(`Failed to fetch properties: ${res.status} ${errorText}`);
      }
      
      const data = await res.json();
      console.log('Properties fetched successfully:', data);
      setProperties(data);
    } catch (e) {
      console.error('Properties fetch exception:', e);
      setError(e.message);
    }
    setLoading(false);
  }

  async function handlePropertySubmit(formData, propertyId = null) {
    try {
      const userId = localStorage.getItem('userId');
      console.log('Submitting property with userId:', userId);
      
      const url = propertyId 
        ? `/api/landlord/properties/${propertyId}`
        : "/api/landlord/properties";
      
      const method = propertyId ? "PUT" : "POST";
      
      console.log('Property submit URL:', url, 'Method:', method);
      
      const res = await fetch(url, {
        method,
        headers: {
          'x-user-id': userId
        },
        body: formData, // FormData for file uploads
      });
      
      console.log('Property submit response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Property submit error:', errorText);
        throw new Error(`Failed to save property: ${res.status} ${errorText}`);
      }
      
      console.log('Property saved successfully');
      await fetchProperties();
      setShowForm(false);
      setEditingProperty(null);
    } catch (err) {
      console.error('Property submit exception:', err);
      throw err;
    }
  }

  async function handleDeleteProperty(propertyId) {
    if (!confirm("Are you sure you want to delete this property?")) return;
    
    try {
      const userId = localStorage.getItem('userId');
      console.log('Deleting property with userId:', userId, 'propertyId:', propertyId);
      
      const res = await fetch(`/api/landlord/properties/${propertyId}`, {
        method: "DELETE",
        headers: {
          'x-user-id': userId
        }
      });
      
      console.log('Delete property response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Delete property error:', errorText);
        throw new Error(`Failed to delete property: ${res.status} ${errorText}`);
      }
      
      console.log('Property deleted successfully');
      await fetchProperties();
    } catch (err) {
      console.error('Delete property exception:', err);
      setError(err.message);
    }
  }

  async function handleAssignTenant(propertyId, userId) {
    try {
      const currentUserId = localStorage.getItem('userId');
      console.log('Assigning tenant with currentUserId:', currentUserId, 'propertyId:', propertyId, 'tenantUserId:', userId);
      
      const res = await fetch("/api/landlord/properties/assign-tenant", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'x-user-id': currentUserId
        },
        body: JSON.stringify({ propertyId, userId }),
      });
      
      console.log('Assign tenant response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Assign tenant error:', errorText);
        throw new Error(`Failed to assign tenant: ${res.status} ${errorText}`);
      }
      
      console.log('Tenant assigned successfully');
      await fetchProperties();
    } catch (err) {
      console.error('Assign tenant exception:', err);
      throw err;
    }
  }

  async function handleRemoveTenant(propertyId, userId) {
    try {
      const currentUserId = localStorage.getItem('userId');
      console.log('Removing tenant with currentUserId:', currentUserId, 'propertyId:', propertyId, 'tenantUserId:', userId);
      
      const res = await fetch("/api/landlord/properties/remove-tenant", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'x-user-id': currentUserId
        },
        body: JSON.stringify({ propertyId, userId }),
      });
      
      console.log('Remove tenant response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Remove tenant error:', errorText);
        throw new Error(`Failed to remove tenant: ${res.status} ${errorText}`);
      }
      
      console.log('Tenant removed successfully');
      await fetchProperties();
    } catch (err) {
      console.error('Remove tenant exception:', err);
      throw err;
    }
  }

  const openTenantModal = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setShowTenantModal(true);
  };

  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
    localStorage.setItem('propertiesViewMode', newViewMode);
  };

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const currentTenants = selectedProperty?.memberships?.filter(m => m.role === 'tenant') || [];

  if (showForm) {
    return (
      <PageWrapper>
        <PropertyForm
          property={editingProperty}
          onSubmit={handlePropertySubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProperty(null);
          }}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-[98%] mx-auto w-full space-y-6">
      {/* Header */}
      <Card borderColor="accent-teal">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏠</span>
            <h1 className="text-2xl font-bold text-accent-teal">Property Management</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange('cards')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-1">📋</span>
                Cards
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-1">📝</span>
                List
              </button>
            </div>
            <Button onClick={() => setShowForm(true)}>
              Add New Property
            </Button>
          </div>
        </div>
        {error && <div className="text-red-600 mt-4">{error}</div>}
      </Card>

      {/* Properties Display */}
      {loading ? (
        <Card className="text-center py-8">
          Loading properties...
        </Card>
      ) : properties.length === 0 ? (
        <Card borderColor="accent-teal" className="text-center py-12">
          <span className="text-4xl mb-4 block">🏠</span>
          <h2 className="text-xl font-bold mb-2 text-accent-teal">No Properties Yet</h2>
          <p className="text-gray-600 mb-6">Get started by adding your first property</p>
          <Button onClick={() => setShowForm(true)}>
            Add Your First Property
          </Button>
        </Card>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={(property) => {
                setEditingProperty(property);
                setShowForm(true);
              }}
              onDelete={handleDeleteProperty}
              onAssignTenant={openTenantModal}
            />
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Property</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Address</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Bedrooms</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tenants</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr 
                    key={property.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/properties/${property.id}`)}
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{property.name}</div>
                        <div className="text-sm text-gray-500">ID: {property.id}</div>
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tenant Assignment Modal */}
      {showTenantModal && (
        <TenantAssignmentModal
          propertyId={selectedPropertyId}
          currentTenants={currentTenants}
          onAssign={handleAssignTenant}
          onRemove={handleRemoveTenant}
          onClose={() => {
            setShowTenantModal(false);
            setSelectedPropertyId(null);
          }}
        />
      )}
      </div>
    </PageWrapper>
  );
} 