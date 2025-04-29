// pages/register.js
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const { sn } = router.query;
  const [form, setForm] = useState({
    name: '',
    phone: '',
    sn: sn || '',
    storeName: '',
    storeLocation: '',
    installDate: '',
    purchaseSource: ''
  });
  const [otp, setOtp] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (sn) setForm(prev => ({ ...prev, sn }));
  }, [sn]);

  const handleChange = e => {
    const { name, value: rawValue } = e.target;
    const value = (name === 'sn' || name === 'phone')
      ? rawValue.replace(/\D/g, '')
      : rawValue;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const resPw = await fetch('/api/derive-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sn: form.sn })
      });
      const { password, error: pwError } = await resPw.json();
      if (!resPw.ok) throw new Error(pwError || 'OTP 생성에 실패했습니다.');
      setOtp(password);
      await fetch('/api/forward-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          sn: form.sn,
          storeName: form.storeName,
          storeLocation: form.storeLocation,
          installDate: form.installDate,
          purchaseSource: form.purchaseSource
        })
      });
    } catch (err) {
      console.error(err);
      setError(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>고객등록</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="bg-white min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <img src="/logo.png" alt="Logo" className="h-10" />
          <h1 className="ml-3 text-2xl font-bold">고객등록</h1>
        </div>

        {!otp ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 items-center">
              <label className="block text-lg md:text-base">이름</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="이름 입력"
                className="w-full h-12 border border-gray-600 rounded px-3 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 items-center">
              <label className="block text-lg md:text-base">연락처</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="01012345678"
                className="w-full h-12 border border-gray-600 rounded px-3 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 items-center">
              <label className="block text-lg md:text-base">시리얼넘버</label>
              <input
                name="sn"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={form.sn}
                onChange={handleChange}
                placeholder="숫자만 입력"
                className="w-full h-12 border border-gray-600 rounded px-3 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 items-center">
              <label className="block text-lg md:text-base">매장명</label>
              <input
                name="storeName"
                type="text"
                value={form.storeName}
                onChange={handleChange}
                placeholder="매장명 입력"
                className="w-full h-12 border border-gray-600 rounded px-3 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 items-center">
              <label className="block text-lg md:text-base">매장주소</label>
              <input
                name="storeLocation"
                type="text"
                value={form.storeLocation}
                onChange={handleChange}
                placeholder="매장주소 입력"
                className="w-full h-12 border border-gray-600 rounded px-3 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 items-center">
              <label className="block text-lg md:text-base">설치일자</label>
              <input
                name="installDate"
                type="date"
                value={form.installDate}
                onChange={handleChange}
                className="w-full h-12 border border-gray-600 rounded px-3 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 items-center">
              <label className="block text-lg md:text-base">구매처(대리점)</label>
              <input
                name="purchaseSource"
                type="text"
                value={form.purchaseSource}
                onChange={handleChange}
                placeholder="대리점 입력"
                className="w-full h-12 border border-gray-600 rounded px-3 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 bg-orange-600 text-white text-lg font-semibold rounded"
            >
              정보확인
            </button>
          </form>
        ) : (
          <div className="mt-8 text-center">
            <p className="text-xl font-medium text-green-800">🎉 등록 완료! OTP:</p>
            <p className="mt-4 text-3xl font-bold text-gray-900">{otp}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}
      </div>
    </>
  );
}
