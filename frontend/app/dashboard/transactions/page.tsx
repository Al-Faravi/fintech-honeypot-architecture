// frontend/app/dashboard/transactions/page.tsx
"use client";
import { ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react';

export default function Transactions() {
  const investments = [
    { id: "INV-001", type: "Bai-Murabaha (বাই-মুরাবাহা)", client: "Rahman Agro Ltd.", amount: "৳ ১৫,০০,০০০", status: "Approved", date: "01 Oct 2026" },
    { id: "INV-002", type: "Mudaraba (মুদারাবা)", client: "Fatema Textiles", amount: "৳ ৫০,০০,০০০", status: "Processing", date: "30 Sep 2026" },
    { id: "INV-003", type: "Musharaka (মুশারাকা)", client: "Halal Foods Corp.", amount: "৳ ১,২০,০০,০০০", status: "Approved", date: "28 Sep 2026" },
    { id: "INV-004", type: "Ijara (ইজারা)", client: "Green Transport", amount: "৳ ২৫,০০,০০০", status: "Completed", date: "25 Sep 2026" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#014F3D] text-white rounded-lg shadow-md"><Briefcase size={24} /></div>
        <div>
          <h1 className="text-2xl font-bold text-[#014F3D]">Halal Investments (হালাল বিনিয়োগ)</h1>
          <p className="text-sm text-gray-500">শরীয়াহ কমপ্লায়েন্ট বিনিয়োগের তালিকা</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f0f9f6] border-b border-[#c6e6db]">
              <th className="p-4 text-xs font-bold text-[#014F3D] uppercase">Reference ID</th>
              <th className="p-4 text-xs font-bold text-[#014F3D] uppercase">Investment Type</th>
              <th className="p-4 text-xs font-bold text-[#014F3D] uppercase">Client Name</th>
              <th className="p-4 text-xs font-bold text-[#014F3D] uppercase text-right">Amount</th>
              <th className="p-4 text-xs font-bold text-[#014F3D] uppercase text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {investments.map((inv, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-bold text-gray-600">{inv.id}</td>
                <td className="p-4 text-sm font-medium text-[#014F3D] flex items-center gap-2">
                  <ArrowUpRight size={16} className="text-amber-500" /> {inv.type}
                </td>
                <td className="p-4 text-sm text-gray-600">{inv.client}</td>
                <td className="p-4 text-sm font-mono text-gray-800 text-right font-bold">{inv.amount}</td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${inv.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' : inv.status === 'Processing' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-blue-100 text-blue-800 border-blue-200'} border`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}