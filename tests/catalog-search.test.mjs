import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeCatalogText,
  searchCatalog,
  slugifyCatalogName,
} from "../src/lib/catalog-search.mjs";

const products = [
  { name: "Standard Visiting Cards", badge: "Popular" },
  { name: "Rounded Corner Visiting Cards", badge: "BUY 100" },
  { name: "Photo Albums" },
];
const categories = [
  { name: "Visiting Cards" },
  { name: "Stationery, Letterheads & Notebooks" },
];

test("returns an exact product match with a valid product route", () => {
  const results = searchCatalog("Standard Visiting Cards", products, categories);
  assert.equal(results[0]?.type, "product");
  assert.equal(results[0]?.href, "/product/standard-visiting-cards");
});

test("supports partial and case-insensitive product matching", () => {
  const results = searchCatalog("VISITING", products, categories);
  assert.ok(results.some((result) => result.title === "Standard Visiting Cards"));
  assert.ok(results.some((result) => result.title === "Rounded Corner Visiting Cards"));
});

test("returns category matches using category route slugs", () => {
  const results = searchCatalog("visiting cards", products, categories);
  assert.ok(results.some((result) => (
    result.type === "category" &&
    result.href === "/category/visiting-cards"
  )));
});

test("trims and normalizes repeated whitespace", () => {
  const results = searchCatalog("  Standard   Visiting Cards  ", products, categories);
  assert.equal(results[0]?.title, "Standard Visiting Cards");
  assert.equal(normalizeCatalogText(" A   B "), "a b");
});

test("returns an empty array for empty or unmatched queries", () => {
  assert.deepEqual(searchCatalog("   ", products, categories), []);
  assert.deepEqual(searchCatalog("nonexistent item", products, categories), []);
});

test("deduplicates results that point to the same route", () => {
  const duplicateProducts = [
    { name: "Photo Albums" },
    { name: "Photo Albums", badge: "Trending" },
  ];
  const results = searchCatalog("photo", duplicateProducts, []);
  assert.equal(results.length, 1);
});

test("normalizes accented names", () => {
  const results = searchCatalog("cafe", [{ name: "Café Mugs" }], []);
  assert.equal(results[0]?.href, "/product/cafe-mugs");
});

test("caps result limits to a safe range", () => {
  const manyProducts = Array.from({ length: 70 }, (_, index) => ({
    name: `Visiting Product ${index}`,
  }));
  assert.equal(searchCatalog("visiting", manyProducts, [], 100).length, 50);
  assert.equal(searchCatalog("visiting", manyProducts, [], 0).length, 1);
});

test("slug generation collapses punctuation", () => {
  assert.equal(
    slugifyCatalogName("Stationery, Letterheads & Notebooks"),
    "stationery-letterheads-notebooks",
  );
});
