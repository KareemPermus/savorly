import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiBook, FiCalendar, FiMenu, FiX } from 'react-icons/fi';

const navItems = [
  { label: 'Home', href: '/', icon: FiHome },
  { label: 'Recipes', href: '/recipes', icon: FiBook },
  { label: 'Meal Planner', href: '/meal-planner', icon: FiCalendar },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return router.pathname === '/' || router.pathname === '/home';
    return router.pathname.startsWith(href);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-cream">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-60 bg-white border-r border-stone-200 flex flex-col transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-5 flex items-center gap-2 border-b border-stone-100">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">S</div>
          <span className="text-xl font-serif font-bold">Savorly</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${active ? 'bg-orange-50 text-orange-700' : 'text-stone-600 hover:bg-stone-50'}`}
                onClick={() => setSidebarOpen(false)}>
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-stone-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">U</div>
          <div className="text-sm leading-tight">
            <p className="font-medium">Home Cook</p>
            <p className="text-stone-400 text-xs">Savorly User</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto h-screen">
        {/* Topbar */}
        <div className="sticky top-0 z-10 bg-cream/90 backdrop-blur px-4 md:px-8 py-4 flex items-center justify-between border-b border-stone-200">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-stone-600" onClick={() => setSidebarOpen(true)}>
              <FiMenu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-serif">Savorly</h1>
              <p className="text-sm text-stone-500 hidden sm:block">What are we cooking today?</p>
            </div>
          </div>
        </div>
        <div className="px-4 md:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}