import React from 'react';

export default function GlobalLoadingSkeleton() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* SIDEBAR SKELETON PLACEHOLDER */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-5 space-y-6 shrink-0">
        <div className="space-y-6">
          {/* Logo / Crest Shimmer */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 animate-pulse shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-slate-200 rounded-md animate-pulse w-3/4" />
              <div className="h-2.5 bg-slate-100 rounded-md animate-pulse w-1/2" />
            </div>
          </div>

          {/* Navigation Items Shimmer */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-9 rounded-xl bg-slate-100 animate-pulse flex items-center px-3 gap-3"
              >
                <div className="w-4 h-4 rounded-md bg-slate-200" />
                <div className="h-3 bg-slate-200 rounded w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* User Card Shimmer */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-200 animate-pulse shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 bg-slate-200 rounded w-20" />
            <div className="h-2 bg-slate-100 rounded w-16" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT SKELETON */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HEADER SKELETON BAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 w-1/3">
            <div className="h-5 bg-slate-200 rounded-md animate-pulse w-32" />
            <div className="h-4 bg-indigo-50 rounded-md animate-pulse w-24" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-64 h-9 bg-slate-100 rounded-xl animate-pulse hidden sm:block" />
            <div className="w-28 h-9 bg-indigo-100 rounded-xl animate-pulse" />
          </div>
        </header>

        {/* BODY SKELETON WITH PURPLE/INDIGO SHIMMER PULSE */}
        <main className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Breadcrumb / Section Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-7 bg-slate-200 rounded-lg animate-pulse w-48" />
              <div className="h-3.5 bg-slate-100 rounded-md animate-pulse w-72" />
            </div>
            <div className="w-32 h-10 bg-indigo-200/60 rounded-xl animate-pulse" />
          </div>

          {/* 4 KPI CARDS SHIMMER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Students */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="h-3 bg-slate-200 rounded w-28 animate-pulse" />
                <div className="w-7 h-7 rounded-lg bg-emerald-100 animate-pulse" />
              </div>
              <div className="h-8 bg-emerald-50 rounded-lg w-24 animate-pulse" />
              <div className="h-3 bg-slate-100 rounded w-36 animate-pulse" />
            </div>

            {/* Card 2: Faculty */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <div className="h-3 bg-slate-200 rounded w-24 animate-pulse" />
                <div className="w-7 h-7 rounded-lg bg-indigo-100 animate-pulse" />
              </div>
              <div className="h-8 bg-indigo-50 rounded-lg w-20 animate-pulse" />
              <div className="h-3 bg-slate-100 rounded w-32 animate-pulse" />
            </div>

            {/* Card 3: Marks */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <div className="h-3 bg-slate-200 rounded w-28 animate-pulse" />
                <div className="w-7 h-7 rounded-lg bg-amber-100 animate-pulse" />
              </div>
              <div className="h-8 bg-amber-50 rounded-lg w-24 animate-pulse" />
              <div className="h-3 bg-slate-100 rounded w-36 animate-pulse" />
            </div>

            {/* Card 4: Approvals */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <div className="h-3 bg-slate-200 rounded w-24 animate-pulse" />
                <div className="w-7 h-7 rounded-lg bg-rose-100 animate-pulse" />
              </div>
              <div className="h-8 bg-rose-50 rounded-lg w-20 animate-pulse" />
              <div className="h-3 bg-slate-100 rounded w-32 animate-pulse" />
            </div>
          </div>

          {/* LOWER SECTION SHIMMER (Split Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
                <div className="h-7 bg-slate-100 rounded-lg w-36 animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[1, 2, 3, 4].map((c) => (
                  <div key={c} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
                    <div className="h-3 bg-indigo-50 rounded w-24 animate-pulse" />
                    <div className="h-2 bg-slate-200 rounded-full w-full animate-pulse mt-2" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-xs space-y-4">
              <div className="h-4 bg-slate-200 rounded w-36 animate-pulse border-b border-slate-100 pb-4" />
              <div className="space-y-3 pt-2">
                {[1, 2].map((p) => (
                  <div key={p} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2">
                    <div className="h-3.5 bg-slate-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-7 bg-slate-200 rounded-lg w-16 animate-pulse" />
                      <div className="h-7 bg-indigo-200 rounded-lg w-20 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
