const NONCE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function getNonce(): string {
  let nonce = "";
  for (let i = 0; i < 32; i++) {
    nonce += NONCE_CHARS.charAt(
      Math.floor(Math.random() * NONCE_CHARS.length)
    );
  }
  return nonce;
}
