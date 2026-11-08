/**
 * Normalize search text for case-insensitive, accent-insensitive matching.
 * @param {string} value
 * @returns {string}
 */
export function normalizeCatalogText(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Build a stable URL slug from a catalog display name.
 * @param {string} value
 * @returns {string}
 */
export function slugifyCatalogName(value) {
  return normalizeCatalogText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Search products and categories without maintaining a duplicate catalog.
 *
 * Exact matches rank above prefix matches, which rank above general partial
 * matches. Duplicate destinations are removed and results are capped.
 *
 * @param {string} query
 * @param {Array<{name: string, badge?: string}>} products
 * @param {Array<{name: string}>} categories
 * @param {number} [limit]
 * @returns {Array<{type: "product" | "category", title: string, href: string, description: string}>}
 */
export function searchCatalog(query, products = [], categories = [], limit = 10) {
  const term = normalizeCatalogText(query);
  if (!term) return [];

  const safeLimit = Number.isFinite(limit)
    ? Math.max(1, Math.min(Math.floor(limit), 50))
    : 10;

  const rank = (name) => {
    const normalizedName = normalizeCatalogText(name);
    if (normalizedName === term) return 3;
    if (normalizedName.startsWith(term)) return 2;
    return 1;
  };

  const productResults = products
    .filter((product) => normalizeCatalogText(product.name).includes(term))
    .map((product) => ({
      type: "product",
      title: product.name,
      href: \`/product/\${slugifyCatalogName(product.name)}\`,
      description: product.badge || "Product",
      score: rank(product.name),
    }));

  const categoryResults = categories
    .filter((category) => normalizeCatalogText(category.name).includes(term))
    .map((category) => ({
      type: "category",
      title: category.name,
      href: \`/category/\${slugifyCatalogName(category.name)}\`,
      description: "Category",
      score: rank(category.name),
    }));

  const uniqueResults = new Map();
  [...productResults, ...categoryResults]
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .forEach((result) => {
      if (!uniqueResults.has(result.href)) uniqueResults.set(result.href, result);
    });

  return [...uniqueResults.values()]
    .slice(0, safeLimit)
    .map(({ score: _score, ...result }) => result);
}
