// lib/password.js
import crypto from 'crypto';

// .env.local 에서 읽어온 Base64 인코딩된 32바이트 키
// (반드시 "==" 패딩까지 포함해주세요!)
const SECRET = Buffer.from(process.env.PASSWORD_SECRET, 'base64');

/**
 * serialNumber로부터 고정된 6자리 비밀번호를 생성합니다.
 * HMAC-SHA256(dynamic truncation) → 6자리 숫자
 */
export function derivePassword(serialNumber) {
  // 1) HMAC-SHA256(secret, serialNumber)
  const hmac = crypto
    .createHmac('sha256', SECRET)
    .update(serialNumber)
    .digest(); // Buffer(32)

  // 2) RFC4226 dynamic truncation
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code32 =
    (hmac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;

  // 3) 6자리 0 패딩
  return String(code32).padStart(6, '0');
}