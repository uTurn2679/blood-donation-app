"use client";

import { useState, useTransition } from "react";
import { loginUser } from "@/app/actions";
import { LogIn, AlertCircle, ShieldAlert, Droplet, Eye, EyeOff } from "lucide-react";
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
        // Rethrow NEXT_REDIRECT — Next.js uses this internally for navigation
        if (err?.digest?.startsWith("NEXT_REDIRECT")) {
          throw err;
        }
        setError(err.message || "Invalid phone number or password.");
      }
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ background: "linear-gradient(135deg, #fff5f5 0%, #fff 50%, #fff5f5 100%)" }}
    >
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ boxShadow: "0 8px 24px rgba(211,47,47,0.35)" }}
          >
            <Droplet size={32} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-muted mt-1 text-sm">Sign in to your donor account</p>
        </div>

        {/* Admin-only notice */}
        {reason === "admin_only" && (
          <div className="mb-5 p-4 rounded-xl border border-amber-200 bg-amber-50 flex gap-3 items-start">
            <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-amber-800 font-semibold text-sm">Admin Access Required</p>
              <p className="text-amber-700 text-xs mt-1">
                This page is restricted to administrators only.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-1.5"
                htmlFor="phone"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="input-field"
                required
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-1.5"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="input-field pr-12"
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full justify-center text-base py-3 mt-2"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center space-y-3">
            <p className="text-sm text-muted">
              Not a donor yet?{" "}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Register here
              </Link>
            </p>
            <p className="text-sm text-muted">
              Need blood urgently?{" "}
              <Link href="/request-blood" className="text-primary font-semibold hover:underline">
                Post a request
              </Link>
            </p>
          </div>

          {/* Admin quick-fill hint */}
          <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
            <p className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1.5">
              <ShieldAlert size={13} className="text-gray-400" />
              Admin login: phone <span className="font-mono font-bold text-gray-700">01700000000</span> · password <span className="font-mono font-bold text-gray-700">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-red-200 border-t-red-500 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
