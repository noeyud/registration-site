// pages/api/forward-register.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const {
    storeName,
    phone,
    storeLocation,
    installDate,
    purchaseSource,
    sn
  } = req.body;

  // CS 사이트가 기대하는 폼 필드 이름으로 URLSearchParams 생성
  const params = new URLSearchParams({
    pm_check:   'K',
    req_gubn:   'P',
    req_name:   storeName,
    req_tel:    phone,
    req_zip:    '',                  // 우편번호 생략
    req_addr1:  storeLocation,
    req_addr2:  '',                  // 상세주소 생략
    req_prodkind: '',
    req_model:  '',
    req_memo:   `시리얼번호:${sn} 설치일자:${installDate} 구매처(대리점):${purchaseSource} 하이브리드 7인치 도우컨 고객등록`
  });

  try {
    const response = await fetch(
      'https://cs.softmill.co.kr/CustProduct.jsp?psrc=k',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      }
    );
    if (!response.ok) throw new Error(`Status ${response.status}`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Forward register error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
