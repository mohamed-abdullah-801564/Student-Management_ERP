'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { NumberTicker } from '@/components/ui/number-ticker';
import {
  CalendarCheck,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Search,
  Filter,
  Calendar,
  Clock,
  ChevronRight,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react';

interface ClassAttendanceItem {
  id: string;
  className: string;
  section: string;
  present: number;
  total: number;
  absent: number;
  rate: number;
  classTeacher: string;
  markedTime: string;
  status: 'perfect' | 'good' | 'warning';
}

const CLASS_ATTENDANCE_DATA: ClassAttendanceItem[] = [
  {
    id: '1',
    className: 'Class 10',
    section: 'A',
    present: 38,
    total: 40,
    absent: 2,
    rate: 95.0,
    classTeacher: 'Mr. Venkatesh R.',
    markedTime: '08:35 AM',
    status: 'good',
  },
  {
    id: '2',
    className: 'Class 9',
    section: 'B',
    present: 37,
    total: 37,
    absent: 0,
    rate: 100.0,
    classTeacher: 'Mrs. Preetha V.',
    markedTime: '08:32 AM',
    status: 'perfect',
  },
  {
    id: '3',
    className: 'Class 8',
    section: 'B',
    present: 36,
    total: 38,
    absent: 2,
    rate: 94.7,
    classTeacher: 'Mrs. Deepa R.',
    markedTime: '08:42 AM',
    status: 'good',
  },
  {
    id: '4',
    className: 'Class 8',
    section: 'C',
    present: 36,
    total: 41,
    absent: 5,
    rate: 87.8,
    classTeacher: 'Mr. Karthik Raja',
    markedTime: '08:44 AM',
    status: 'warning',
  },
  {
    id: '5',
    className: 'Class 12',
    section: 'A',
    present: 42,
    total: 43,
    absent: 1,
    rate: 97.6,
    classTeacher: 'Dr. S. Raman',
    markedTime: '08:30 AM',
    status: 'good',
  },
  {
    id: '6',
    className: 'Class 11',
    section: 'A',
    present: 40,
    total: 40,
    absent: 0,
    rate: 100.0,
    classTeacher: 'Mrs. Jayanthi V.',
    markedTime: '08:28 AM',
    status: 'perfect',
  },
];

export default function AttendanceRollsPage() {
  const [activeSession, setActiveSession] = useState<'morning' | 'afternoon'>('morning');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  // Live Supabase Attendance State
  const [realRecords, setRealRecords] = useState<any[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [summary, setSummary] = useState({
    totalStudents: 1420,
    presentToday: 1362,
    absentToday: 58,
    attendanceRate: '95.9',
  });

  const fetchAttendance = async () => {
    try {
      setLoadingAttendance(true);
      const res = await fetch('/api/attendance');
      const data = await res.json();
      if (data.records) {
        setRealRecords(data.records);
      }
      if (data.summary && data.summary.totalStudents > 0) {
        setSummary({
          totalStudents: data.summary.totalStudents,
          presentToday: data.summary.presentToday,
          absentToday: data.summary.absentToday,
          attendanceRate: data.summary.attendanceRate,
        });
      }
    } catch (err) {
      console.log('Error loading attendance from Supabase:', err);
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const filteredClasses = CLASS_ATTENDANCE_DATA.filter((c) => {
    if (selectedFilter === 'PERFECT') return c.status === 'perfect';
    if (selectedFilter === 'WARNING') return c.status === 'warning';
    return true;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onPublishNotice={() => {}} />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* TOP HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Attendance & Biometric Daily Rolls
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                School-wide Attendance & Rolls
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time morning & afternoon roll calls across all 32 class sections
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-200/80 p-1 rounded-xl">
                <button
                  onClick={() => setActiveSession('morning')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSession === 'morning'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Morning Session
                </button>
                <button
                  onClick={() => setActiveSession('afternoon')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSession === 'afternoon'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Afternoon Session
                </button>
              </div>

              <button
                onClick={() => alert('Official CBSE Attendance Register exported.')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Export Register</span>
              </button>
            </div>
          </div>

          {/* ATTENDANCE SUMMARY KPIS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                TODAY'S OVERALL ATTENDANCE
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                <NumberTicker value={96.2} decimalPlaces={1} />%
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                +1.4% higher than monthly average
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                STUDENTS PRESENT
              </p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                <NumberTicker value={1366} />
                <span className="text-xs font-semibold text-slate-400">/ 1,420</span>
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">54 absent across campus</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                SECTIONS 100% PERFECT
              </p>
              <p className="text-2xl font-extrabold text-indigo-700 mt-1">
                <NumberTicker value={8} />
                <span className="text-xs font-semibold text-slate-400">/ 32 Sections</span>
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">Class 9-B, 11-A, 12-A...</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                CHRONIC ABSENT (&lt;75%)
              </p>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">
                <NumberTicker value={12} /> Students
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">CBSE Board advisory sent</p>
            </div>
          </div>

          {/* CLASS BY CLASS LIVE GRID */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Today's Class-by-Class Attendance Snapshot
                </h3>
                <p className="text-xs text-slate-500">
                  Live attendance finalized by class teachers across 32 sections
                </p>
              </div>

              <div className="flex items-center gap-2">
                {['ALL', 'PERFECT', 'WARNING'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedFilter === filter
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {filter === 'ALL' ? 'All Sections' : filter === 'PERFECT' ? '100% Perfect' : 'Below 90%'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {filteredClasses.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    item.status === 'perfect'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : item.status === 'warning'
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-slate-50/60 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      {item.className} – Section {item.section}
                    </span>
                    {item.status === 'perfect' ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        100% PERFECT
                      </span>
                    ) : (
                      <span
                        className={`text-xs font-bold ${
                          item.status === 'warning' ? 'text-amber-700' : 'text-slate-700'
                        }`}
                      >
                        {item.rate}%
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                    <span>
                      <strong className="text-slate-900">{item.present}</strong> Present / {item.total} Total
                    </span>
                    <span className={item.absent > 0 ? 'font-bold text-rose-600' : 'text-slate-400'}>
                      {item.absent} Absent
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full ${
                        item.status === 'perfect'
                          ? 'bg-emerald-500'
                          : item.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/50">
                    <span>In-Charge: {item.classTeacher}</span>
                    <span>Finalized {item.markedTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REAL SUPABASE ATTENDANCE FEED */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Live Attendance Records from Supabase
                </h3>
                <p className="text-xs text-slate-500">
                  Synchronized from Teacher mobile app rapid attendance submissions
                </p>
              </div>
              <button
                onClick={fetchAttendance}
                disabled={loadingAttendance}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Refresh from Supabase"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAttendance ? 'animate-spin text-indigo-600' : ''}`} />
              </button>
            </div>

            <div className="overflow-x-auto">
              {loadingAttendance ? (
                <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Loading live roll feed...</span>
                </div>
              ) : realRecords.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No attendance entries submitted yet for today. Submissions from the Mobile App will appear here in real time.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Session</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4">Remarks</th>
                      <th className="py-3 px-4 text-right">Logged At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {realRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-extrabold text-slate-900">
                            {r.students?.first_name} {r.students?.last_name}
                          </span>
                          <span className="block text-[10px] font-mono text-slate-400">
                            Roll #{r.students?.roll_no} • {r.students?.admission_no}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {r.attendance_date}
                        </td>
                        <td className="py-3 px-4 capitalize">
                          {r.session}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                              r.status === 'P'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : r.status === 'A'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {r.status === 'P' ? 'Present' : r.status === 'A' ? 'Absent' : 'Late'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 italic text-[11px]">
                          {r.remarks || '—'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-400">
                          {new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
