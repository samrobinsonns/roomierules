"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      
      if (res.ok) {
        const data = await res.json();
        // Store user ID in localStorage for authentication
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userRole', data.role);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('userLogin', { 
          detail: { 
            id: data.userId, 
            username: data.username, 
            role: data.role 
          } 
        }));
        
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <Card className="w-full max-w-md flex flex-col items-center gap-6">
        <span className="text-4xl">📝</span>
        <h1 className="text-2xl font-bold mb-2 text-primary-dark">Register for RoomieRules</h1>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        {error && <div className="text-red-600 font-medium">{error}</div>}
        <div className="text-sm mt-2">Already have an account? <Link href="/login" className="underline text-primary">Login</Link></div>
      </Card>
    </div>
  );
} 