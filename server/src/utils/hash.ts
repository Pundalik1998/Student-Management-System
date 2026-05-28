import CryptoJS from "crypto-js";

export function sha256Hex(input: string) {
  return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
}

