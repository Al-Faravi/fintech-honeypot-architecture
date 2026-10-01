// frontend/app/dashboard/layout.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, ArrowRightLeft, ShieldCheck, LogOut, Bell } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [alertsCount, setAlertsCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("bankToken");
    if (!token) router.push('/login');

    // Polling for live notification count
    const fetchAlerts = () => {
      fetch('http://localhost:5000/api/v1/alerts')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Count only 'danger' alerts for the notification bell
            const dangers = data.data.filter((a: any) => a.type === 'danger');
            setAlertsCount(dangers.length);
          }
        })
        .catch(err => console.log("Alert fetch error", err));
    };
    
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("bankToken");
    router.push('/login');
  };

  if (!isClient) return null;

  const menuItems = [
    { name: "Overview (ওভারভিউ)", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Mudaraba Clients", icon: <Users size={20} />, path: "/dashboard/portfolio" },
    { name: "Halal Investments", icon: <ArrowRightLeft size={20} />, path: "/dashboard/transactions" },
    { name: "Shariah Audit", icon: <ShieldCheck size={20} />, path: "/dashboard/risk" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      {/* ================= SIDEBAR (Forest Green) ================= */}
      <aside className="w-72 bg-[#014F3D] text-gray-300 flex flex-col shadow-2xl z-20 hidden md:flex border-r border-[#013b2d]">
        <div className="h-20 flex items-center px-6 border-b border-[#026b53] bg-[#014333]">
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold text-white tracking-wide">
              Bhuiyan <span className="text-amber-400">Islami Bank</span>
            </h1>
            <span className="text-[10px] text-amber-200 uppercase tracking-widest mt-1">Shariah Based Banking</span>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.path} 
              className={`flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all font-medium ${pathname === item.path ? 'bg-[#026b53] text-white border-l-4 border-amber-400 shadow-md' : 'hover:bg-[#026b53]/50 hover:text-white'}`}>
              <span className={`${pathname === item.path ? 'text-amber-400' : 'text-gray-400'}`}>{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
          {/* HONEYPOT URL FOR SCRAPERS */}
          <a href="http://localhost:5000/admin/secret-db-export" style={{ display: 'none' }}>Legacy Admin Portal</a>
        </nav>

        <div className="p-4 border-t border-[#026b53] bg-[#014333]">
          <button onClick={handleLogout} className="flex items-center justify-center gap-3 text-gray-300 hover:text-white hover:bg-red-600/90 bg-[#014F3D] border border-[#026b53] transition-all w-full px-4 py-3 rounded-lg shadow-sm font-bold text-sm">
            <LogOut size={18} />
            নিরাপদ প্রস্থান (Logout)
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-2xl font-bold text-[#014F3D]">
            {menuItems.find(m => m.path === pathname)?.name || "Dashboard"}
          </h2>
          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-amber-500 transition">
              <Bell size={24} />
              {/* LIVE NOTIFICATION BADGE */}
              {alertsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center font-bold shadow-sm animate-bounce">
                  {alertsCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6 cursor-pointer">
              <div className="h-10 w-10 bg-amber-500 rounded-full flex items-center justify-center text-[#014F3D] font-bold shadow-md border-2 border-white text-lg">
                F
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-bold text-gray-800 leading-tight">MD. Faravi Bhuiyan</p>
                <p className="text-amber-600 text-xs font-semibold">Chairman & Founder</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#f4f7f6]">
          {children}
        </main>
      </div>
    </div>
  );
}