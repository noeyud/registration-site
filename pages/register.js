// pages/register.js
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const { sn } = router.query;
  const [form, setForm] = useState({
    sn: sn || '',
    storeName: '',
    storeLocation: '',
    phone: '',
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
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    if (submitting) return;
    setSubmitting(true);
    e.preventDefault();
    setError(null);
    setOtp(null);
    try {
      // 1) OTP 생성
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '등록에 실패했습니다.');
      setOtp(data.otp);

      // 2) CS 사이트 자동 제품등록
      await fetch('/api/forward-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sn: form.sn,
          storeName: form.storeName,
          phone: form.phone,
          storeLocation: form.storeLocation,
          installDate: form.installDate,
          purchaseSource: form.purchaseSource
        })
      });
    } catch (err) {
      console.error(err);
      setError(err.message || '네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <Head>
        <title>고객등록</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-poppins">
        <div className="w-full max-w-lg bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            고객등록
          </h1>

          {!otp && (
  <form onSubmit={handleSubmit} className="space-y-4">
    {/* ...기존 폼 필드들... */}
    <button
      type="submit"
      disabled={submitting}
      className={`w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      정보 확인
    </button>
  </form>
)}

          {otp && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
              <p className="font-medium">🎉 등록이 완료되었습니다. OTP:</p>
              <p className="text-center text-2xl font-bold mt-2">{otp}</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
