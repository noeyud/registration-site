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
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) setOtp(data.otp);
    else setError(data.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4">Device Registration</h1>
        <label className="block mb-2">Serial Number</label>
        <input name="sn" value={form.sn} readOnly className="w-full border p-2 mb-4 bg-gray-100" />

        <label className="block mb-2">Store Name</label>
        <input name="storeName" onChange={handleChange} className="w-full border p-2 mb-4" required />

        <label className="block mb-2">Store Location</label>
        <input name="storeLocation" onChange={handleChange} className="w-full border p-2 mb-4" required />

        <label className="block mb-2">Phone Number</label>
        <input name="phone" onChange={handleChange} className="w-full border p-2 mb-4" required />

        <label className="block mb-2">Install Date</label>
        <input type="date" name="installDate" onChange={handleChange} className="w-full border p-2 mb-4" required />

        <label className="block mb-2">Business Registration No.</label>
        <input name="businessRegNo" onChange={handleChange} className="w-full border p-2 mb-4" required />

        <label className="block mb-2">Purchase Source (Dealer)</label>
        <input name="purchaseSource" onChange={handleChange} className="w-full border p-2 mb-4" required />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Register</button>

        {otp && <div className="mt-4 p-4 bg-green-100 text-green-800 rounded"><strong>OTP:</strong> {otp}</div>}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </form>
    </div>
);
}
