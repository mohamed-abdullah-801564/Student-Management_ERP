'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
  Bell,
  Plus,
  Send,
  CheckCircle2,
  Calendar,
  Users,
  Paperclip,
  Eye,
  Sparkles,
} from 'lucide-react';

interface CircularNotice {
  id: string;
  circularNo: string;
  title: string;
  date: string;
  category: 'Academic' | 'Holiday' | 'Sports' | 'Administrative';
  audience: string;
  readCount: number;
  totalRecipients: number;
  signedBy: string;
  attachmentName?: string;
}

export default function CircularsPage() {
  const circulars: CircularNotice[] = [
    {
      id: 'c_1',
      circularNo: 'GW/2026/042',
      title: 'Term 1 Periodic Assessment & Marksheet Verification Schedule',
      date: '14 Sep 2026',
      category: 'Academic',
      audience: 'All Parents & Teachers (Grades 1 to 12)',
      readCount: 1380,
      totalRecipients: 1420,
      signedBy: 'Dr. M. Jayakumar (Principal)',
      attachmentName: 'assessment_timetable_term1.pdf',
    },
    {
      id: 'c_2',
      circularNo: 'GW/2026/041',
      title: 'Parent-Teacher Meeting (PTM) Timing Slots & Masked Chat Protocol',
      date: '10 Sep 2026',
      category: 'Administrative',
      audience: 'Middle School (Grades 6 to 8)',
      readCount: 395,
      totalRecipients: 410,
      signedBy: 'Dr. M. Jayakumar (Principal)',
    },
    {
      id: 'c_3',
      circularNo: 'GW/2026/040',
      title: 'Inter-School Athletics Championship Selection Trials',
      date: '05 Sep 2026',
      category: 'Sports',
      audience: 'High School (Grades 9 to 12)',
      readCount: 520,
      totalRecipients: 540,
      signedBy: 'Mr. Rajesh K. (Physical Director)',
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Circulars & Official Notices
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Official school announcements broadcasted to Parent App & Staff
              </p>
            </div>
          </div>

          {/* CIRCULARS LIST */}
          <div className="space-y-4">
            {circulars.map((circ) => {
              const readPercent = Math.round(
                (circ.readCount / circ.totalRecipients) * 100
              );

              return (
                <div
                  key={circ.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                        {circ.circularNo}
                      </span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {circ.category}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {circ.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {circ.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Audience: <strong className="text-slate-700 font-semibold">{circ.audience}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {readPercent}% Read Rate ({circ.readCount} of {circ.totalRecipients})
                    </span>
                  </div>

                  {circ.attachmentName && (
                    <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-xs text-indigo-700 font-semibold">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{circ.attachmentName}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Authorized by: <strong className="text-slate-700">{circ.signedBy}</strong></span>
                    <button
                      onClick={() => alert(`Opening circular details for ${circ.circularNo}`)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      View Notice Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
