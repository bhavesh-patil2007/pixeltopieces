"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { searchCatalog } from "@/lib/catalog-search.mjs";
import { categoriesData } from "@/lib/categories";
import { allProducts } from "@/lib/products";

export default function Topbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const results = useMemo(
    () => searchCatalog(query, allProducts, categoriesData, 10),
    [query],
  );
  const hasQuery = query.trim().length > 0;

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results[0]) {
      router.push(results[0].href);
      setQuery("");
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
          <label htmlFor="catalog-search" className="sr-only">
            Search products and categories
          </label>
          <input
            id="catalog-search"
            type="search"
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

        <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "inherit" }}>
          My Projects
        </Link>
        <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "inherit" }}>
          My Favorites
        </Link>
        <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "inherit" }}>
          Sign in
        </Link>
        <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "inherit" }}>
          Cart
        </Link>
      </div>
    </header>
  );
}
