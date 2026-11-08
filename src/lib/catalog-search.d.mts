export type CatalogSearchResult = {
  type: "product" | "category";
  title: string;
  href: string;
  description: string;
};

export function normalizeCatalogText(value: string): string;
export function slugifyCatalogName(value: string): string;
export function searchCatalog(
  query: string,
  products?: Array<{ name: string; badge?: string }>,
  categories?: Array<{ name: string }>,
  limit?: number,
): CatalogSearchResult[];
