"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useAuth } from "../../../hooks/useAuth";

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
  const { user, loading } = useAuth();
  const [property, setProperty] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      fetchProperty();
    }
  }, [params.id, loading]);

  async function fetchProperty() {
    setPageLoading(true);
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
    setPageLoading(false);
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

  async function handleDocumentUpload(e) {
    e.preventDefault();
    if (!documentFile || !documentName.trim()) {
      setError("Please select a file and enter a document name");
      return;
    }

    setUploadLoading(true);
    setError("");
    
    try {
      const userId = localStorage.getItem('userId');
      const formData = new FormData();
      formData.append('file', documentFile);
      formData.append('name', documentName);
      formData.append('propertyId', params.id);

      const res = await fetch("/api/landlord/properties/documents/upload", {
        method: "POST",
        headers: {
          'x-user-id': userId,
        },
        body: formData,
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to upload document");
      }
      
      setDocumentFile(null);
      setDocumentName("");
      setShowDocumentUpload(false);
      await fetchProperty(); // Refresh property data
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadLoading(false);
    }
  }

  async function handleShareDocument(documentId, tenantIds) {
    setShareLoading(true);
    setError("");
    
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch("/api/landlord/properties/documents/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-user-id': userId,
        },
        body: JSON.stringify({
          documentId,
          tenantIds,
          propertyId: parseInt(params.id),
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to share document");
      }
      
      setShowShareModal(false);
      setSelectedDocument(null);
      await fetchProperty(); // Refresh property data
    } catch (err) {
      setError(err.message);
    } finally {
      setShareLoading(false);
    }
  }

  async function handleDeleteDocument(documentId) {
    if (!confirm("Are you sure you want to delete this document?")) return;
    
    try {
      const userId = localStorage.getItem('userId');
      const res = await fetch(`/api/landlord/properties/documents/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'x-user-id': userId,
        },
        body: JSON.stringify({ documentId }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete document");
      }
      
      await fetchProperty(); // Refresh property data
    } catch (err) {
      setError(err.message);
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

  if (loading || pageLoading) {
    return (
      <div className={user ? "lg:pl-64 min-h-screen bg-gray-50 dark:bg-gray-900" : "bg-gradient-to-br from-primary-light via-background to-accent-blue min-h-screen"}>
        <div className={user ? "p-6 min-h-screen" : "max-w-[95%] mx-auto w-full px-2 sm:px-4 lg:px-6 py-8 min-h-[calc(100vh-64px)]"}>
          <Card className="max-w-[98%] mx-auto w-full text-center">
            Loading property...
          </Card>
        </div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className={user ? "lg:pl-64 min-h-screen bg-gray-50 dark:bg-gray-900" : "bg-gradient-to-br from-primary-light via-background to-accent-blue min-h-screen"}>
        <div className={user ? "p-6 min-h-screen" : "max-w-[95%] mx-auto w-full px-2 sm:px-4 lg:px-6 py-8 min-h-[calc(100vh-64px)]"}>
          <Card className="max-w-[98%] mx-auto w-full text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={() => router.push('/properties')}>
              Back to Properties
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className={user ? "lg:pl-64 min-h-screen bg-gray-50 dark:bg-gray-900" : "bg-gradient-to-br from-primary-light via-background to-accent-blue min-h-screen"}>
        <div className={user ? "p-6 min-h-screen" : "max-w-[95%] mx-auto w-full px-2 sm:px-4 lg:px-6 py-8 min-h-[calc(100vh-64px)]"}>
          <Card className="max-w-[98%] mx-auto w-full text-center">
            Property not found
          </Card>
        </div>
      </div>
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
    <div className={user ? "lg:pl-64 min-h-screen bg-gray-50 dark:bg-gray-900" : "bg-gradient-to-br from-primary-light via-background to-accent-blue min-h-screen"}>
      <div className={user ? "p-6 min-h-screen" : "max-w-[95%] mx-auto w-full px-2 sm:px-4 lg:px-6 py-8 min-h-[calc(100vh-64px)]"}>
        <div className="pt-8 max-w-[98%] mx-auto w-full space-y-6">
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
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-accent-teal">Documents</h2>
              <Button onClick={() => setShowDocumentUpload(true)}>
                Upload Document
              </Button>
            </div>
            
            {property.documents && property.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {property.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">📄</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-xs text-gray-500">
                          Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedDocument(doc);
                          setShowShareModal(true);
                        }}
                      >
                        Share
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">📄</span>
                <p className="text-gray-600 mb-4">No documents uploaded yet.</p>
                <p className="text-sm text-gray-500">Upload property documents, contracts, or other important files.</p>
              </div>
            )}
          </Card>

          {/* Document Upload Modal */}
          {showDocumentUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-accent-teal">Upload Document</h2>
                <form onSubmit={handleDocumentUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter document name (e.g., Rental Agreement)"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      File
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setDocumentFile(e.target.files[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowDocumentUpload(false);
                        setDocumentFile(null);
                        setDocumentName("");
                      }}
                      disabled={uploadLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={uploadLoading}
                    >
                      {uploadLoading ? "Uploading..." : "Upload Document"}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Share Document Modal */}
          {showShareModal && selectedDocument && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <Card className="max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-accent-teal">Share Document</h2>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Sharing: <strong>{selectedDocument.name}</strong></p>
                  <p className="text-sm text-gray-500">Select tenants to share this document with:</p>
                </div>
                
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {property.memberships?.filter(m => m.role === 'tenant').map(membership => (
                    <label key={membership.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        value={membership.user.id}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {membership.user.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{membership.user.username}</p>
                          <p className="text-xs text-gray-500">{membership.user.email}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                
                {property.memberships?.filter(m => m.role === 'tenant').length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p>No tenants assigned to this property yet.</p>
                    <p className="text-sm">Invite tenants first to share documents.</p>
                  </div>
                )}
                
                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowShareModal(false);
                      setSelectedDocument(null);
                    }}
                    disabled={shareLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const selectedTenants = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                        .map(checkbox => parseInt(checkbox.value));
                      handleShareDocument(selectedDocument.id, selectedTenants);
                    }}
                    disabled={shareLoading || property.memberships?.filter(m => m.role === 'tenant').length === 0}
                  >
                    {shareLoading ? "Sharing..." : "Share Document"}
                  </Button>
                </div>
              </Card>
            </div>
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
      </div>
    </div>
  );
} 