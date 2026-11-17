'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Loader2,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [navigatingHref, setNavigatingHref] = useState<string | null>(null);

  useEffect(() => {
    setNavigatingHref(null);
  }, [pathname]);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Staff & Faculty',
      href: '/staff',
      icon: Users,
      badge: '64 Active',
    },
    {
      name: 'Students & Admissions',
      href: '/students',
      icon: GraduationCap,
      badge: '1,420',
    },
    {
      name: 'Attendance & Rolls',
      href: '/attendance',
      icon: CalendarCheck,
      badge: '96.2%',
    },
    {
      name: 'Academic Marks',
      href: '/marks',
      icon: Award,
      badge: 'Term 1',
    },
    {
      name: 'Circulars & Notices',
      href: '/circulars',
      icon: Bell,
      badge: '2 New',
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      {/* BRAND CREST & SCHOOL HEADER */}
      <div>
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-200 text-white font-bold">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Greenwood Academy
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                CBSE #1930412
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="p-3 space-y-1">
          <p className="px-3 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Executive Controls
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isCurrent = pathname === item.href;
            const isNavigatingToThis = navigatingHref === item.href;
            const isActive = isCurrent || isNavigatingToThis;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (pathname !== item.href) {
                    setNavigatingHref(item.href);
                  }
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isNavigatingToThis && !isCurrent ? (
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                  ) : (
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                  )}
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* PRINCIPAL PROFILE & LOGOUT WIDGET */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs mb-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
            DJ
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 truncate">
              Dr. M. Jayakumar
            </h4>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              Principal & Director
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <button className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 hover:text-rose-700 py-1 px-2 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
