import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";

const KEY_LENGTH = 64;
const COST = 16384;
const SALT_LENGTH = 16;
const MAX_MEMORY = 64 * 1024 * 1024;

/**
 * Derive a password key with Node's built-in scrypt implementation.
 * @param {string} password
 * @param {Buffer} salt
 * @returns {Promise<Buffer>}
 */
function deriveKey(password, salt) {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      KEY_LENGTH,
      { N: COST, r: 8, p: 1, maxmem: MAX_MEMORY },
      (error, key) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(key);
      },
    );
  });
}

/**
 * Hash a password using a unique random salt.
 * Stored format: scrypt$cost$saltHex$derivedKeyHex
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  const salt = randomBytes(SALT_LENGTH);
  const derivedKey = await deriveKey(password, salt);
  return [
    "scrypt",
    String(COST),
    salt.toString("hex"),
    derivedKey.toString("hex"),
  ].join("$");
}

/**
 * Verify a password against a stored scrypt hash.
 * Invalid or unsupported hash formats are rejected.
 * @param {string} password
 * @param {string} storedHash
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, storedHash) {
  if (typeof storedHash !== "string") return false;

  const [algorithm, cost, saltHex, keyHex, ...extra] = storedHash.split("$");
  if (
    algorithm !== "scrypt" ||
    cost !== String(COST) ||
    !saltHex ||
    !keyHex ||
    extra.length > 0 ||
    !/^[a-f0-9]+$/i.test(saltHex) ||
    !/^[a-f0-9]+$/i.test(keyHex)
  ) {
    return false;
  }

  const salt = Buffer.from(saltHex, "hex");
  const expectedKey = Buffer.from(keyHex, "hex");
  if (salt.length !== SALT_LENGTH || expectedKey.length !== KEY_LENGTH) {
    return false;
  }

  const actualKey = await deriveKey(password, salt);
  return timingSafeEqual(actualKey, expectedKey);
}
