// frontend/app/register/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();
    const res = await fetch('https://bib-honeypot-api.onrender.com/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    setMsg(data.message);
    if(data.success) setTimeout(() => router.push('/login'), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center font-sans relative overflow-hidden">
      
      {/* Background Decorative Islamic touch */}
      <div className="absolute top-0 left-0 w-full h-64 bg-[#014F3D] rounded-b-[40px] shadow-lg"></div>

      <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md z-10">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="h-16 w-16 bg-[#014F3D] rounded-full flex items-center justify-center border-4 border-amber-500 shadow-md">
              <ShieldCheck size={32} className="text-amber-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#014F3D]">Bhuiyan Islami Bank</h1>
          <p className="text-amber-600 text-sm font-medium tracking-wide mt-1">কর্মকর্তা নিবন্ধন (Registration)</p>
        </div>
        
        {msg && <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 rounded mb-4 text-sm font-medium text-center">{msg}</div>}
        
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">ইউজার আইডি (User ID)</label>
            <input type="text" placeholder="e.g. manager_01" required onChange={(e) => setUsername(e.target.value)} 
              className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg text-gray-800 focus:border-[#014F3D] focus:ring-1 focus:ring-[#014F3D] outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">পাসওয়ার্ড (Password)</label>
            <input type="password" placeholder="••••••••" required onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg text-gray-800 focus:border-[#014F3D] focus:ring-1 focus:ring-[#014F3D] outline-none transition-colors" />
          </div>
          <button type="submit" className="bg-[#014F3D] hover:bg-[#013b2d] text-white font-bold py-3.5 rounded-lg mt-2 shadow-lg border-b-4 border-[#013025] transition-colors">
            অ্যাকাউন্ট তৈরি করুন
          </button>
        </form>
        
        <p className="text-gray-500 mt-6 text-center text-sm border-t border-gray-100 pt-4">
          আগে থেকে অ্যাকাউন্ট আছে? <Link href="/login" className="text-amber-600 font-bold hover:underline">লগইন করুন</Link>
        </p>
      </div>
    </div>
  );
}