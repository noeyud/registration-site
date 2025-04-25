// pages/api/register.js
import { derivePassword } from '../../lib/password';


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    sn,
    storeName,
    storeLocation,
    phone,
    installDate,
    businessRegNo,
    purchaseSource
  } = req.body;

  // TODO: 실제로는 DB에 저장하는 로직을 여기에 추가하세요.

 // derivePassword()로 고정된 6자리 비밀번호 생성
  const otp = derivePassword(sn);

  return res.status(200).json({ otp });
}
