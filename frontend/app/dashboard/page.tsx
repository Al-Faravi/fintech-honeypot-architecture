// frontend/app/dashboard/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { DollarSign, Users, Briefcase, Activity, CheckCircle, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function DashboardOverview() {
  const [alerts, setAlerts] = useState<any[]>([]);

  // Polling for live alerts
  useEffect(() => {
    const fetchAlerts = () => {
      fetch('http://localhost:5000/api/v1/alerts')
        .then(res => res.json())
        .then(data => {
          if(data.success) setAlerts(data.data);
        })
        .catch(err => console.log("Error fetching alerts", err));
    };
    
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000); // 3 সেকেন্ড পর পর রিফ্রেশ
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { title: "প্রাথমিক মূলধন (Founder's Fund)", value: "৳ ১,০০০ কোটি", icon: <DollarSign size={28} className="text-[#014F3D]" />, trend: "Halal Source" },
    { title: "মুদারাবা গ্রাহক (Mudaraba Clients)", value: "৪৫,২১১ জন", icon: <Users size={28} className="text-amber-600" />, trend: "+১২৪ নতুন" },
    { title: "সক্রিয় বিনিয়োগ (Active Investment)", value: "৳ ৩৫০ কোটি", icon: <Briefcase size={28} className="text-blue-600" />, trend: "Bai-Murabaha" },
    { title: "নিরাপত্তা স্থিতি (Security Status)", value: "নিরাপদ", icon: <ShieldCheck size={28} className="text-green-600" />, trend: "০ অনুপ্রবেশ" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#014F3D] to-[#026b53] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden border border-[#026b53]">
        <div className="relative z-10 flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 w-fit px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30 mb-2">
            <CheckCircle size={14} /> Shariah Compliant
          </div>
          <h2 className="text-3xl font-extrabold mb-1">আসসালামু আলাইকুম, চেয়ারম্যান মহোদয়!</h2>
          <p className="text-[#c6e6db] text-sm max-w-2xl leading-relaxed">
            ভূঁইয়া ইসলামী ব্যাংক পিএলসি-এর সেন্ট্রাল ড্যাশবোর্ডে আপনাকে স্বাগতম। আপনার দাদার রেখে যাওয়া ১০০০ কোটি টাকার হালাল ফান্ডের উপর ভিত্তি করে আমাদের সকল মুদারাবা এবং মুশারাকা কার্যক্রম শরীয়াহ বোর্ড দ্বারা কঠোরভাবে পরিচালিত হচ্ছে।
          </p>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gray-50 rounded-bl-full -z-10 group-hover:bg-[#f0f9f6] transition-colors"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-gray-50 rounded-xl group-hover:bg-white shadow-sm border border-gray-100 transition-colors">
                {stat.icon}
              </div>
              <span className="text-[11px] font-bold text-[#014F3D] bg-[#f0f9f6] px-3 py-1.5 rounded-full border border-[#c6e6db]">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-semibold">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions & Live Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center">
           <Activity size={56} className="text-gray-200 mb-4" />
           <p className="text-gray-400 font-bold text-lg">বিনিয়োগ প্রবৃদ্ধির চার্ট (System Updating...)</p>
           <p className="text-sm text-gray-400 mt-2">Data syncing with Central Shariah Board Server</p>
        </div>
        
        {/* 🔴 LIVE ALERTS SECTION */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-80">
          <h3 className="font-bold text-[#014F3D] mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
            <ShieldAlert size={20} className="text-amber-500 animate-pulse" /> লাইভ সিকিউরিটি অ্যালার্ট
          </h3>
          <ul className="space-y-4 overflow-y-auto pr-2 flex-1">
            {alerts.map((alert) => (
              <li key={alert.id} className="flex items-start gap-4 text-sm border-b border-gray-50 pb-3">
                <div className={`h-3 w-3 mt-1 rounded-full shadow-sm ${alert.type === 'danger' ? 'bg-red-500 shadow-red-200 animate-pulse' : 'bg-green-500 shadow-green-200'}`}></div>
                <div>
                  <p className={`${alert.type === 'danger' ? 'text-red-600' : 'text-gray-800'} font-semibold`}>
                    {alert.title}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{alert.detail}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">Time: {alert.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}