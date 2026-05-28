import CryptoJS from "crypto-js";
import type { AesEncryptedPayload } from "../types/crypto";

function requiredEnv(name: string): string {
  const v = import.meta.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v as string;
}

const AES_KEY_1 = requiredEnv("VITE_AES_KEY_1");

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

export const studentCrypto = {
  encryptLevel1(obj: unknown) {
    return encryptWithKey(JSON.stringify(obj), AES_KEY_1);
  },
  decryptLevel1<T>(payload: AesEncryptedPayload): T {
    const json = decryptWithKey(payload, AES_KEY_1);
    return JSON.parse(json) as T;
  },
};

