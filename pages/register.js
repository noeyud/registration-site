// Project: Registration Website (Next.js + Tailwind CSS)
// ================================================
// Enhanced UI with gradient background, Google Fonts, and polished form design

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
    businessRegNo: '',
    purchaseSource: ''
  });
  const [otp, setOtp] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sn) setForm(f => ({ ...f, sn }));
  }, [sn]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setOtp(null);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) setOtp(data.otp);
      else setError(data.error || 'Registration failed');
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Customer Registration</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-poppins">
        <div className="w-full max-w-xl bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl p-10">
          {/* Optional: Place your logo in public/logo.png */}
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="h-12" />
          </div>
          <h1 className="text-4xl font-semibold text-gray-800 text-center mb-8">
            Device Registration
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: 'Serial Number', name: 'sn', type: 'text', placeholder: 'Auto-filled' },
              { label: 'Store Name', name: 'storeName', type: 'text', placeholder: 'My Store' },
              { label: 'Store Location', name: 'storeLocation', type: 'text', placeholder: 'City, Address' },
              { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '010-1234-5678' },
              { label: 'Install Date', name: 'installDate', type: 'date' },
              { label: 'Business Registration No.', name: 'businessRegNo', type: 'text', placeholder: '123-45-67890' },
              { label: 'Purchase Source (Dealer)', name: 'purchaseSource', type: 'text', placeholder: 'Dealer Name' }
            ].map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder || ''}
                  readOnly={field.name === 'sn'}
                  required={field.name !== 'sn'}
                  className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}                  
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              Register Now
            </button>
          </form>

          {otp && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
              <p className="font-medium">🎉 Your OTP Code:</p>
              <p className="text-center text-3xl font-bold mt-2">{otp}</p>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
