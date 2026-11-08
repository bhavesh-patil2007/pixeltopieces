/**
 * Convert a category display name into the canonical route slug.
 * This helper is intentionally framework-independent so it can be tested
 * without starting the Next.js application.
 *
 * @param {string} value
 * @returns {string}
 */
export function slugifyCategoryName(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
