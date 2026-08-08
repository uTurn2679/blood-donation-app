"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Droplet, Heart, Search, User, LogIn, LogOut,
  ShieldAlert, LayoutDashboard, Activity, Menu, X
} from "lucide-react";
import { logoutUser } from "@/app/actions";

interface NavbarProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

export default function Navbar({ isLoggedIn, isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" onClick={close} style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <Droplet color="var(--primary)" size={26} />
            <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-main)" }}>
              DonateBloodBD
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="desktop-nav">
            {isAdmin && (
              <Link href="/search" className="nav-link">
                <Search size={17} /> Find Donors
              </Link>
            )}
            <Link href="/blood-requests" className="nav-link">
              <Heart size={17} /> Blood Requests
            </Link>
            <Link href="/request-blood" className="nav-link">
              <Activity size={17} /> Request Blood
            </Link>
            {isAdmin && (
              <Link href="/admin" className="nav-link">
                <ShieldAlert size={17} /> Admin
              </Link>
            )}
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="nav-link primary-link">
                  <LayoutDashboard size={17} /> Dashboard
                </Link>
                <form action={logoutUser} style={{ display: "inline-flex" }}>
                  <button
                    type="submit"
                    className="btn btn-outline"
                    style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem", borderColor: "#fca5a5", color: "#dc2626" }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-link">
                  <LogIn size={17} /> Sign In
                </Link>
                <Link href="/login" className="btn btn-primary" style={{ padding: "0.55rem 1.1rem", fontSize: "0.9rem" }}>
                  <User size={17} /> Register
                </Link>
              </>
            )}
          </div>

          {/* Hamburger button (mobile only) */}
          <button
            className="hamburger-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
          {isAdmin && (
            <Link href="/search" className="mobile-menu-item" onClick={close}>
              <Search size={20} /> Find Donors
            </Link>
          )}
          <Link href="/blood-requests" className="mobile-menu-item" onClick={close}>
            <Heart size={20} /> Blood Requests
          </Link>
          <Link href="/request-blood" className="mobile-menu-item" onClick={close}>
            <Activity size={20} /> Request Blood
          </Link>
          {isAdmin && (
            <Link href="/admin" className="mobile-menu-item" onClick={close}>
              <ShieldAlert size={20} /> Admin
            </Link>
          )}
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="mobile-menu-item" onClick={close} style={{ color: "var(--primary)" }}>
                <LayoutDashboard size={20} /> Dashboard
              </Link>
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="mobile-menu-item"
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", color: "#ef4444", textAlign: "left" }}
                >
                  <LogOut size={20} /> Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="mobile-menu-item" onClick={close}>
                <LogIn size={20} /> Sign In
              </Link>
              <Link href="/login" className="mobile-menu-item primary" onClick={close}>
                <User size={20} /> Register as Donor
              </Link>
            </>
          )}
        </div>
      </nav>

    </>
  );
}
