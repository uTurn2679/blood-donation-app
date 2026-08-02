"use client";

import { useState } from "react";
import { loginUser } from "@/app/actions";
import { LogIn, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await loginUser(formData);
      // The server action handles the redirect on success
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
      setLoading(false);
    }
  };

  return (
    <div className="container py-16">
      <div className="text-center mb-8">
        <h1>Sign In</h1>
        <p className="text-muted">Welcome back to Gopalganj Blood Bank.</p>
      </div>

      <div className="glass-card mx-auto" style={{ maxWidth: '450px' }}>
        {error && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: 'var(--radius)', 
            marginBottom: '1.5rem',
            background: '#fee2e2',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="input-group">
            <label className="input-label" htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              className="input-field" 
              required 
              placeholder="01XXXXXXXXX"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="input-field" 
              required 
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
            {loading ? 'Signing In...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>
        
        <div className="text-center mt-6 text-sm text-muted">
          Don't have an account? <Link href="/register" className="text-primary font-medium">Register here</Link>
        </div>
      </div>
    </div>
  );
}
