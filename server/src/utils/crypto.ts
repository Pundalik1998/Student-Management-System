import CryptoJS from "crypto-js";
import { env } from "../config/env.js";

export type AesEncryptedPayload = {
  ct: string; // ciphertext (base64)
  iv: string; // iv (hex)
  s: string; // salt (hex)
};

function encryptWithKey(plainText: string, key: string): AesEncryptedPayload {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const derivedKey = CryptoJS.PBKDF2(key, salt, {
    keySize: 256 / 32,
    iterations: 100_000,
    hasher: CryptoJS.algo.SHA256,
  });
  const encrypted = CryptoJS.AES.encrypt(plainText, derivedKey, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    ct: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
    iv: iv.toString(CryptoJS.enc.Hex),
    s: salt.toString(CryptoJS.enc.Hex),
  };
}

function decryptWithKey(payload: AesEncryptedPayload, key: string): string {
  const salt = CryptoJS.enc.Hex.parse(payload.s);
  const iv = CryptoJS.enc.Hex.parse(payload.iv);
  const derivedKey = CryptoJS.PBKDF2(key, salt, {
    keySize: 256 / 32,
    iterations: 100_000,
    hasher: CryptoJS.algo.SHA256,
  });

  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(payload.ct),
  });

  const decrypted = CryptoJS.AES.decrypt(cipherParams, derivedKey, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const out = decrypted.toString(CryptoJS.enc.Utf8);
  if (!out) throw new Error("Failed to decrypt payload");
  return out;
}

/**
 * Backend encryption contract:
 * - Client sends AES_KEY_1 encrypted JSON payload (level-1).
 * - Server decrypts level-1, re-encrypts with AES_KEY_2 (level-2) for DB.
 * - On fetch, server decrypts level-2 and returns level-1 payload back to client.
 */
export const studentCrypto = {
  encryptForDbFromPlain(plainObj: unknown) {
    const json = JSON.stringify(plainObj);
    return encryptWithKey(json, env.aesKey2);
  },

  decryptFromDbToPlain(payload: AesEncryptedPayload) {
    const json = decryptWithKey(payload, env.aesKey2);
    return JSON.parse(json) as unknown;
  },

  decryptLevel1FromClient(payload: AesEncryptedPayload) {
    const json = decryptWithKey(payload, env.aesKey1);
    return JSON.parse(json) as unknown;
  },

  encryptLevel1ForClientFromPlain(plainObj: unknown) {
    const json = JSON.stringify(plainObj);
    return encryptWithKey(json, env.aesKey1);
  },
};

