import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/lib/password.mjs";

test("password hashes verify the original password", async () => {
  const hash = await hashPassword("correct horse battery staple");
  assert.notEqual(hash, "correct horse battery staple");
  assert.equal(await verifyPassword("correct horse battery staple", hash), true);
});

test("password hashes reject incorrect passwords", async () => {
  const hash = await hashPassword("a secure sample password");
  assert.equal(await verifyPassword("a different password", hash), false);
});

test("each hash uses an independent random salt", async () => {
  const first = await hashPassword("same password");
  const second = await hashPassword("same password");
  assert.notEqual(first, second);
  assert.equal(await verifyPassword("same password", first), true);
  assert.equal(await verifyPassword("same password", second), true);
});

test("malformed and unsupported hashes are rejected", async () => {
  assert.equal(await verifyPassword("password", ""), false);
  assert.equal(await verifyPassword("password", "plain-text-password"), false);
  assert.equal(await verifyPassword("password", "bcrypt$bad$hash"), false);
});
