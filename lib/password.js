// lib/password.js

import crypto from 'crypto';

// .env.local 또는 배포 환경 변수에 설정한 SECRET 키
const SECRET = process.env.PASSWORD_SECRET;

/**
 * serialNumber로부터 고정된 6자리 비밀번호를 생성합니다.
 * @param {string} serialNumber - 사용자 입력 시리얼 넘버
 * @param {number} digits - 생성할 숫자 길이 (기본값 6)
 * @returns {string} 0이 패딩된 digits 길이의 숫자 문자열
 */
export function derivePassword(serialNumber, digits = 6) {
  // 1) HMAC-SHA256(secret, serialNumber) 계산
  const hmac = crypto
    .createHmac('sha256', SECRET)
    .update(serialNumber)
    .digest();

  // 2) OTP 동적 오프셋 기법으로 4바이트를 뽑아냄
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac.readUInt32BE(offset) & 0x7fffffff) % 10 ** digits);

  // 3) digits 자리수로 포맷, 부족하면 앞에 0으로 패딩
  return binary.toString().padStart(digits, '0');
}
