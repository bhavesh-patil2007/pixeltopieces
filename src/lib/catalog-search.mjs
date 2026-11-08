/**
 * Normalize catalog text for case-insensitive, accent-insensitive matching.
 * @param {string} value
 */
export function normalizeCatalogText(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase()
    .split(" ")
    .filter(Boolean)
    .join(" ");
}

/**
 * Build a stable URL slug from a product or category display name.
 * @param {string} value
 */
export function slugifyCatalogName(value) {
  return normalizeCatalogText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Search configured products and categories without maintaining a duplicate index.
 * @param {string} query
 * @param {Array<{name: string, badge?: string}>} products
 * @param {Array<{name: string}>} categories
 * @param {number} [limit]
 */
export function searchCatalog(query, products = [], categories = [], limit = 10) {
  const term = normalizeCatalogText(query);
  if (!term) return [];

  /** @param {string} name */
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
      href: `/product/${slugifyCatalogName(product.name)}`,
      description: product.badge || "Product",
      score: rank(product.name),
    }));

  const categoryResults = categories
    .filter((category) => normalizeCatalogText(category.name).includes(term))
    .map((category) => ({
      type: "category",
      title: category.name,
      href: `/category/${slugifyCatalogName(category.name)}`,
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
    .slice(0, Math.max(1, Math.min(limit, 50)))
    .map(({ score: _score, ...result }) => result);
}
