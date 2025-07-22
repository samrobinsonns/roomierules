"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function InviteAcceptancePage() {
  const params = useParams();
  const router = useRouter();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInvitation();
  }, [params.token]);

  async function fetchInvitation() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/invite/${params.token}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          setError("Invitation not found or has expired");
        } else {
          setError("Failed to load invitation");
        }
        return;
      }
      
      const data = await res.json();
      setInvitation(data);
      
      // Pre-fill username from email
      const emailUsername = data.email.split('@')[0];
      setFormData(prev => ({ ...prev, username: emailUsername }));
    } catch (err) {
      setError("Failed to load invitation");
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setSubmitting(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`/api/invite/${params.token}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to accept invitation");
      }

      const data = await res.json();
      
      // Store user data for automatic login
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);
      localStorage.setItem('userRole', data.role);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <Card className="w-full max-w-md text-center">
          Loading invitation...
        </Card>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <Card className="w-full max-w-md text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={() => router.push('/')}>
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <Card className="w-full max-w-md text-center">
          Invitation not found
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-4xl">🎉</span>
          <h1 className="text-2xl font-bold mt-2 text-accent-teal">You're Invited!</h1>
          <p className="text-gray-600 mt-2">
            Complete your registration to join <strong>{invitation.property.name}</strong>
          </p>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Property Details</h3>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Name:</strong> {invitation.property.name}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Type:</strong> {invitation.property.propertyType}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Address:</strong> {invitation.property.addressLine1}, {invitation.property.city}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={invitation.email}
              disabled
              className="bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <Input
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Creating Account..." : "Accept Invitation"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          By accepting this invitation, you agree to join this property as a tenant.
        </div>
      </Card>
    </div>
  );
} 