// frontend/app/dashboard/risk/page.tsx
"use client";
import { ShieldCheck, Target, AlertOctagon } from 'lucide-react';

export default function RiskAnalytics() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-amber-500 text-white rounded-lg shadow-md"><ShieldCheck size={24} /></div>
        <div>
          <h1 className="text-2xl font-bold text-[#014F3D]">Shariah Audit & Security</h1>
          <p className="text-sm text-gray-500">সেন্ট্রাল শরীয়াহ বোর্ড এবং সাইবার সিকিউরিটি অডিট রিপোর্ট</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm border-t-4 border-t-green-500">
          <ShieldCheck size={32} className="text-green-500 mb-4" />
          <h3 className="font-bold text-gray-800 mb-1">Shariah Compliance Score</h3>
          <p className="text-3xl font-extrabold text-[#014F3D]">৯৯.৮%</p>
          <p className="text-xs text-gray-500 mt-2">Approved by Central Shariah Board</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm border-t-4 border-t-amber-500">
          <Target size={32} className="text-amber-500 mb-4" />
          <h3 className="font-bold text-gray-800 mb-1">Active Honeypots</h3>
          <p className="text-3xl font-extrabold text-[#014F3D]">৩ টি</p>
          <p className="text-xs text-gray-500 mt-2">Database, Login, and API Traps Active</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm border-t-4 border-t-red-500">
          <AlertOctagon size={32} className="text-red-500 mb-4" />
          <h3 className="font-bold text-gray-800 mb-1">Bots Trapped Today</h3>
          <p className="text-3xl font-extrabold text-red-600">১২ টি</p>
          <p className="text-xs text-gray-500 mt-2">All malicious IPs blocked permanently</p>
        </div>
      </div>
      
      <div className="bg-[#f0f9f6] p-6 rounded-2xl border border-[#c6e6db]">
         <h3 className="font-bold text-[#014F3D] mb-2">Auditor's Note (অডিটরের মন্তব্য)</h3>
         <p className="text-sm text-gray-700 leading-relaxed">
           "The implementation of the Deception Architecture (Honeypot) has significantly improved the bank's cyber defense. Zero data breaches recorded in the primary Mudaraba database. All financial transactions are strictly adhering to Islamic Shariah principles without any involvement of Riba (Interest)."
         </p>
      </div>
    </div>
  );
}