import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import Navbar from "./components/Navbar";
import { Droplet } from "lucide-react";

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
  const role = cookieStore.get("auth_role")?.value;
  const isAdmin = role === "ADMIN";

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />

        <main style={{ minHeight: "calc(100vh - 56px)" }}>
          {children}
        </main>

        <footer style={{
          backgroundColor: "var(--secondary)",
          color: "var(--text-light)",
          padding: "2.5rem 0",
          textAlign: "center"
        }}>
          <div className="container">
            <Droplet color="var(--primary-light)" size={28} style={{ margin: "0 auto 0.75rem auto" }} />
            <h3 style={{ color: "var(--surface)", marginBottom: "0.5rem", fontSize: "1.1rem" }}>
              DonateBloodBD
            </h3>
            <p style={{ color: "#cbd5e1", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              Every drop counts. Join our mission to save lives.
            </p>
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "1.25rem",
              fontSize: "0.8rem",
              color: "#94a3b8"
            }}>
              &copy; {new Date().getFullYear()} DonateBloodBD. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
