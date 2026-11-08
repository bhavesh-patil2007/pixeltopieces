"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [logoutError, setLogoutError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isActive = true;

    fetch("/api/auth/session", {
      credentials: "same-origin",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json();
        return data.user as SessionUser | null;
      })
      .then((sessionUser) => {
        if (isActive) setUser(sessionUser);
      })
      .catch(() => {
        if (isActive) setUser(null);
      });

    return () => {
      isActive = false;
    };
  }, [pathname]);

  async function handleLogout() {
    setLogoutError("");
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setLogoutError(data.error || "Unable to sign out. Please try again.");
        return;
      }

      setUser(null);
      router.refresh();
    } catch {
      setLogoutError("A network error occurred while signing out.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header
      className="navbar"
      style={{
        justifyContent: "space-between",
        padding: "1rem 3rem",
        background: "white",
        borderBottom: "1px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div className="navbar-links" style={{ display: "flex", alignItems: "center", gap: "2.5rem", marginLeft: "2rem", fontSize: "0.9rem", fontWeight: 500, color: "#333" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
            <span>Help is here</span>
            <span style={{ fontSize: "0.75rem", color: "#666", fontWeight: 400 }}>022-9808-8767</span>
          </div>
        </div>

        <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "inherit", textDecoration: "none" }}>
          My Projects
        </Link>
        <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "inherit", textDecoration: "none" }}>
          My Favorites
        </Link>

        {user ? (
          <>
            <span title={user.email}>Hi, {user.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              style={{ border: 0, background: "transparent", color: "inherit", cursor: "pointer", font: "inherit" }}
            >
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </button>
          </>
        ) : (
          <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "inherit", textDecoration: "none" }}>
            Sign in
          </Link>
        )}

        <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "inherit", textDecoration: "none" }}>
          Cart
        </Link>
      </div>
      {logoutError && (
        <p role="alert" style={{ color: "#dc2626", position: "absolute", right: "1rem", top: "100%" }}>
          {logoutError}
        </p>
      )}
    </header>
  );
}
