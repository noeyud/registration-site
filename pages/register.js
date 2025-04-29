// pages/register.js
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Register() {
  const router = useRouter()
  const { sn } = router.query
  const [form, setForm] = useState({
    name: '', phone: '', sn: sn||'', storeName:'', address:'', installDate:'', dealer:''
  })
  const [otp, setOtp]     = useState(null)
  const [error, setError] = useState(null)
  const [submitting, setSub] = useState(false)

  useEffect(() => {
    if (sn) setForm(f => ({ ...f, sn }))
  }, [sn])

  const handleChange = e => {
    let v = e.target.value
    if (e.target.name==='phone' || e.target.name==='sn') {
      v = v.replace(/\D/g,'')
    }
    setForm(f => ({ ...f, [e.target.name]: v }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (submitting) return
    setSub(true); setError(null)
    try {
      const res = await fetch('/api/derive-password',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ sn: form.sn })
      })
      const { password, error: pwErr } = await res.json()
      if (!res.ok) throw new Error(pwErr||'OTP 생성 실패')
      setOtp(password)
      await fetch('/api/forward-register',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      })
    } catch(err) {
      setError(err.message)
    } finally {
      setSub(false)
    }
  }

  const fields = [
    ['name','이름','text','이름 입력'],
    ['phone','연락처','tel','숫자만 입력'],
    ['sn','시리얼넘버','text','숫자만 입력'],
    ['storeName','매장명','text','매장명 입력'],
    ['address','매장주소','text','매장주소 입력'],
    ['installDate','설치일자','date',''],
    ['dealer','구매처(대리점)','text','구매처 입력']
  ]

  return (
    <>
      <Head>
        <title>고객등록</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>

      {/* ★ 이 div가 뷰포트 전체에 flex 중앙 정렬 ★ */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {/* 카드 컨테이너 */}
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 mx-4 overflow-auto max-h-screen">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="h-10"/>
          </div>
          <h1 className="text-2xl font-semibold mb-8 text-center">고객등록</h1>

          {!otp ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map(([name,label,type,placeholder])=>(
                <div key={name} className="flex flex-col md:flex-row md:items-center">
                  <label
                    htmlFor={name}
                    className="md:w-1/4 w-full mb-1 md:mb-0 font-medium text-gray-700"
                  >
                    {label}
                  </label>
                  <div className="md:w-3/4 w-full">
                    <input
                      id={name}
                      name={name}
                      type={type}
                      placeholder={placeholder}
                      value={form[name]}
                      onChange={handleChange}
                      className="w-full h-12 px-3 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
              ))}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-14 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition"
              >
                정보 확인
              </button>
              {error && <p className="text-red-600 text-center mt-2">{error}</p>}
            </form>
          ) : (
            <div className="text-center">
              <p className="text-green-600 font-medium mb-2">🎉 등록이 완료되었습니다.</p>
              <p className="text-3xl font-bold">{otp}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
