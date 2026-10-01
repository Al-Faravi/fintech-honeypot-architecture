// frontend/app/dashboard/portfolio/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Download } from 'lucide-react';

export default function PortfolioPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [isHoneypot, setIsHoneypot] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("bankToken");
    if (!token) return router.push('/login');

    fetch('http://localhost:5000/api/v1/customers', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setCustomers(data.data);
        setIsHoneypot(data.isHoneypot);
      } else {
        localStorage.removeItem("bankToken");
        router.push('/login');
      }
      setIsLoading(false);
    });
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Honeypot Alert Banner */}
      {isHoneypot && (
        <div className="bg-red-600 text-white p-3 rounded-xl mb-6 text-sm font-bold animate-pulse text-center shadow-lg border-2 border-red-400">
          ⚠️ সতর্কবার্তা: আপনি হানিপট (ফেক ডেটাবেস) এ অবস্থান করছেন! এটি একটি হ্যাকার ট্র্যাপ।
        </div>
      )}

      {/* Table Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96 shadow-sm">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="গ্রাহক খুঁজুন (Search Mudaraba Clients)..." 
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#014F3D] bg-white text-sm"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
            <Filter size={16} /> ফিল্টার
          </button>
          <button className="flex items-center gap-2 bg-[#014F3D] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#013b2d] transition shadow-md">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f0f9f6] border-b border-[#c6e6db]">
                <th className="p-4 text-xs font-bold text-[#014F3D] uppercase tracking-wider">হিসাব নং (Client ID)</th>
                <th className="p-4 text-xs font-bold text-[#014F3D] uppercase tracking-wider">বয়স (Age)</th>
                <th className="p-4 text-xs font-bold text-[#014F3D] uppercase tracking-wider">পেশা (Occupation)</th>
                <th className="p-4 text-xs font-bold text-[#014F3D] uppercase tracking-wider text-right">মজুদ (Balance)</th>
                <th className="p-4 text-xs font-bold text-[#014F3D] uppercase tracking-wider text-center">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">নিরাপদ ডেটা লোড হচ্ছে (Loading secure data)...</td></tr>
              ) : (
                customers.map((c: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-bold text-[#014F3D]">#BIB-{1000 + i}</td>
                    <td className="p-4 text-sm text-gray-600">{c.age} বছর</td>
                    <td className="p-4 text-sm text-gray-600 capitalize">{c.job}</td>
                    <td className="p-4 text-sm font-mono text-gray-800 text-right font-bold">
                      ৳ {(c.balance * 120).toLocaleString()} {/* ইউরো থেকে আনুমানিক টাকায় কনভার্ট করা হলো */}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                        হালাল (Active)
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center bg-gray-50">
          <p className="font-medium">মোট {isHoneypot ? "৪,৫২১" : "৪৫,২১১"} জন গ্রাহক থেকে দেখানো হচ্ছে</p>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 border border-gray-200 rounded-md text-gray-400 cursor-not-allowed bg-white">পূর্ববর্তী</button>
            <button className="px-4 py-1.5 border border-gray-200 rounded-md text-[#014F3D] hover:bg-[#f0f9f6] font-medium bg-white">পরবর্তী</button>
          </div>
        </div>
      </div>
    </div>
  );
}