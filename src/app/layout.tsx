import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Droplet, Heart, Search, User, LogIn, ShieldAlert, LayoutDashboard } from "lucide-react";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DonateBloodBD | Give Blood, Save Lives",
  description: "Connect with blood donors. A community-driven blood donation platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("auth_session");

  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="container flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Droplet color="var(--primary)" size={28} />
              <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)" }}>
                DonateBloodBD
              </span>
            </Link>
            
            <div className="flex gap-6 items-center hidden md:flex">
              <Link href="/search" className="nav-link flex items-center gap-2">
                <Search size={18} /> Find Blood
              </Link>
              <Link href="/request-blood" className="nav-link flex items-center gap-2">
                <Heart size={18} /> Request Blood
              </Link>
              <Link href="/admin" className="nav-link flex items-center gap-2">
                <ShieldAlert size={18} /> Admin
              </Link>
              
              {isLoggedIn ? (
                <Link href="/dashboard" className="nav-link flex items-center gap-2 text-primary font-medium">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              ) : (
                <Link href="/login" className="nav-link flex items-center gap-2">
                  <LogIn size={18} /> Sign In
                </Link>
              )}
              
              <Link href="/register" className="btn btn-primary">
                <User size={18} /> Register as Donor
              </Link>
            </div>
          </div>
        </nav>
        
        <main style={{ minHeight: 'calc(100vh - 72px)' }}>
          {children}
        </main>
        
        <footer style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-light)', padding: '3rem 0', textAlign: 'center' }}>
          <div className="container">
            <Droplet color="var(--primary-light)" size={32} style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ color: 'var(--surface)', marginBottom: '0.5rem' }}>DonateBloodBD</h3>
            <p style={{ color: '#cbd5e1', marginBottom: '2rem' }}>Every drop counts. Join our mission to save lives.</p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              &copy; {new Date().getFullYear()} DonateBloodBD. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
