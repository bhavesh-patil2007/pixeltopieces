"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { searchCatalog } from "@/lib/catalog-search.mjs";
import { categoriesData } from "@/lib/categories";
import { allProducts } from "@/lib/products";

type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [logoutError, setLogoutError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const results = useMemo(
    () => searchCatalog(query, allProducts, categoriesData, 10),
    [query],
  );
  const hasQuery = query.trim().length > 0;

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

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results[0]) {
      router.push(results[0].href);
      setQuery("");
    }
  }

  async function handleLogout() {
    setLogoutError("");
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      if (!response.ok) {
        setLogoutError("Unable to sign out. Please try again.");
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
      <div className="search-bar" style={{ flex: 1, maxWidth: "600px", position: "relative" }}>
        <form role="search" onSubmit={handleSearchSubmit}>
          <input
            id="catalog-search"
            type="search"
            aria-label="Search products and categories"
            placeholder="Search products and categories"
            className="form-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setQuery("");
            }}
            autoComplete="off"
            aria-controls="catalog-search-results"
            aria-expanded={hasQuery}
            style={{
              width: "100%",
              margin: 0,
              padding: "0.75rem 3rem 0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          <button
            type="submit"
            aria-label="Search catalog"
            disabled={!hasQuery || results.length === 0}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              border: 0,
              background: "transparent",
              cursor: hasQuery && results.length ? "pointer" : "default",
              color: "#333",
              padding: "0.25rem",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        {hasQuery && (
          <div
            id="catalog-search-results"
            role="listbox"
            aria-label="Catalog search results"
            style={{
              position: "absolute",
              top: "calc(100% + 0.5rem)",
              left: 0,
              right: 0,
              background: "white",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              boxShadow: "var(--shadow-lg)",
              maxHeight: "min(60vh, 420px)",
              overflowY: "auto",
              zIndex: 120,
            }}
          >
            {results.length > 0 ? (
              results.map((result) => (
                <Link
                  key={`${result.type}:${result.href}`}
                  href={result.href}
                  role="option"
                  aria-selected="false"
                  onClick={() => setQuery("")}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.8rem 1rem",
                    borderBottom: "1px solid var(--border-color)",
                    color: "var(--text-dark)",
                  }}
                >
                  <span>{result.title}</span>
                  <span style={{ color: "var(--text-light)", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                    {result.type === "product" ? "Product" : "Category"}
                  </span>
                </Link>
              ))
            ) : (
              <p style={{ padding: "1rem", color: "var(--text-light)" }}>
                No products or categories found for “{query.trim()}”.
              </p>
            )}
          </div>
        )}
      </div>

      <div
        className="navbar-links"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2.5rem",
          marginLeft: "2rem",
          fontSize: "0.9rem",
          fontWeight: 500,
          color: "#333",
        }}
      >
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          My Projects
        </Link>

        <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "inherit", textDecoration: "none" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Sign in
          </Link>
        )}

        <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "inherit", textDecoration: "none" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
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
