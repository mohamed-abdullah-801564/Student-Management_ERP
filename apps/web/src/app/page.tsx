'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Filter,
  MoreVertical,
  ChevronRight,
  Check,
  X,
  FileText,
  Send,
  Sparkles,
} from 'lucide-react';

interface ApprovalItem {
  id: string;
  type: 'leave' | 'requisition';
  title: string;
  applicant: string;
  details: string;
  urgent: boolean;
  timestamp: string;
}

export default function PrincipalDashboard() {
  const [session, setSession] = useState<'morning' | 'afternoon'>('morning');
  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    {
      id: 'app_1',
      type: 'leave',
      title: 'Emergency Medical Leave (3 Days)',
      applicant: 'Mr. Anand Kumar (Senior Physics Faculty)',
      details: 'Hospitalization for acute viral infection. All 6 periods reallocated by Coordinator.',
      urgent: true,
      timestamp: '08:10 AM Today',
    },
    {
      id: 'app_2',
      type: 'requisition',
      title: 'Chemistry Lab Consumables Requisition',
      applicant: 'Mrs. Jayanthi V. (Lab In-Charge)',
      details: 'Required for Class 11 CBSE Term 1 practical exams. Total quote: ₹14,500.',
      urgent: false,
      timestamp: 'Yesterday, 04:30 PM',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [circularTitle, setCircularTitle] = useState('');
  const [circularAudience, setCircularAudience] = useState('All School Parents & Faculty');
  const [circularMessage, setCircularMessage] = useState('');

  const handleApproval = (id: string, action: 'approved' | 'declined') => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    alert(`Request ${id} has been ${action}. Updated in school audit log.`);
  };

  const handlePublishCircular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!circularTitle.trim()) {
      alert('Please enter circular subject');
      return;
    }
    alert(
      `Circular "${circularTitle}" dispatched to ${circularAudience} via Push Notification and SMS broadcast!`
    );
    setIsModalOpen(false);
    setCircularTitle('');
    setCircularMessage('');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* LEFT NAVIGATION SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onPublishNotice={() => setIsModalOpen(true)} />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* TOP KPI STATS (4 HERO CARDS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Students Attendance */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  STUDENTS PRESENT TODAY
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    1,366
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">
                    / 1,420 Enrolled
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3 mr-0.5 text-emerald-600" />
                    96.2%
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    +1.4% vs last week
                  </span>
                </div>
              </div>
            </div>

            {/* KPI 2: Faculty On Duty */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  FACULTY ON DUTY
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    64
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">
                    / 68 Total Staff
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                    4 Substitutes Active
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    100% Period Coverage
                  </span>
                </div>
              </div>
            </div>

            {/* KPI 3: Academic Assessments */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  TERM 1 MARKSHEETS
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    58
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">
                    / 62 Submitted
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                    4 Pending Review
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Grades 8 & 9 Math
                  </span>
                </div>
              </div>
            </div>

            {/* KPI 4: Pending Approvals */}
            <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">
                  PENDING APPROVALS
                </span>
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-extrabold text-rose-600 tracking-tight">
                    {approvals.length} Urgent
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Requires Principal Authorization
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN 2-COLUMN SECTION (Left 65%, Right 35%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: ATTENDANCE SNAPSHOT & SUBSTITUTE TABLE */}
            <div className="lg:col-span-8 space-y-6">
              {/* CARD: Today's Class-by-Class Attendance Snapshot */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                      Today's Class-by-Class Attendance Snapshot
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Live attendance finalized by class teachers across 32 sections
                    </p>
                  </div>

                  {/* Session Switcher */}
                  <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setSession('morning')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        session === 'morning'
                          ? 'bg-white text-indigo-700 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Morning Session
                    </button>
                    <button
                      onClick={() => setSession('afternoon')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        session === 'afternoon'
                          ? 'bg-white text-indigo-700 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Afternoon Session
                    </button>
                  </div>
                </div>

                {/* 4 Representative Class Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  {/* Class 10-A */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-900">
                        Grade 10 - Section A
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        95.0%
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs text-slate-600 mb-2">
                      <span>38 Present / 40 Total</span>
                      <span className="text-rose-600 font-semibold">2 Absent</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95%' }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                      In-Charge: Mr. Venkatesh R. • Finalized 08:35 AM
                    </p>
                  </div>

                  {/* Class 9-B */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 hover:bg-white hover:border-emerald-400 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-900">
                        Grade 9 - Section B
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        100% PERFECT
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs text-slate-600 mb-2">
                      <span>37 Present / 37 Total</span>
                      <span className="text-emerald-700 font-semibold">0 Absent</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                      In-Charge: Mrs. Preetha V. • Finalized 08:32 AM
                    </p>
                  </div>

                  {/* Class 8-C */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-900">
                        Grade 8 - Section C
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        87.8%
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs text-slate-600 mb-2">
                      <span>36 Present / 41 Total</span>
                      <span className="text-rose-600 font-semibold">5 Absent</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '87.8%' }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                      In-Charge: Mr. Karthik Raja • Finalized 08:44 AM
                    </p>
                  </div>

                  {/* Class 12-A */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-900">
                        Grade 12 - Section A (Science)
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        97.6%
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs text-slate-600 mb-2">
                      <span>42 Present / 43 Total</span>
                      <span className="text-rose-600 font-semibold">1 Absent</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '97.6%' }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                      In-Charge: Dr. S. Raman • Finalized 08:30 AM
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    All classroom attendance synchronized to Parent App
                  </span>
                  <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                    <span>View All 32 Classrooms</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CARD: Substitute Teacher & Period Coverage Summary */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                      Substitute Teacher & Period Coverage Summary
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Automated allocation executed by Academic Coordinators
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    All 4 Absent Periods Covered
                  </span>
                </div>

                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Absent Faculty</th>
                        <th className="pb-3 font-semibold">Period & Class</th>
                        <th className="pb-3 font-semibold">Allocated Substitute</th>
                        <th className="pb-3 font-semibold">Assigned Time</th>
                        <th className="pb-3 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3">
                          <p className="font-bold text-slate-900">Mr. Anand Kumar</p>
                          <p className="text-[10px] text-slate-400">Physics Faculty (Medical Leave)</p>
                        </td>
                        <td className="py-3">
                          <span className="font-semibold text-slate-800">Period 4 (11:40 AM)</span>
                          <p className="text-[10px] text-indigo-600 font-medium">Grade 9-A • Science Lab</p>
                        </td>
                        <td className="py-3">
                          <p className="font-bold text-slate-900">Mrs. Deepa R.</p>
                          <p className="text-[10px] text-emerald-600 font-medium">Free Period 4 • Math Faculty</p>
                        </td>
                        <td className="py-3 text-slate-500">08:15 AM</td>
                        <td className="py-3 text-right">
                          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Acknowledged
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3">
                          <p className="font-bold text-slate-900">Mrs. Malathi S.</p>
                          <p className="text-[10px] text-slate-400">English Faculty (Family Leave)</p>
                        </td>
                        <td className="py-3">
                          <span className="font-semibold text-slate-800">Period 2 (09:50 AM)</span>
                          <p className="text-[10px] text-indigo-600 font-medium">Grade 6-B • Room 106</p>
                        </td>
                        <td className="py-3">
                          <p className="font-bold text-slate-900">Mr. Karthik Raja</p>
                          <p className="text-[10px] text-emerald-600 font-medium">Free Period 2 • English Dept</p>
                        </td>
                        <td className="py-3 text-slate-500">08:20 AM</td>
                        <td className="py-3 text-right">
                          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Acknowledged
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3">
                          <p className="font-bold text-slate-900">Mr. Vignesh P.</p>
                          <p className="text-[10px] text-slate-400">Math Faculty (Official Duty)</p>
                        </td>
                        <td className="py-3">
                          <span className="font-semibold text-slate-800">Period 3 (10:50 AM)</span>
                          <p className="text-[10px] text-indigo-600 font-medium">Grade 11-A • Room 302</p>
                        </td>
                        <td className="py-3">
                          <p className="font-bold text-slate-900">Mrs. Preetha V.</p>
                          <p className="text-[10px] text-emerald-600 font-medium">Free Period 3 • Math Dept</p>
                        </td>
                        <td className="py-3 text-slate-500">08:25 AM</td>
                        <td className="py-3 text-right">
                          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Acknowledged
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PENDING APPROVALS & ACTIVITY STREAM */}
            <div className="lg:col-span-4 space-y-6">
              {/* CARD: Pending Principal Approvals */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                      Pending Approvals
                    </h3>
                  </div>
                  <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                    {approvals.length} Action Needed
                  </span>
                </div>

                <div className="space-y-3 mt-4">
                  {approvals.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                      All operational requests have been processed!
                    </div>
                  ) : (
                    approvals.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 hover:bg-white transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {item.title}
                          </h4>
                          {item.urgent && (
                            <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded shrink-0">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-indigo-700">
                          {item.applicant}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {item.details}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                          <span className="text-[10px] text-slate-400">
                            {item.timestamp}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproval(item.id, 'declined')}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleApproval(item.id, 'approved')}
                              className="px-3 py-1 rounded-lg bg-indigo-600 text-[11px] font-bold text-white hover:bg-indigo-700 transition-colors"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* CARD: Faculty Status Distribution */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mb-4">
                  Faculty Status Distribution
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">Present on Campus</span>
                      <span className="font-bold text-slate-900">64 (94.1%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '94.1%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">On Medical / Casual Leave</span>
                      <span className="font-bold text-slate-900">3 (4.4%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '4.4%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">Official Duty (OD / CBSE)</span>
                      <span className="font-bold text-slate-900">1 (1.5%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: '1.5%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD: Recent Activity Stream / Audit Trail */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mb-4">
                  Recent School Audit Activity
                </h3>

                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  <div className="flex items-start gap-3 relative pl-6">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 absolute left-2 top-1.5 ring-4 ring-white" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Class 8-B Attendance Finalized
                      </p>
                      <p className="text-[10px] text-slate-400">
                        By Mrs. Deepa R. • 08:42 AM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 relative pl-6">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 absolute left-2 top-1.5 ring-4 ring-white" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Period 4 Substitute Assigned
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Mrs. Deepa assigned for Mr. Anand • 08:15 AM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 relative pl-6">
                    <span className="w-2 h-2 rounded-full bg-amber-500 absolute left-2 top-1.5 ring-4 ring-white" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Grade 10 Science Marks Uploaded
                      </p>
                      <p className="text-[10px] text-slate-400">
                        By Mr. Anand K. • 08:05 AM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 relative pl-6">
                    <span className="w-2 h-2 rounded-full bg-slate-400 absolute left-2 top-1.5 ring-4 ring-white" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Circular #41 Dispatched
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Parent-Teacher Conference schedule • Yesterday
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* PUBLISH CIRCULAR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Publish Official School Circular
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Direct broadcast via Push Notification & SMS
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishCircular} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Circular Subject / Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Annual Sports Meet 2026 - Schedule & Uniform Notice"
                  value={circularTitle}
                  onChange={(e) => setCircularTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Recipient Audience
                </label>
                <select
                  value={circularAudience}
                  onChange={(e) => setCircularAudience(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                >
                  <option value="All School Parents & Faculty">All School (1,420 Parents + 68 Staff)</option>
                  <option value="Senior Secondary Only (Grades 11 & 12)">Senior Secondary (Grades 11 & 12)</option>
                  <option value="Middle School (Grades 6 to 8)">Middle School (Grades 6 to 8)</option>
                  <option value="Primary Wing (Grades 1 to 5)">Primary Wing (Grades 1 to 5)</option>
                  <option value="All Faculty & Staff Only">Faculty & Staff Only (Internal Notice)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Message Content / Notice Body
                </label>
                <textarea
                  rows={4}
                  placeholder="Type the official notification content here..."
                  value={circularMessage}
                  onChange={(e) => setCircularMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <p className="text-[11px] text-indigo-800">
                  This circular will be stamped with Principal Dr. M. Jayakumar’s digital credentials.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-300"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
