'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { NumberTicker } from '@/components/ui/number-ticker';
import {
  Award,
  Trophy,
  Medal,
  TrendingUp,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  ArrowUpRight,
} from 'lucide-react';

interface TopperStudent {
  rank: 1 | 2 | 3;
  name: string;
  rollNo: string;
  admissionNo: string;
  className: string;
  section: string;
  stream?: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  topSubject: string;
  avatarBg: string;
  avatarColor: string;
  initials: string;
}

const TOPPERS_DATA: Record<string, TopperStudent[]> = {
  '10': [
    {
      rank: 1,
      name: 'Bhuvanesh Karthik',
      rollNo: '10A03',
      admissionNo: 'GW-2022-8192',
      className: 'Class 10',
      section: 'A',
      totalScore: 494,
      maxScore: 500,
      percentage: 98.8,
      topSubject: 'Mathematics (100/100)',
      avatarBg: 'bg-amber-100',
      avatarColor: 'text-amber-800',
      initials: 'BK',
    },
    {
      rank: 2,
      name: 'Ananya Sridharan',
      rollNo: '10B01',
      admissionNo: 'GW-2022-7419',
      className: 'Class 10',
      section: 'B',
      totalScore: 489,
      maxScore: 500,
      percentage: 97.8,
      topSubject: 'Science (99/100)',
      avatarBg: 'bg-slate-100',
      avatarColor: 'text-slate-700',
      initials: 'AS',
    },
    {
      rank: 3,
      name: 'Deepak Raman',
      rollNo: '10A14',
      admissionNo: 'GW-2022-9023',
      className: 'Class 10',
      section: 'A',
      totalScore: 485,
      maxScore: 500,
      percentage: 97.0,
      topSubject: 'Social Science (98/100)',
      avatarBg: 'bg-amber-50',
      avatarColor: 'text-amber-900',
      initials: 'DR',
    },
  ],
  '12': [
    {
      rank: 1,
      name: 'Adithya Narayanan',
      rollNo: '12CS04',
      admissionNo: 'GW-2020-5512',
      className: 'Class 12',
      section: 'A',
      stream: 'PCM + Computer Science',
      totalScore: 496,
      maxScore: 500,
      percentage: 99.2,
      topSubject: 'Computer Science (100/100)',
      avatarBg: 'bg-amber-100',
      avatarColor: 'text-amber-800',
      initials: 'AN',
    },
    {
      rank: 2,
      name: 'Kavitha Ranganathan',
      rollNo: '12BM02',
      admissionNo: 'GW-2020-6218',
      className: 'Class 12',
      section: 'B',
      stream: 'Bio-Maths / NEET Track',
      totalScore: 491,
      maxScore: 500,
      percentage: 98.2,
      topSubject: 'Biology (99/100)',
      avatarBg: 'bg-slate-100',
      avatarColor: 'text-slate-700',
      initials: 'KR',
    },
    {
      rank: 3,
      name: 'Sneha Meenakshi',
      rollNo: '12CO07',
      admissionNo: 'GW-2020-4991',
      className: 'Class 12',
      section: 'C',
      stream: 'Commerce + Applied Maths',
      totalScore: 486,
      maxScore: 500,
      percentage: 97.2,
      topSubject: 'Accountancy (99/100)',
      avatarBg: 'bg-amber-50',
      avatarColor: 'text-amber-900',
      initials: 'SM',
    },
  ],
  '9': [
    {
      rank: 1,
      name: 'Rohan Sundaram',
      rollNo: '9A08',
      admissionNo: 'GW-2023-1104',
      className: 'Class 9',
      section: 'A',
      totalScore: 490,
      maxScore: 500,
      percentage: 98.0,
      topSubject: 'Mathematics (99/100)',
      avatarBg: 'bg-amber-100',
      avatarColor: 'text-amber-800',
      initials: 'RS',
    },
    {
      rank: 2,
      name: 'Pooja Venkatesh',
      rollNo: '9B11',
      admissionNo: 'GW-2023-2287',
      className: 'Class 9',
      section: 'B',
      totalScore: 484,
      maxScore: 500,
      percentage: 96.8,
      topSubject: 'English Core (98/100)',
      avatarBg: 'bg-slate-100',
      avatarColor: 'text-slate-700',
      initials: 'PV',
    },
    {
      rank: 3,
      name: 'Harish Kalyan',
      rollNo: '9C05',
      admissionNo: 'GW-2023-3341',
      className: 'Class 9',
      section: 'C',
      totalScore: 480,
      maxScore: 500,
      percentage: 96.0,
      topSubject: 'Science (97/100)',
      avatarBg: 'bg-amber-50',
      avatarColor: 'text-amber-900',
      initials: 'HK',
    },
  ],
  '11': [
    {
      rank: 1,
      name: 'Sanjay Krishnan',
      rollNo: '11CS01',
      admissionNo: 'GW-2021-4402',
      className: 'Class 11',
      section: 'A',
      stream: 'PCM + Computer Science',
      totalScore: 493,
      maxScore: 500,
      percentage: 98.6,
      topSubject: 'Physics (99/100)',
      avatarBg: 'bg-amber-100',
      avatarColor: 'text-amber-800',
      initials: 'SK',
    },
    {
      rank: 2,
      name: 'Meghana Rao',
      rollNo: '11BM04',
      admissionNo: 'GW-2021-3982',
      className: 'Class 11',
      section: 'B',
      stream: 'Bio-Maths / NEET Track',
      totalScore: 487,
      maxScore: 500,
      percentage: 97.4,
      topSubject: 'Chemistry (98/100)',
      avatarBg: 'bg-slate-100',
      avatarColor: 'text-slate-700',
      initials: 'MR',
    },
    {
      rank: 3,
      name: 'Varun Teja',
      rollNo: '11CO03',
      admissionNo: 'GW-2021-5019',
      className: 'Class 11',
      section: 'C',
      stream: 'Commerce + Applied Maths',
      totalScore: 482,
      maxScore: 500,
      percentage: 96.4,
      topSubject: 'Economics (98/100)',
      avatarBg: 'bg-amber-50',
      avatarColor: 'text-amber-900',
      initials: 'VT',
    },
  ],
};

