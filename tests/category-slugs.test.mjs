import test from "node:test";
import assert from "node:assert/strict";
import { slugifyCategoryName } from "../src/lib/category-slugs.mjs";

test("creates slugs for category names with punctuation", () => {
  assert.equal(
    slugifyCategoryName("Signs, Posters & Marketing Materials"),
    "signs-posters-marketing-materials",
  );
});

test("trims leading and trailing separators", () => {
  assert.equal(slugifyCategoryName("  Visiting Cards  "), "visiting-cards");
});

test("normalizes repeated whitespace and punctuation", () => {
  assert.equal(
    slugifyCategoryName("Stationery,  Letterheads & Notebooks"),
    "stationery-letterheads-notebooks",
  );
});

test("normalizes accented characters", () => {
  assert.equal(slugifyCategoryName("Café & Gifts"), "cafe-gifts");
});

test("handles empty values safely", () => {
  assert.equal(slugifyCategoryName(""), "");
  assert.equal(slugifyCategoryName("   "), "");
});
