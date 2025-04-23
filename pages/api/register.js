import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { sn, storeName, storeLocation, phone, installDate, businessRegNo, purchaseSource } = req.body;

  // TODO: 실제로는 DB에 저장하는 로직을 여기에 추가하세요.

  // HMAC-SHA256으로 6자리 OTP 생성
  const secret = process.env.OTP_SECRET;
  const hmac = crypto.createHmac('sha256', secret).update(sn).digest('hex');
  const num = parseInt(hmac, 16) % 1000000;
  const otp = num.toString().padStart(6, '0');

  res.status(200).json({ otp });
}
