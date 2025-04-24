// pages/api/derive-password.js

import { derivePassword } from '../../lib/password';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  const { sn } = req.body;
  if (!sn) {
    return res.status(400).json({ error: '시리얼 넘버가 필요합니다.' });
  }
  try {
    const password = derivePassword(sn);
    return res.status(200).json({ password });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '비밀번호 생성 중 오류가 발생했습니다.' });
  }
}