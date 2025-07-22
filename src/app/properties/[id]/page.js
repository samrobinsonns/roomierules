"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  async function fetchProperty() {
    setLoading(true);
    setError("");
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/login');
        return;
      }

      const res = await fetch(`/api/landlord/properties/${params.id}`, {
        headers: {
          'x-user-id': userId,
        },
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          setError("Property not found");
        } else {
          setError("Failed to fetch property");
        }
        return;
      }
      
      const data = await res.json();
      setProperty(data);
    } catch (err) {
      setError("Failed to fetch property");
    }
    setLoading(false);
  }

  async function handleInviteTenant(e) {
    e.preventDefault();
    setInviteLoading(true);
    setError("");
    
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch("/api/landlord/properties/invite-tenant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-user-id': userId,
        },
        body: JSON.stringify({
          propertyId: parseInt(params.id),
          email: inviteEmail,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to invite tenant");
      }
      
      const data = await res.json();
      setInviteEmail("");
      setShowInviteForm(false);
      await fetchProperty(); // Refresh property data
      alert(`Invitation sent! Invite link: ${data.inviteLink}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setInviteLoading(false);
    }
  }

  async function removeTenant(userId) {
    if (!confirm("Are you sure you want to remove this tenant?")) return;
    
    try {
      const currentUserId = localStorage.getItem('userId');
      const res = await fetch("/api/landlord/properties/remove-tenant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-user-id': currentUserId,
        },
        body: JSON.stringify({ 
          propertyId: parseInt(params.id), 
          userId: userId 
        }),
      });
      
      if (!res.ok) throw new Error("Failed to remove tenant");
      
      await fetchProperty(); // Refresh property data
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRevokeInvitation(invitationId) {
    if (!window.confirm("Are you sure you want to revoke this invitation?")) return;
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch("/api/landlord/properties/revoke-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-user-id': userId,
        },
        body: JSON.stringify({ invitationId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to revoke invitation");
      }
      await fetchProperty();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <Card className="max-w-[98%] mx-auto w-full text-center">
        Loading property...
      </Card>
    );
  }

  if (error && !property) {
    return (
      <Card className="max-w-[98%] mx-auto w-full text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={() => router.push('/properties')}>
          Back to Properties
        </Button>
      </Card>
    );
  }

  if (!property) {
    return (
      <Card className="max-w-[98%] mx-auto w-full text-center">
        Property not found
      </Card>
    );
  }

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
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getPropertyTypeIcon(property.propertyType)}</span>
            <div>
              <h1 className="text-2xl font-bold text-accent-teal">{property.name}</h1>
              <p className="text-gray-600 capitalize">{property.propertyType}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => router.push('/properties')}
          >
            Back to Properties
          </Button>
        </div>
      </Card>

      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-accent-teal">Property Details</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-700">Address</h3>
              <p className="text-gray-600">{formatAddress(property)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700">Bedrooms</h3>
                <p className="text-gray-600">{property.bedrooms}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Bathrooms</h3>
                <p className="text-gray-600">{property.bathrooms}</p>
              </div>
            </div>
            {property.description && (
              <div>
                <h3 className="font-semibold text-gray-700">Description</h3>
                <p className="text-gray-600">{property.description}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Tenants & Invitations */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-accent-teal">Tenants & Invitations</h2>
            <Button
              onClick={() => setShowInviteForm(true)}
            >
              Invite Tenant
            </Button>
          </div>
          {error && <div className="text-red-600 mb-4">{error}</div>}

          {/* Invitations List */}
          {property.invitations && property.invitations.length > 0 && (
            <div className="space-y-3 mb-6">
              {property.invitations.map(invite => (
                <div key={invite.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium">
                      {invite.invitedUser
                        ? invite.invitedUser.username
                        : invite.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {invite.invitedUser
                        ? invite.invitedUser.email
                        : invite.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {invite.status === 'accepted' ? 'Accepted' : 'Pending'}
                    </p>
                  </div>
                  {invite.status === 'pending' && (
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => copyToClipboard(invite.inviteLink)}
                        >
                          Copy Link
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRevokeInvitation(invite.id)}
                        >
                          Remove
                        </Button>
                      </div>
                      <span className="text-xs text-gray-400">Link valid until {new Date(invite.expiresAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {invite.status === 'accepted' && invite.invitedUser && (
                    <span className="text-green-600 text-xs font-semibold">✔ Tenant</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tenants List (legacy memberships) */}
          {property.memberships && property.memberships.length > 0 && (
            <div className="space-y-3">
              {property.memberships.map(membership => (
                <div key={membership.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium">{membership.user.username}</p>
                    <p className="text-sm text-gray-600">{membership.user.email}</p>
                    <p className="text-xs text-gray-500">Role: {membership.role}</p>
                  </div>
                  {membership.role === 'tenant' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeTenant(membership.user.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
          {(!property.invitations || property.invitations.length === 0) && (!property.memberships || property.memberships.length === 0) && (
            <p className="text-gray-500 text-center py-4">No tenants or invitations yet</p>
          )}
        </Card>
      </div>

      {/* Documents */}
      {property.documents && property.documents.length > 0 && (
        <Card>
          <h2 className="text-xl font-bold mb-4 text-accent-teal">Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {property.documents.map(doc => (
              <div key={doc.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <span className="text-lg">📄</span>
                <div>
                  <p className="font-medium text-sm">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Invite Tenant Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-accent-teal">Invite Tenant</h2>
            <form onSubmit={handleInviteTenant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenant Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter tenant's email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowInviteForm(false)}
                  disabled={inviteLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={inviteLoading}
                >
                  {inviteLoading ? "Sending..." : "Send Invitation"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
} 