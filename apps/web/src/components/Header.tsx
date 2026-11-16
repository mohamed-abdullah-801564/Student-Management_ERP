'use client';

import React from 'react';
import {
  Search,
  Bell,
  Download,
  Plus,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  onPublishNotice?: () => void;
}

export default function Header({ onPublishNotice }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* LEFT: TITLE & SESSION CHIP */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Executive Dashboard
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">
              Monday, 14 Sep 2026
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              AY 2026-27 • Term 1
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="w-96 relative hidden md:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search students, staff, admission #, circulars (Ctrl+K)..."
          className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-xs"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() =>
            alert(
              'Generating Greenwood Academy Daily Executive Briefing PDF (Attendance, Substitutions, Leaves, Marks Snapshot)...'
            )
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Daily Briefing</span>
        </button>

        <button
          onClick={onPublishNotice}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs shadow-indigo-300"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Publish Circular</span>
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <button
          aria-label="Notifications"
          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 relative transition-all"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
