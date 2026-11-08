import test from "node:test";
import assert from "node:assert/strict";
import { searchCatalog, slugifyCatalogName } from "../src/lib/catalog-search.mjs";

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

test("returns matching categories using canonical category slugs", () => {
  const results = searchCatalog("visiting cards", products, categories);
  assert.ok(results.some((result) => (
    result.type === "category" &&
    result.href === "/category/visiting-cards"
  )));
});

test("trims and normalizes whitespace", () => {
  const results = searchCatalog("  Standard   Visiting Cards  ", products, categories);
  assert.equal(results[0]?.title, "Standard Visiting Cards");
});

test("returns no results for empty or unmatched queries", () => {
  assert.deepEqual(searchCatalog("   ", products, categories), []);
  assert.deepEqual(searchCatalog("nonexistent item", products, categories), []);
});

test("deduplicates repeated product entries by destination", () => {
  const duplicateProducts = [
    { name: "Photo Albums" },
    { name: "Photo Albums", badge: "Trending" },
  ];
  const results = searchCatalog("photo", duplicateProducts, []);
  assert.equal(results.length, 1);
});

test("slug generation removes punctuation and collapses separators", () => {
  assert.equal(
    slugifyCatalogName("Stationery, Letterheads & Notebooks"),
    "stationery-letterheads-notebooks",
  );
});


test("matches accented catalog names without requiring accents in the query", () => {
  const results = searchCatalog("cafe", [{ name: "Café Mugs" }], []);
  assert.equal(results[0]?.href, "/product/cafe-mugs");
});
