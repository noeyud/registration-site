// lib/password.js
import crypto from 'crypto';

const SECRET = Buffer.from(process.env.PASSWORD_SECRET, 'base64');

export function derivePassword(serialNumber) {
  console.log("\n--- WEB DEBUG ---");
  console.log("serial:", serialNumber);
  console.log("SECRET (hex):", SECRET.toString('hex'));

  const hmac = crypto
    .createHmac('sha256', SECRET)
    .update(serialNumber)
    .digest();
  console.log("HMAC SHA256:", hmac.toString('hex'));

  const offset = hmac[hmac.length - 1] & 0x0f;
  console.log("offset:", offset);

  const slice = hmac.slice(offset, offset + 4);
  console.log("slice (hex):", slice.toString('hex'));

  const code32 = (slice.readUInt32BE(0) & 0x7fffffff) % 1_000_000;
  console.log("code32 (pre-pad):", code32);

  const result = String(code32).padStart(6, '0');
  console.log("final OTP:", result, "\n");

  return result;
}
