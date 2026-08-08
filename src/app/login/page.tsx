"use client";

import { useState, useTransition } from "react";
import { loginUser, registerDonor } from "@/app/actions";
import { Eye, EyeOff, Droplet, UserPlus, LogIn, ShieldAlert, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { DEPARTMENTS, SESSIONS } from "@/lib/constants";

type Tab = "signin" | "signup" | "admin";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const switchTab = (t: Tab) => {
    setTab(t);
    setError(null);
    setSuccess(null);
  };

  /* ----------- Sign In ----------- */
  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await loginUser(formData);
      } catch (err: any) {
        if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
        setError(err.message || "Invalid credentials.");
      }
    });
  };

  /* ----------- Admin Sign In ----------- */
  const handleAdminSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await loginUser(formData);
      } catch (err: any) {
        if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
        setError(err.message || "Invalid admin credentials.");
      }
    });
  };

  /* ----------- Sign Up ----------- */
  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await registerDonor(formData);
      } catch (err: any) {
        if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
        setError(err.message || "Registration failed.");
      }
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fff5f5 0%, #f8fafc 60%, #fff5f5 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem 1rem",
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }} className="animate-fade-in">

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{
            width: "52px", height: "52px",
            background: "var(--primary)",
            borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 0.875rem",
            boxShadow: "0 8px 24px rgba(211,47,47,0.3)"
          }}>
            <Droplet size={28} color="white" />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0d1117", marginBottom: "0.25rem" }}>
            Blood Donor GSTU
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {tab === "signin" && "Sign in to continue your life-saving mission"}
            {tab === "signup" && "Join thousands of heroes saving lives"}
            {tab === "admin" && "Admin access — restricted portal"}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          background: "#f1f5f9",
          borderRadius: "12px",
          padding: "4px",
          marginBottom: "1.5rem",
          gap: "2px"
        }}>
          {([
            { key: "signin", label: "Sign In", icon: LogIn },
            { key: "signup", label: "Sign Up", icon: UserPlus },
            { key: "admin", label: "Admin", icon: ShieldAlert },
          ] as { key: Tab; label: string; icon: any }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              style={{
                padding: "0.6rem 0.25rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                transition: "all 0.2s",
                background: tab === key ? "white" : "transparent",
                color: tab === key ? (key === "admin" ? "var(--primary)" : "var(--primary)") : "var(--text-muted)",
                boxShadow: tab === key ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid #f1f5f9",
          overflow: "hidden"
        }}>
          {/* Error / Success */}
          {(error || success) && (
            <div style={{
              padding: "0.875rem 1.5rem",
              background: error ? "#fef2f2" : "#f0fdf4",
              borderBottom: `1px solid ${error ? "#fecaca" : "#bbf7d0"}`,
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: error ? "#dc2626" : "#16a34a"
            }}>
              {error ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              {error || success}
            </div>
          )}

          <div style={{ padding: "1.75rem" }}>

            {/* ===================== SIGN IN TAB ===================== */}
            {tab === "signin" && (
              <form onSubmit={handleSignIn}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>Phone Number</label>
                  <input name="phone" type="tel" required placeholder="01XXXXXXXXX"
                    autoComplete="tel" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "var(--primary)")}
                    onBlur={e => (e.target.style.borderColor = "#e2e8f0")} />
                </div>

                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input name="password" type={showPassword ? "text" : "password"}
                      required placeholder="Enter your password"
                      autoComplete="current-password"
                      style={{ ...inputStyle, paddingRight: "3rem" }}
                      onFocus={e => (e.target.style.borderColor = "var(--primary)")}
                      onBlur={e => (e.target.style.borderColor = "#e2e8f0")} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={eyeBtn}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <SubmitBtn label="Sign In" icon={<LogIn size={17} />} loading={isPending} />

                <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  New here?{" "}
                  <button type="button" onClick={() => switchTab("signup")}
                    style={{ color: "var(--primary)", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
                    Create an account
                  </button>
                </p>
              </form>
            )}

            {/* ===================== SIGN UP TAB ===================== */}
            {tab === "signup" && (
              <form onSubmit={handleSignUp}>
                {/* Name + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "0.75rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input name="name" type="text" required placeholder="Your name"
                      autoComplete="name" style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "var(--primary)")}
                      onBlur={e => (e.target.style.borderColor = "#e2e8f0")} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone *</label>
                    <input name="phone" type="tel" required placeholder="01XXXXXXXXX"
                      autoComplete="tel" style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "var(--primary)")}
                      onBlur={e => (e.target.style.borderColor = "#e2e8f0")} />
                  </div>
                </div>

                {/* Blood Group + Password */}
                <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "0.75rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Blood Group *</label>
                    <select name="bloodGroup" required defaultValue="" style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "var(--primary)")}
                      onBlur={e => (e.target.style.borderColor = "#e2e8f0")}>
                      <option value="" disabled>Select</option>
                      {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg =>
                        <option key={bg} value={bg}>{bg}</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Password *</label>
                    <div style={{ position: "relative" }}>
                      <input name="password" type={showPassword ? "text" : "password"}
                        required placeholder="Create password"
                        autoComplete="new-password"
                        style={{ ...inputStyle, paddingRight: "3rem" }}
                        onFocus={e => (e.target.style.borderColor = "var(--primary)")}
                        onBlur={e => (e.target.style.borderColor = "#e2e8f0")} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        style={eyeBtn}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Department + Session */}
                <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <div>
                    <label style={labelStyle}>Department <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
                    <select name="department" defaultValue="" style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "var(--primary)")}
                      onBlur={e => (e.target.style.borderColor = "#e2e8f0")}>
                      <option value="">Select</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Session <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
                    <select name="session" defaultValue="" style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "var(--primary)")}
                      onBlur={e => (e.target.style.borderColor = "#e2e8f0")}>
                      <option value="">Select</option>
                      {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <SubmitBtn label="Create Account" icon={<UserPlus size={17} />} loading={isPending} />

                <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  Already a donor?{" "}
                  <button type="button" onClick={() => switchTab("signin")}
                    style={{ color: "var(--primary)", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
                    Sign in instead
                  </button>
                </p>
              </form>
            )}

            {/* ===================== ADMIN TAB ===================== */}
            {tab === "admin" && (
              <form onSubmit={handleAdminSignIn}>
                {/* Admin badge */}
                <div style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  padding: "0.75rem 1rem",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem"
                }}>
                  <ShieldAlert size={18} color="var(--primary)" />
                  <p style={{ fontSize: "0.8rem", color: "#7f1d1d", fontWeight: 600 }}>
                    Admin Portal — Restricted Access Only
                  </p>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>Admin Username</label>
                  <input name="phone" type="text" required placeholder="Enter admin username"
                    autoComplete="username" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "var(--primary)")}
                    onBlur={e => (e.target.style.borderColor = "#e2e8f0")} />
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>Admin Password</label>
                  <div style={{ position: "relative" }}>
                    <input name="password" type={showAdminPassword ? "text" : "password"}
                      required placeholder="Enter admin password"
                      autoComplete="current-password"
                      style={{ ...inputStyle, paddingRight: "3rem" }}
                      onFocus={e => (e.target.style.borderColor = "var(--primary)")}
                      onBlur={e => (e.target.style.borderColor = "#e2e8f0")} />
                    <button type="button" onClick={() => setShowAdminPassword(!showAdminPassword)}
                      style={eyeBtn}>
                      {showAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <SubmitBtn label="Admin Sign In" icon={<ShieldAlert size={17} />} loading={isPending} />

                <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.8rem", color: "#9ca3af" }}>
                  🔒 This area is for authorized administrators only.
                </p>
              </form>
            )}

          </div>
        </div>

        {/* Blood requests link */}
        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Need blood urgently?{" "}
          <Link href="/blood-requests" style={{ color: "var(--primary)", fontWeight: 700 }}>
            View all requests →
          </Link>
        </p>

      </div>
    </div>
  );
}

/* ===== Shared sub-components & styles ===== */

function SubmitBtn({ label, icon, loading }: { label: string; icon: React.ReactNode; loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        padding: "0.95rem",
        background: loading ? "#aaa" : "var(--primary)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontSize: "0.95rem",
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        boxShadow: "0 4px 16px rgba(211,47,47,0.3)",
        transition: "all 0.2s"
      }}
    >
      {loading ? (
        <>
          <span style={{
            width: "16px", height: "16px",
            border: "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "white",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.7s linear infinite"
          }} />
          Please wait...
        </>
      ) : <>{icon} {label}</>}
    </button>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "#6b7280",
  marginBottom: "0.4rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.9rem",
  border: "1.5px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "0.9rem",
  color: "#1e293b",
  background: "white",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
};

const eyeBtn: React.CSSProperties = {
  position: "absolute",
  right: "0.75rem",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#9ca3af",
  padding: 0,
  display: "flex",
};