const SUBJECT_PERFORMANCE = [
  { subject: 'Mathematics', average: 86.4, passRate: 98.2, gradeDist: '68% Dist', topper: '100 (5 students)' },
  { subject: 'Physics', average: 84.1, passRate: 97.5, gradeDist: '62% Dist', topper: '99 (3 students)' },
  { subject: 'Chemistry', average: 85.2, passRate: 97.8, gradeDist: '64% Dist', topper: '99 (4 students)' },
  { subject: 'Computer Science', average: 92.4, passRate: 100.0, gradeDist: '88% Dist', topper: '100 (9 students)' },
  { subject: 'Biology', average: 88.0, passRate: 98.4, gradeDist: '72% Dist', topper: '99 (6 students)' },
  { subject: 'English Core', average: 89.6, passRate: 99.5, gradeDist: '76% Dist', topper: '98 (12 students)' },
];

export default function AcademicMarksPage() {
  const [selectedClass, setSelectedClass] = useState<'10' | '12' | '9' | '11'>('10');
  const [selectedTerm, setSelectedTerm] = useState('Term 1 Assessment');

  const currentToppers = TOPPERS_DATA[selectedClass] || TOPPERS_DATA['10'];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onPublishNotice={() => {}} />

        <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* TOP BANNER WITH PRINCIPAL CONTROLS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Executive Academic Performance Desk • CBSE Board Batches
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Academic Marks & Top Rank Roster
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring high-stakes board performance for Classes 9, 10, 11 & 12 • Term 1 Assessment
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Term 1 Assessment">Term 1 Assessment (Finalized)</option>
                <option value="Unit Test 1">Unit Test 1 (Monthly)</option>
                <option value="Half Yearly Pre-Board">Half Yearly Pre-Board (Upcoming)</option>
              </select>

              <button
                onClick={() => alert('Official CBSE Board Marksheet Master Register downloaded with Principal digital seal.')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* CLASS SWITCHER TABS (Classes 10, 12, 9, 11) */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center bg-slate-200/80 p-1.5 rounded-2xl gap-1">
              {[
                { id: '10', label: 'Class 10 (Secondary Board)', tag: 'AISSE' },
                { id: '12', label: 'Class 12 (Senior Secondary)', tag: 'AISSCE' },
                { id: '9', label: 'Class 9 (Foundation Batch)', tag: 'Pre-Board' },
                { id: '11', label: 'Class 11 (Stream Specialization)', tag: 'Higher Secondary' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedClass(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    selectedClass === tab.id
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-md ${
                      selectedClass === tab.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'bg-slate-300/60 text-slate-600'
                    }`}
                  >
                    {tab.tag}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing official top 3 merit ranks for <strong className="text-slate-900">Class {selectedClass}</strong>
            </div>
          </div>

          {/* TOP 3 RANK PODIUM CARDS (Gold, Silver, Bronze) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentToppers.map((student) => {
              const isGold = student.rank === 1;
              const isSilver = student.rank === 2;
              const isBronze = student.rank === 3;

              return (
                <div
                  key={student.rollNo}
                  className={`bg-white rounded-2xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between ${
                    isGold
                      ? 'border-amber-300 shadow-md shadow-amber-100 ring-2 ring-amber-400/20'
                      : isSilver
                      ? 'border-slate-300 shadow-sm'
                      : 'border-amber-200/80 shadow-xs'
                  }`}
                >
                  {/* Decorative Top Accent */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 ${
                      isGold
                        ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500'
                        : isSilver
                        ? 'bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400'
                        : 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700'
                    }`}
                  />

                  <div>
                    {/* Header: Rank Medal */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {isGold && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                            <Trophy className="w-3.5 h-3.5 text-amber-500" />
                            RANK #1 • GOLD TOPPER
                          </span>
                        )}
                        {isSilver && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                            <Medal className="w-3.5 h-3.5 text-slate-500" />
                            RANK #2 • SILVER
                          </span>
                        )}
                        {isBronze && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-900 bg-amber-50/60 border border-amber-200 px-3 py-1 rounded-full">
                            <Medal className="w-3.5 h-3.5 text-amber-700" />
                            RANK #3 • BRONZE
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-mono text-slate-400 font-semibold">
                        {student.rollNo}
                      </span>
                    </div>

                    {/* Student Info */}
                    <div className="flex items-center gap-3.5 mb-5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-base ${student.avatarBg} ${student.avatarColor}`}
                      >
                        {student.initials}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">
                          {student.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {student.className} – Section {student.section}
                          {student.stream && ` • ${student.stream}`}
                        </p>
                      </div>
                    </div>

                    {/* Score Box */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            TOTAL SCORE
                          </p>
                          <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                            <NumberTicker value={student.totalScore} />
                            <span className="text-xs font-semibold text-slate-400">
                              /{student.maxScore}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            PERCENTAGE
                          </p>
                          <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">
                            <NumberTicker value={student.percentage} decimalPlaces={1} />%
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Highest Subject:</span>
                        <span className="font-bold text-indigo-700">{student.topSubject}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono text-[11px]">Adm: {student.admissionNo}</span>
                    <button
                      onClick={() => alert(`Detailed Report Card generated for ${student.name} (${student.className}-${student.section}).`)}
                      className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>View Marksheet</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUBJECT MASTERY & PERFORMANCE BREAKDOWN */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Subject-Wise Performance & Distinction Rates
                </h3>
                <p className="text-xs text-slate-500">
                  Class {selectedClass} aggregate across all active sections • Term 1
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                100% CBSE Curriculum Aligned
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {SUBJECT_PERFORMANCE.map((item) => (
                <div
                  key={item.subject}
                  className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/70 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900">{item.subject}</span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {item.gradeDist}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-3">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">CLASS AVERAGE</p>
                      <p className="text-lg font-extrabold text-slate-800">
                        <NumberTicker value={item.average} decimalPlaces={1} />/100
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-semibold">PASS PERCENTAGE</p>
                      <p className="text-lg font-extrabold text-emerald-600">
                        <NumberTicker value={item.passRate} decimalPlaces={1} />%
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/50">
                    Highest: <strong className="text-slate-800 font-semibold">{item.topper}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
