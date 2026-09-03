import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiCompass, FiBookOpen, FiCalendar, FiHeart } from 'react-icons/fi';

const navItems = [
  { href: '/', label: 'Discover', icon: FiCompass },
  { href: '/recipes', label: 'My Recipes', icon: FiBookOpen },
  { href: '/meal-planner', label: 'Meal Planner', icon: FiCalendar },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return router.pathname === '/' || router.pathname === '/home';
    return router.pathname.startsWith(href);
  };

  return (
    <div className="h-screen overflow-hidden bg-stone-50 text-stone-800 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static z-50 lg:z-auto
        w-60 h-screen flex flex-col bg-white border-r border-stone-200
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-6 py-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <span className="font-serif text-xl font-semibold">Savorly</span>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-2 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'hover:bg-stone-100 text-stone-600'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 pb-1 px-3 text-xs uppercase tracking-wide text-stone-400">
            Collections
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-stone-500">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            Weeknight Dinners
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-stone-500">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            Baking Projects
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-stone-500">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Cozy Soups
          </div>
        </nav>

        <div className="p-3 border-t border-stone-200">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
              N
            </div>
            <div className="text-sm leading-tight">
              <div className="font-medium">Home Cook</div>
              <div className="text-stone-400 text-xs">Savorly user</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto h-screen flex flex-col">
        {/* Mobile topbar hamburger */}
        <div className="sticky top-0 z-10 bg-stone-50/90 backdrop-blur px-4 lg:px-8 py-3 flex items-center gap-4 border-b border-stone-200">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-stone-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-serif text-lg font-semibold lg:hidden">Savorly</span>
        </div>

        <div className="flex-1">
          {children}
        </div>

        <footer className="py-4 text-center text-xs text-stone-400">
          Made with <FiHeart className="w-3 h-3 inline text-rose-400" /> by the Savorly team · © 2024
        </footer>
      </main>
    </div>
  );
}