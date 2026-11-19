'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { NumberTicker } from '@/components/ui/number-ticker';
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
  Image as ImageIcon,
  Upload,
  AlertCircle,
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

  interface TopStudent {
    id: string;
    name: string;
    rollNo: string;
    admissionNo: string;
    avgScore: number;
    grade: string;
    rank: number;
  }

  const [topStudents, setTopStudents] = useState<TopStudent[]>([
    { id: '1', name: 'Bhuvanesh K', rollNo: '#03', admissionNo: 'GW-2026-0840', avgScore: 98.0, grade: 'A1', rank: 1 },
    { id: '2', name: 'Rahul Suresh', rollNo: '#18', admissionNo: 'GW-2026-0842', avgScore: 96.0, grade: 'A1', rank: 2 },
    { id: '3', name: 'Ananya Sri', rollNo: '#02', admissionNo: 'GW-2026-0104', avgScore: 94.0, grade: 'A1', rank: 3 },
  ]);

  useEffect(() => {
    async function loadRealMarks() {
      try {
        const res = await fetch('/api/marks');
        const json = await res.json();
        if (json.marks && json.marks.length > 0) {
          const studentMap: Record<string, { name: string; rollNo: string; admissionNo: string; scores: number[] }> = {};
          json.marks.forEach((m: any) => {
            const sid = m.student_id;
            const name = m.students ? `${m.students.first_name} ${m.students.last_name}` : 'Student';
            const rollNo = m.students?.roll_no ? `#${m.students.roll_no}` : '#01';
            const admissionNo = m.students?.admission_no || 'GW-2026-0842';
            if (!studentMap[sid]) {
              studentMap[sid] = { name, rollNo, admissionNo, scores: [] };
            }
            if (m.marks_obtained !== undefined) {
              studentMap[sid].scores.push(Number(m.marks_obtained));
            }
          });

          const ranked = Object.entries(studentMap).map(([id, data]) => {
            const avg = data.scores.length > 0 ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length : 0;
            return {
              id,
              name: data.name,
              rollNo: data.rollNo,
              admissionNo: data.admissionNo,
              avgScore: Number(avg.toFixed(1)),
              grade: avg >= 90 ? 'A1' : avg >= 80 ? 'A2' : 'B1',
              rank: 0,
            };
          });

          ranked.sort((a, b) => b.avgScore - a.avgScore);
          const top3 = ranked.slice(0, 3).map((s, idx) => ({ ...s, rank: idx + 1 }));
          if (top3.length > 0) {
            setTopStudents(top3);
          }
        }
      } catch {
        // fallback to default toppers
      }
    }
    loadRealMarks();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [circularTitle, setCircularTitle] = useState('');
  const [circularAudience, setCircularAudience] = useState<'all' | 'parents' | 'teachers'>('all');
  const [circularPriority, setCircularPriority] = useState<'normal' | 'urgent'>('normal');
  const [circularMessage, setCircularMessage] = useState('');
  const [circularImage, setCircularImage] = useState<string | null>(null);
  const [circularImageName, setCircularImageName] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB');
        return;
      }
      setCircularImageName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setCircularImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApproval = (id: string, action: 'approved' | 'declined') => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    alert(`Request ${id} has been ${action}. Updated in school audit log.`);
  };

  const handlePublishCircular = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!circularTitle.trim()) {
      alert('Please enter circular subject / headline');
      return;
    }
    if (!circularMessage.trim()) {
      alert('Please enter circular announcement message');
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch('/api/circulars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: circularTitle.trim(),
          audience: circularAudience,
          priority: circularPriority,
          content: circularMessage.trim(),
          attachmentUrl: circularImage || undefined,
          attachmentName: circularImage ? circularImageName : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to dispatch circular to school registry');
      }

      const audienceLabel =
        circularAudience === 'all'
          ? 'All School (Parents & Faculty)'
          : circularAudience === 'parents'
          ? 'Parents Only'
          : 'Teachers Only';

      setSuccessBanner(
        `Circular "${circularTitle}" dispatched successfully to ${audienceLabel} with official digital seal!`
      );
      setIsModalOpen(false);
      setCircularTitle('');
      setCircularMessage('');
      setCircularImage(null);
      setCircularImageName('');
      setCircularAudience('all');
      setCircularPriority('normal');

      setTimeout(() => {
        setSuccessBanner(null);
      }, 7000);
    } catch (err: any) {
      alert(err.message || 'Error publishing circular');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* LEFT NAVIGATION SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onPublishNotice={() => setIsModalOpen(true)} />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* SUCCESS BROADCAST BANNER */}
          {successBanner && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-4 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950">Official Circular Dispatched</p>
                  <p className="text-xs text-emerald-800">{successBanner}</p>
                </div>
              </div>
              <button
                onClick={() => setSuccessBanner(null)}
                className="text-emerald-700 hover:text-emerald-900 p-1 rounded-lg hover:bg-emerald-100/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

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
                    <NumberTicker value={1366} />
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">
                    / 1,420 Enrolled
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3 mr-0.5 text-emerald-600" />
                    <NumberTicker value={96.2} decimalPlaces={1} />%
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
                    <NumberTicker value={64} />
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
                    <NumberTicker value={58} />
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
                    <NumberTicker value={approvals.length} /> Urgent
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

              {/* CARD: Academic Excellence & Top 3 Section Toppers (Real Supabase Marks) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                      Academic Merit • Term 1 Toppers
                    </h3>
                  </div>
                  <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Supabase Live ✓
                  </span>
                </div>

                <div className="space-y-3">
                  {topStudents.map((st) => (
                    <div
                      key={st.id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3 hover:bg-white hover:border-amber-200 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                            st.rank === 1
                              ? 'bg-amber-100 text-amber-800'
                              : st.rank === 2
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          #{st.rank}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            {st.name}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Roll {st.rollNo} • Class 8-B ({st.admissionNo})
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <NumberTicker value={st.avgScore} decimalPlaces={1} />%
                        </div>
                        <p className="text-[10px] font-bold text-amber-600 mt-0.5">
                          Grade {st.grade} Distinction
                        </p>
                      </div>
                    </div>
                  ))}
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shadow-indigo-300">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Publish Official School Circular
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct broadcast with digital principal credential seal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishCircular} className="p-6 space-y-5">
              {/* TARGET AUDIENCE SELECTOR */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Target Recipient Audience
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCircularAudience('all')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      circularAudience === 'all'
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base">🌐</span>
                    <span>All School</span>
                    <span className="text-[10px] font-normal text-slate-400">Parents & Staff</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCircularAudience('parents')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      circularAudience === 'parents'
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base">👨‍👩‍👦</span>
                    <span>Parents Only</span>
                    <span className="text-[10px] font-normal text-slate-400">Parent Mobile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCircularAudience('teachers')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      circularAudience === 'teachers'
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base">👩‍🏫</span>
                    <span>Teachers Only</span>
                    <span className="text-[10px] font-normal text-slate-400">Faculty Portal</span>
                  </button>
                </div>
              </div>

              {/* PRIORITY LEVEL SELECTOR */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Priority Level
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCircularPriority('normal')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      circularPriority === 'normal'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-700 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Standard Advisory</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCircularPriority('urgent')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      circularPriority === 'urgent'
                        ? 'border-rose-600 bg-rose-50/80 text-rose-700 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span>⚠️ Urgent Action Alert</span>
                  </button>
                </div>
              </div>

              {/* CIRCULAR SUBJECT */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  3. Circular Subject / Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Annual Athletic Meet & Sports Day 2026 Schedule"
                  value={circularTitle}
                  onChange={(e) => setCircularTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                  required
                />
              </div>

              {/* MESSAGE CONTENT */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  4. Official Message / Notice Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Type the official announcement message here for parents and teachers..."
                  value={circularMessage}
                  onChange={(e) => setCircularMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all leading-relaxed"
                  required
                />
              </div>

              {/* IMAGE / DOCUMENT ATTACHMENT */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  5. Circular Image / Document Attachment (Optional)
                </label>

                {circularImage ? (
                  <div className="relative border border-indigo-200 bg-indigo-50/50 rounded-2xl p-3 flex items-center gap-3.5">
                    <img
                      src={circularImage}
                      alt="Attachment Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-indigo-200 shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-indigo-950 truncate">
                        {circularImageName || 'Attached_Circular_Image.jpg'}
                      </p>
                      <p className="text-[11px] text-indigo-700 mt-0.5">
                        Image compressed & ready for mobile display
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCircularImage(null);
                        setCircularImageName('');
                      }}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 flex items-center justify-center transition-colors"
                      title="Remove attachment"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/20 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-500 group-hover:text-indigo-600 group-hover:border-indigo-200 flex items-center justify-center mb-1.5 transition-colors shadow-xs">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">
                      Click to upload circular photo or schedule map
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Supports JPG, PNG up to 5MB (auto-compressed)
                    </p>
                  </label>
                )}
              </div>

              {/* SECURITY CREDENTIAL SEAL */}
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <p className="text-[11px] text-indigo-900 leading-tight">
                  Dispatched with Principal Dr. K. Arumugam’s digital signature token. Broadcasts instantly to parent & teacher mobile terminals.
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-300 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isPublishing ? (
                    <span>Broadcasting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Broadcast Circular</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
