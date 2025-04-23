// Project: Registration Website (Next.js + Tailwind CSS)
// ================================================
// Improved UI for Device Registration page

// pages/register.js
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
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Device Registration</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <input
              name="sn"
              value={form.sn}
              readOnly
              placeholder="Auto-filled from QR"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              placeholder="e.g. My Store"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Location</label>
            <input
              name="storeLocation"
              value={form.storeLocation}
              onChange={handleChange}
              placeholder="City, Address"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Install Date</label>
            <input
              name="installDate"
              type="date"
              value={form.installDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Registration No.</label>
            <input
              name="businessRegNo"
              value={form.businessRegNo}
              onChange={handleChange}
              placeholder="123-45-67890"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Source (Dealer)</label>
            <input
              name="purchaseSource"
              value={form.purchaseSource}
              onChange={handleChange}
              placeholder="Dealer Name"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </form>

        {otp && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
            <p className="font-medium">Your OTP Code:</p>
            <p className="text-2xl font-bold mt-2">{otp}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
