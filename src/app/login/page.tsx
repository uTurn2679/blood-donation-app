"use client";

import { useState, useTransition } from "react";
import { loginUser } from "@/app/actions";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await loginUser(formData);
      } catch (err: any) {
        if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
        setError(err.message || "Invalid phone number or password.");
      }
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0f4f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* Logo */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{
            width: "48px", height: "48px",
            background: "#c62828",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "1.5rem"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C12 2 5 9.5 5 14a7 7 0 0014 0C19 9.5 12 2 12 2z"/>
            </svg>
          </div>

          <h1 style={{
            fontSize: "2.4rem",
            fontWeight: 900,
            color: "#0d1117",
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
            textTransform: "uppercase",
            marginBottom: "0.75rem"
          }}>
            WELCOME BACK
          </h1>
          <p style={{ color: "#4a5568", fontSize: "1rem", lineHeight: 1.5 }}>
            Sign in to your life-saver portal to continue your mission.
          </p>
        </div>

        {/* Admin notice */}
        {reason === "admin_only" && (
          <div style={{
            background: "#fff8e1",
            border: "1px solid #f9a825",
            borderRadius: "12px",
            padding: "0.875rem 1rem",
            marginBottom: "1.5rem",
            display: "flex",
            gap: "0.625rem",
            alignItems: "flex-start"
          }}>
            <ShieldAlert size={18} style={{ color: "#f9a825", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "#7b5e00" }}>Admin Access Required</p>
              <p style={{ fontSize: "0.8rem", color: "#9b6f00", marginTop: "2px" }}>This page is restricted to administrators only.</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: "#fff5f5",
            border: "1px solid #feb2b2",
            borderRadius: "12px",
            padding: "0.875rem 1rem",
            marginBottom: "1.5rem",
            color: "#c53030",
            fontSize: "0.875rem",
            fontWeight: 500
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Phone field */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#718096",
              marginBottom: "0.5rem"
            }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              placeholder="Enter your phone number"
              autoComplete="tel"
              style={{
                width: "100%",
                padding: "1rem 1.25rem",
                border: "1.5px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "1rem",
                color: "#2d3748",
                background: "white",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "#c62828"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          {/* Password field */}
          <div style={{ marginBottom: "0.75rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#718096",
              marginBottom: "0.5rem"
            }}>
              Password Identifier
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                required
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "1rem 3.5rem 1rem 1.25rem",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  color: "#2d3748",
                  background: "white",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#c62828"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#a0aec0",
                  padding: 0,
                  display: "flex"
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot password placeholder */}
          <div style={{ textAlign: "left", marginBottom: "1.75rem" }}>
            <span style={{ color: "#c62828", fontSize: "0.9rem", fontWeight: 600, cursor: "default" }}>
              Forgotten password?
            </span>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={isPending}
            style={{
              width: "100%",
              padding: "1.1rem",
              background: isPending ? "#9b8b8b" : "#c62828",
              color: "white",
              border: "none",
              borderRadius: "50px",
              fontSize: "1rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: isPending ? "not-allowed" : "pointer",
              transition: "background 0.2s, transform 0.1s",
              boxShadow: "0 4px 20px rgba(198, 40, 40, 0.35)"
            }}
            onMouseEnter={e => { if (!isPending) (e.target as HTMLElement).style.background = "#b71c1c" }}
            onMouseLeave={e => { if (!isPending) (e.target as HTMLElement).style.background = "#c62828" }}
          >
            {isPending ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <span style={{
                  width: "16px", height: "16px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                  display: "inline-block"
                }} />
                SIGNING IN...
              </span>
            ) : "LOGIN"}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: "1rem", margin: "1.75rem 0"
        }}>
          <div style={{ flex: 1, height: "1px", background: "#d1d5db" }} />
          <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af" }}>
            OR CONTINUE WITH
          </span>
          <div style={{ flex: 1, height: "1px", background: "#d1d5db" }} />
        </div>

        {/* Register button */}
        <Link href="/register" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          width: "100%",
          padding: "1rem",
          background: "white",
          border: "1.5px solid #e2e8f0",
          borderRadius: "12px",
          textDecoration: "none",
          color: "#2d3748",
          fontSize: "0.9rem",
          fontWeight: 800,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          transition: "border-color 0.2s, background 0.2s",
          boxSizing: "border-box"
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f7fafc" }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "white" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#c62828">
            <path d="M12 2C12 2 5 9.5 5 14a7 7 0 0014 0C19 9.5 12 2 12 2z"/>
          </svg>
          REGISTER AS DONOR
        </Link>

        {/* Admin hint */}
        <div style={{
          marginTop: "1.5rem",
          padding: "0.75rem",
          background: "white",
          border: "1px dashed #d1d5db",
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500 }}>
            🛡️ Admin — Phone: <strong style={{ color: "#4a5568" }}>01700000000</strong> · Pass: <strong style={{ color: "#4a5568" }}>admin123</strong>
          </p>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #a0aec0; }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4f0" }}>
        <div style={{ width: "32px", height: "32px", border: "4px solid #f3f3f3", borderTop: "4px solid #c62828", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
