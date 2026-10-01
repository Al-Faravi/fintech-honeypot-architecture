// frontend/app/login/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Info } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaInput, setCaptchaInput] = useState("");
  const [botTrap, setBotTrap] = useState(""); 
  const [error, setError] = useState("");

  useEffect(() => { generateCaptcha(); }, []);

  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaInput("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (parseInt(captchaInput) !== (num1 + num2)) {
      setError("ক্যাপচা সঠিক নয়! পুনরায় চেষ্টা করুন।");
      generateCaptcha();
      return;
    }

    try {
      const res = await fetch('https://bib-honeypot-api.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, bot_trap_field: botTrap })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem("bankToken", data.token); 
        router.push('/dashboard');
      } else {
        setError(data.message);
        generateCaptcha();
      }
    } catch (err) {
      setError("সার্ভার কানেকশন ফেইলড! (Ensure backend is running on port 5000)");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex flex-col items-center justify-center font-sans relative overflow-hidden py-10">
      <div className="absolute top-0 left-0 w-full h-72 bg-[#014F3D] rounded-b-[40px] shadow-lg"></div>

      {/* Main Login Card */}
      <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md z-10 mb-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="h-16 w-16 bg-[#014F3D] rounded-full flex items-center justify-center border-4 border-amber-500 shadow-md">
              <ShieldCheck size={32} className="text-amber-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#014F3D]">Bhuiyan Islami Bank</h1>
          <p className="text-amber-600 text-sm font-medium tracking-wide mt-1">Shariah Based Modern Banking</p>
        </div>
        
        {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-5 text-sm font-medium">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">ইউজার আইডি (User ID)</label>
            <input type="text" required onChange={(e) => setUsername(e.target.value)} 
              className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg text-gray-800 focus:border-[#014F3D] outline-none transition-colors" placeholder="e.g. admin" />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">পাসওয়ার্ড (Password)</label>
            <input type="password" required onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg text-gray-800 focus:border-[#014F3D] outline-none transition-colors" placeholder="••••••••" />
          </div>
          
          {/* 🚨 HONEYPOT TRAP */}
          <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
            <label htmlFor="bot-trap-phone">Phone Number</label>
            <input id="bot-trap-phone" type="text" name="phone" tabIndex={-1} autoComplete="off" onChange={(e) => setBotTrap(e.target.value)} />
          </div>

          <div className="bg-[#f0f9f6] p-4 rounded-lg border border-[#c6e6db] flex justify-between items-center mt-2">
            <span className="text-[#014F3D] font-bold select-none flex items-center gap-2">
              <span className="bg-[#014F3D] text-white px-2 py-1 rounded">Security</span> {num1} + {num2} =
            </span>
            <input type="number" required value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} 
              className="w-20 bg-white border border-[#c6e6db] p-2 rounded text-center text-gray-800 font-bold focus:border-amber-500 outline-none shadow-inner" />
          </div>

          <button type="submit" className="bg-[#014F3D] hover:bg-[#013b2d] text-white font-bold py-3.5 rounded-lg mt-2 transition-colors shadow-lg border-b-4 border-[#013025]">
            Secure Login
          </button>
        </form>
        
        <p className="text-gray-500 mt-6 text-center text-sm border-t border-gray-100 pt-4">
          নতুন কর্মকর্তা? <Link href="/register" className="text-amber-600 font-bold hover:underline">রেজিস্টার করুন</Link>
        </p>
      </div>

      {/* ================= RECRUITER / PORTFOLIO GUIDE ================= */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-100 w-full max-w-md z-10">
        <h3 className="flex items-center gap-2 text-blue-800 font-bold mb-3 border-b border-blue-100 pb-2">
          <Info size={18} className="text-blue-600" /> Demo Guide
        </h3>
        
        <div className="space-y-3 text-sm text-gray-600">
          <p className="font-semibold text-gray-800">✅ Test 1: Real User Login</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-500">
            <li>Create an account via <Link href="/register" className="text-blue-600 underline">Register</Link> or use your own details.</li>
            <li>Solve the math CAPTCHA and login.</li>
            <li>You will access the <strong className="text-green-600">Real Database</strong>.</li>
          </ul>

          <p className="font-semibold text-gray-800 mt-4">🚨 Test 2: Trigger the Honeypot (Act like a Bot)</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-500">
            <li>Press <kbd className="bg-gray-100 px-1 rounded border">F12</kbd> (Inspect Element).</li>
            <li>Find the hidden <code className="text-red-500 bg-red-50 px-1 rounded">&lt;input name="phone"&gt;</code> field above the CAPTCHA.</li>
            <li>Remove <code className="text-gray-700">opacity: 0</code> to reveal it, and type anything into it.</li>
            <li>Submit the form. You will be served a Fake JWT, directed to the <strong className="text-red-600">Dummy Database</strong>, and your IP will be blacklisted!</li>
          </ul>
        </div>
      </div>
      
      <a href="https://bib-honeypot-api.onrender.com/admin/secret-db-export" style={{ display: 'none' }} aria-hidden="true">Download Admin Backup</a>
    </div>
  );
}