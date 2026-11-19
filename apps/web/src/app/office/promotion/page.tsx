'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Printer,
  Download,
  Plus,
  Bell,
  Check,
  X,
  ChevronRight,
  ShieldCheck,
  User,
  Users,
  Bus,
  FileText,
  Landmark,
  Receipt,
  Smartphone,
  Send,
  Sparkles,
  UserPlus,
  GraduationCap,
  ArrowRight,
  FileCheck,
  CreditCard,
  Award,
  ArrowUpRight,
  BookOpen,
  Library,
  Flame,
  AlertCircle,
  HelpCircle,
  History,
  Layers,
  LogOut,
} from 'lucide-react';

interface PromotionStudent {
  id: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  currentClass: string;
  currentSection: string;
  targetClass: string;
  targetSection: string;
  attendanceRate: number;
  annualAverage: number;
  resultStatus: 'Passed' | 'Compartment' | 'Detained';
  feeBalance: number;
  clearanceStatus: 'Cleared' | 'Pending Dues' | 'Books Pending';
  action: 'promote' | 'retain' | 'tc_applied';
  selected: boolean;
  promotionStatus: 'pending' | 'promoted';
  promotedAt?: string;
  newRollNo?: string;
}

interface TCRecord {
  tcNo: string;
  admissionNo: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  dobWords: string;
  classLastStudied: string;
  classInWords: string;
  annualExamResult: string;
  qualifiedForPromotion: string;
  feePaidUpto: string;
  totalWorkingDays: number;
  daysPresent: number;
  conduct: string;
  reasonForLeaving: string;
  issueDate: string;
  libraryCleared: boolean;
  accountsCleared: boolean;
  sportsCleared: boolean;
  status: 'Issued' | 'Pending Verification';
}

interface PromotionLog {
  id: string;
  batchName: string;
  sourceYear: string;
  targetYear: string;
  promotedCount: number;
  retainedCount: number;
  executedAt: string;
  students: string[];
}

const INITIAL_PROMOTION_STUDENTS: PromotionStudent[] = [
  {
    id: 's1',
    admissionNo: 'GW-2022-8192',
    rollNo: '8B01',
    name: 'Aakash Raman',
    currentClass: 'Class 8',
    currentSection: 'B',
    targetClass: 'Class 9',
    targetSection: 'B',
    attendanceRate: 96.5,
    annualAverage: 88.4,
    resultStatus: 'Passed',
    feeBalance: 0,
    clearanceStatus: 'Cleared',
    action: 'promote',
    selected: true,
    promotionStatus: 'pending',
  },
  {
    id: 's2',
    admissionNo: 'GW-2022-8193',
    rollNo: '8B02',
    name: 'Ananya Sri',
    currentClass: 'Class 8',
    currentSection: 'B',
    targetClass: 'Class 9',
    targetSection: 'B',
    attendanceRate: 98.0,
    annualAverage: 94.2,
    resultStatus: 'Passed',
    feeBalance: 0,
    clearanceStatus: 'Cleared',
    action: 'promote',
    selected: true,
    promotionStatus: 'pending',
  },
  {
    id: 's3',
    admissionNo: 'GW-2022-8194',
    rollNo: '8B03',
    name: 'Bhuvanesh K.',
    currentClass: 'Class 8',
    currentSection: 'B',
    targetClass: 'Class 9',
    targetSection: 'B',
    attendanceRate: 89.0,
    annualAverage: 76.5,
    resultStatus: 'Passed',
    feeBalance: 0,
    clearanceStatus: 'Cleared',
    action: 'promote',
    selected: true,
    promotionStatus: 'pending',
  },
  {
    id: 's4',
    admissionNo: 'GW-2026-0842',
    rollNo: '8B18',
    name: 'Rahul Suresh',
    currentClass: 'Class 8',
    currentSection: 'B',
    targetClass: 'Class 9',
    targetSection: 'B',
    attendanceRate: 94.2,
    annualAverage: 91.0,
    resultStatus: 'Passed',
    feeBalance: 38833,
    clearanceStatus: 'Pending Dues',
    action: 'promote',
    selected: false,
    promotionStatus: 'pending',
  },
  {
    id: 's5',
    admissionNo: 'GW-2022-8195',
    rollNo: '8B04',
    name: 'Devika Pillai',
    currentClass: 'Class 8',
    currentSection: 'B',
    targetClass: 'Class 9',
    targetSection: 'A',
    attendanceRate: 92.5,
    annualAverage: 85.0,
    resultStatus: 'Passed',
    feeBalance: 0,
    clearanceStatus: 'Cleared',
    action: 'promote',
    selected: true,
    promotionStatus: 'pending',
  },
  {
    id: 's6',
    admissionNo: 'GW-2022-8196',
    rollNo: '8B05',
    name: 'Girish Kumar V.',
    currentClass: 'Class 8',
    currentSection: 'B',
    targetClass: 'Class 8',
    targetSection: 'B',
    attendanceRate: 71.0,
    annualAverage: 42.5,
    resultStatus: 'Compartment',
    feeBalance: 0,
    clearanceStatus: 'Cleared',
    action: 'retain',
    selected: false,
    promotionStatus: 'pending',
  },
  {
    id: 's7',
    admissionNo: 'GW-2022-8197',
    rollNo: '8B06',
    name: 'Harini Nambiar',
    currentClass: 'Class 8',
    currentSection: 'B',
    targetClass: 'Class 9',
    targetSection: 'B',
    attendanceRate: 95.0,
    annualAverage: 89.5,
    resultStatus: 'Passed',
    feeBalance: 0,
    clearanceStatus: 'Cleared',
    action: 'tc_applied',
    selected: false,
    promotionStatus: 'pending',
  },
];

const INITIAL_TC_RECORDS: TCRecord[] = [
  {
    tcNo: 'GW-TC-2027-0041',
    admissionNo: 'GW-2022-8197',
    studentName: 'Harini Nambiar',
    fatherName: 'Mr. Manoj Nambiar',
    motherName: 'Mrs. Deepa Nambiar',
    dob: '2012-08-19',
    dobWords: 'Nineteenth August Two Thousand Twelve',
    classLastStudied: 'Class 8-B',
    classInWords: 'Class Eighth',
    annualExamResult: 'Passed and Qualified for Class IX',
    qualifiedForPromotion: 'Yes, Promoted to Class IX (Ninth)',
    feePaidUpto: 'March 2027 (Fully Cleared)',
    totalWorkingDays: 220,
    daysPresent: 209,
    conduct: 'Exemplary',
    reasonForLeaving: 'Parent relocation to Bengaluru (Tech Transfer)',
    issueDate: '2027-03-28',
    libraryCleared: true,
    accountsCleared: true,
    sportsCleared: true,
    status: 'Issued',
  },
  {
    tcNo: 'GW-TC-2027-0042',
    admissionNo: 'GW-2026-0842',
    studentName: 'Rahul Suresh',
    fatherName: 'Mr. Suresh Ramanathan',
    motherName: 'Mrs. Malathi Suresh',
    dob: '2012-07-14',
    dobWords: 'Fourteenth July Two Thousand Twelve',
    classLastStudied: 'Class 8-B',
    classInWords: 'Class Eighth',
    annualExamResult: 'Passed and Qualified for Class IX',
    qualifiedForPromotion: 'Yes, Promoted to Class IX (Ninth)',
    feePaidUpto: 'Term 2 Cleared (Term 3 in Progress)',
    totalWorkingDays: 220,
    daysPresent: 207,
    conduct: 'Good',
    reasonForLeaving: 'Parent request / Transfer to another city',
    issueDate: '2027-03-30',
    libraryCleared: true,
    accountsCleared: false,
    sportsCleared: true,
    status: 'Pending Verification',
  },
];

export default function PromotionAndTCPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'promotion' | 'tc' | 'audit'>('promotion');

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
    document.cookie = 'school_erp_session=; path=/; max-age=0';
    document.cookie = 'school_erp_role=; path=/; max-age=0';
    router.push('/login');
  };

  // Promotion State
  const [selectedClass, setSelectedClass] = useState('Class 8-B');
  const [targetBatch, setTargetBatch] = useState('Class 9-B');
  const [academicYearView, setAcademicYearView] = useState<'AY_2026_27' | 'AY_2027_28'>('AY_2026_27');
  const [students, setStudents] = useState<PromotionStudent[]>(INITIAL_PROMOTION_STUDENTS);
  const [isPromoting, setIsPromoting] = useState(false);
  const [promotionSuccessMsg, setPromotionSuccessMsg] = useState<string | null>(null);

  // Promotion Batch Audit Logs
  const [auditLogs, setAuditLogs] = useState<PromotionLog[]>([
    {
      id: 'log-1',
      batchName: 'Class 7-A → Class 8-A',
      sourceYear: 'AY 2026–27',
      targetYear: 'AY 2027–28',
      promotedCount: 38,
      retainedCount: 1,
      executedAt: 'Yesterday at 04:30 PM',
      students: ['Priya V.', 'Kavitha R.', 'Siddharth M.', '+35 students'],
    },
  ]);

  // TC Modal & Generation State
  const [tcRecords, setTcRecords] = useState<TCRecord[]>(INITIAL_TC_RECORDS);
  const [selectedTcForPrint, setSelectedTcForPrint] = useState<TCRecord | null>(null);
  const [isGenerateTcModalOpen, setIsGenerateTcModalOpen] = useState(false);

  // New TC Form Fields
  const [tcStudentName, setTcStudentName] = useState('Rahul Suresh');
  const [tcAdmNo, setTcAdmNo] = useState('GW-2026-0842');
  const [tcFather, setTcFather] = useState('Mr. Suresh Ramanathan');
  const [tcMother, setTcMother] = useState('Mrs. Malathi Suresh');
  const [tcDob, setTcDob] = useState('2012-07-14');
  const [tcDobWords, setTcDobWords] = useState('Fourteenth July Two Thousand Twelve');
  const [tcClass, setTcClass] = useState('Class 8-B');
  const [tcReason, setTcReason] = useState('Parent Relocation to Hyderabad (Transfer)');
  const [tcConduct, setTcConduct] = useState('Good / Exemplary');

  // Selection handlers
  const handleToggleStudent = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const handleSelectAll = (select: boolean) => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        selected: select ? s.clearanceStatus === 'Cleared' && s.action === 'promote' && s.promotionStatus === 'pending' : false,
      }))
    );
  };

  const handleActionChange = (id: string, newAction: 'promote' | 'retain' | 'tc_applied') => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              action: newAction,
              targetClass:
                newAction === 'promote'
                  ? 'Class 9'
                  : newAction === 'retain'
                  ? 'Class 8'
                  : 'TC Issued',
              selected: newAction === 'promote' && s.clearanceStatus === 'Cleared' && s.promotionStatus === 'pending',
            }
          : s
      )
    );
  };

  // Execute Batch Promotion and verify in state
  const handleExecutePromotion = async () => {
    const selectedStudents = students.filter((s) => s.selected && s.promotionStatus === 'pending');
    if (selectedStudents.length === 0) {
      alert('Please select at least one student cleared for promotion.');
      return;
    }

    setIsPromoting(true);

    try {
      await fetch('/api/students/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentIds: selectedStudents.map((s) => s.id),
          targetBatch: targetBatch,
          sourceBatch: selectedClass,
          academicYear: '2027-2028',
          action: 'promote',
        }),
      });
    } catch (e) {
      console.error('Promotion API sync error:', e);
    }

    setTimeout(() => {
      let rollCounter = 1;
      const promotedNames = selectedStudents.map((s) => s.name);

      setStudents((prev) =>
        prev.map((s) => {
          if (s.selected && s.promotionStatus === 'pending') {
            const rollPad = rollCounter < 10 ? `0${rollCounter}` : `${rollCounter}`;
            rollCounter++;
            return {
              ...s,
              promotionStatus: 'promoted' as const,
              promotedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              newRollNo: `9B${rollPad}`,
              selected: false,
            };
          }
          return s;
        })
      );

      // Add to Audit Log
      const newLog: PromotionLog = {
        id: `log-${Date.now()}`,
        batchName: `${selectedClass} → ${targetBatch}`,
        sourceYear: 'AY 2026–27',
        targetYear: 'AY 2027–28',
        promotedCount: selectedStudents.length,
        retainedCount: students.filter((s) => s.action === 'retain').length,
        executedAt: 'Just now (' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')',
        students: promotedNames,
      };
      setAuditLogs([newLog, ...auditLogs]);

      setIsPromoting(false);
      setPromotionSuccessMsg(
        `Batch Committed! ${selectedStudents.length} students promoted to ${targetBatch} (AY 2027–28). Switch view to "AY 2027–28" to verify new class register.`
      );
    }, 800);
  };

  const handleIssueNewTC = (e: React.FormEvent) => {
    e.preventDefault();
    const newNo = `GW-TC-2027-00${tcRecords.length + 43}`;
    const newTC: TCRecord = {
      tcNo: newNo,
      admissionNo: tcAdmNo,
      studentName: tcStudentName,
      fatherName: tcFather,
      motherName: tcMother,
      dob: tcDob,
      dobWords: tcDobWords,
      classLastStudied: tcClass,
      classInWords: 'Class Eighth',
      annualExamResult: 'Passed and Qualified for Class IX',
      qualifiedForPromotion: 'Yes, Promoted to Class IX (Ninth)',
      feePaidUpto: 'March 2027 (Fully Cleared)',
      totalWorkingDays: 220,
      daysPresent: 208,
      conduct: tcConduct,
      reasonForLeaving: tcReason,
      issueDate: new Date().toISOString().split('T')[0],
      libraryCleared: true,
      accountsCleared: true,
      sportsCleared: true,
      status: 'Issued',
    };

    setTcRecords([newTC, ...tcRecords]);
    setIsGenerateTcModalOpen(false);
    setSelectedTcForPrint(newTC);
  };

  // Filtered lists based on academic year view
  const displayedStudents =
    academicYearView === 'AY_2026_27'
      ? students
      : students.filter((s) => s.promotionStatus === 'promoted');

  const selectedCount = students.filter((s) => s.selected && s.promotionStatus === 'pending').length;
  const totalEligible = students.filter(
    (s) => s.clearanceStatus === 'Cleared' && s.action === 'promote' && s.promotionStatus === 'pending'
  ).length;
  const alreadyPromotedCount = students.filter((s) => s.promotionStatus === 'promoted').length;
  const pendingDuesCount = students.filter((s) => s.feeBalance > 0).length;

  return (
    <>
      {/* ========================================================= */}
      {/* 1. SCREEN VIEW (Hidden completely during Print)          */}
      {/* ========================================================= */}
      <div className="print:hidden flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
        {/* DESK SIDEBAR (Admin Office) */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
          <div>
            {/* School Crest */}
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
                  Greenwood Academy
                </h2>
                <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                  Admin Office Desk
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="p-3 space-y-1">
              <p className="px-3 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Admission & Office Desk
              </p>

              <Link
                href="/office/admission"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4 text-slate-500" />
                  <span>New Student Admission</span>
                </div>
              </Link>

              <Link
                href="/office/students"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <span>Enrolled Students</span>
                </div>
                <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {students.length}
                </span>
              </Link>

              <Link
                href="/office/fees"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <span>Fee Accounts & Counter</span>
                </div>
                <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  Term 2 Due
                </span>
              </Link>

              <Link
                href="/office/promotion"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all bg-indigo-50 text-indigo-700 shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Class Promotion & TC Desk</span>
                </div>
                <span className="text-[9px] font-bold bg-indigo-200/80 text-indigo-900 px-1.5 py-0.5 rounded">
                  AY 27
                </span>
              </Link>
            </div>
          </div>

          {/* Office Operator & Sign Out Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Admin Office Terminal</p>
                <p className="text-[10px] text-slate-500">Academic Promotion Desk</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Desk / Sign Out</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
          {/* TOP BAR */}
          <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>Transitioning: AY 2026-27 → 2027-28</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                CBSE Affiliation #1930412
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900">
                  Registrar & Academic Records Desk
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Desk #4 Online
                </div>
              </div>
            </div>
          </header>

          {/* SCROLLABLE MAIN CONTENT (BREATHING SPACE) */}
          <main className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto w-full">
            {/* HEADER SECTION & TABS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                  <Link href="/office/admission" className="hover:text-indigo-600">
                    Admin Office Portal
                  </Link>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-600 font-bold">Class Promotion & TC Desk</span>
                </div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  Academic Year Transition & Transfer Certificate Desk
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  End-of-Term "Class Grow" promotion batches and CBSE-compliant Transfer Certificate issuance
                </p>
              </div>

              {/* ACTION TOGGLES / BUTTONS */}
              <div className="flex items-center gap-2.5">
                {activeTab === 'tc' && (
                  <button
                    onClick={() => setIsGenerateTcModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Issue New CBSE TC</span>
                  </button>
                )}

                {activeTab === 'promotion' && (
                  <button
                    onClick={handleExecutePromotion}
                    disabled={isPromoting || selectedCount === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      selectedCount > 0 && !isPromoting
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isPromoting ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin text-white" />
                        <span>Promoting Batch...</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-4 h-4" />
                        <span>Promote {selectedCount} Selected Students</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex border-b border-slate-200 text-xs font-bold space-x-6">
              <button
                onClick={() => setActiveTab('promotion')}
                className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'promotion'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Annual Class Promotion ("Class Grow")</span>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                  {students.length} in Batch
                </span>
              </button>

              <button
                onClick={() => setActiveTab('tc')}
                className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'tc'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>CBSE Transfer Certificates (TC) Registry</span>
                <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                  {tcRecords.length} Issued
                </span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'audit'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Batch Promotion Audit Logs</span>
                <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                  {auditLogs.length} Committed
                </span>
              </button>
            </div>

            {/* SUCCESS BANNER WITH VERIFICATION INSTRUCTIONS */}
            {promotionSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-emerald-800 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p>{promotionSuccessMsg}</p>
                    <p className="text-[11px] text-emerald-700 font-normal mt-0.5">
                      Verify below: click the <strong>"AY 2027–28 (New Promoted Batch)"</strong> view toggle, or open the <strong>Batch Promotion Audit Logs</strong> tab.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setAcademicYearView('AY_2027_28');
                      setPromotionSuccessMsg(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs"
                  >
                    View AY 2027–28 Roster →
                  </button>
                  <button
                    onClick={() => setPromotionSuccessMsg(null)}
                    className="p-1 text-emerald-600 hover:text-emerald-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 1: ANNUAL CLASS PROMOTION BATCH                      */}
            {/* ========================================================= */}
            {activeTab === 'promotion' && (
              <div className="space-y-6">
                {/* 4 HIGH-LEVEL BATCH SUMMARY METRICS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Metric 1 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                      <span>CURRENT BATCH</span>
                      <Users className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      {students.length} Students
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-medium">
                      Class 8-B • AY 2026–27
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                      <span>PROMOTED SO FAR</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-emerald-600 tracking-tight">
                      {alreadyPromotedCount} Promoted
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                      Committed to Class 9-B
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                      <span>PENDING CLEARANCE</span>
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-black text-amber-600 tracking-tight">
                      {pendingDuesCount} Pending
                    </div>
                    <div className="text-[11px] text-amber-700 mt-1 font-medium">
                      Requires Fee / Book Clearance
                    </div>
                  </div>

                  {/* Metric 4 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                      <span>TARGET ACADEMIC YEAR</span>
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-2xl font-black text-indigo-600 tracking-tight">
                      AY 2027–28
                    </div>
                    <div className="text-[11px] text-indigo-700 mt-1 font-medium">
                      CBSE Affiliation Active
                    </div>
                  </div>
                </div>

                {/* PROMOTION CONFIGURATION CONTROLS & VERIFICATION TOGGLE */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Source Batch
                      </label>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs font-bold text-slate-900 focus:bg-white"
                      >
                        <option value="Class 8-B">Class 8-B (38 Enrolled)</option>
                        <option value="Class 8-A">Class 8-A (39 Enrolled)</option>
                        <option value="Class 9-A">Class 9-A (40 Enrolled)</option>
                        <option value="Class 10-A">Class 10-A (CBSE Board)</option>
                        <option value="Class 11-A">Class 11-A (PCM_CS)</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-5 text-slate-400">
                      <ArrowRight className="w-4 h-4" />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1">
                        Promote Into Target Grade & Sec
                      </label>
                      <select
                        value={targetBatch}
                        onChange={(e) => setTargetBatch(e.target.value)}
                        className="bg-indigo-50/70 border border-indigo-200 rounded-xl px-3.5 py-1.5 text-xs font-bold text-indigo-900 focus:bg-white"
                      >
                        <option value="Class 9-B">Class 9-B (Standard Track)</option>
                        <option value="Class 9-A">Class 9-A (Reshuffle)</option>
                        <option value="Class 9-C">Class 9-C (New Section)</option>
                      </select>
                    </div>
                  </div>

                  {/* ACADEMIC YEAR VIEW SWITCHER (VERIFICATION TOOL) */}
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-stretch md:self-center">
                    <button
                      onClick={() => setAcademicYearView('AY_2026_27')}
                      className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        academicYearView === 'AY_2026_27'
                          ? 'bg-white text-indigo-700 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      AY 2026–27 (Current Class 8-B)
                    </button>
                    <button
                      onClick={() => setAcademicYearView('AY_2027_28')}
                      className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        academicYearView === 'AY_2027_28'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <span>AY 2027–28 (Promoted Class 9-B)</span>
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                        academicYearView === 'AY_2027_28' ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {alreadyPromotedCount}
                      </span>
                    </button>
                  </div>
                </div>

                {/* STUDENTS PROMOTION ROSTER TABLE */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        {academicYearView === 'AY_2026_27'
                          ? 'Active Academic Roster — Class 8-B (AY 2026–27)'
                          : 'Promoted Roster — Class 9-B (AY 2027–28 Academic Register)'}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {academicYearView === 'AY_2026_27'
                          ? 'Select students cleared through attendance and fee dues to execute batch promotion'
                          : 'Verified promoted students officially enrolled into Class 9-B for the upcoming academic year'}
                      </p>
                    </div>

                    {academicYearView === 'AY_2026_27' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSelectAll(true)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                        >
                          Select All Cleared ({totalEligible})
                        </button>
                        <button
                          onClick={() => handleSelectAll(false)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold transition-all"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          {academicYearView === 'AY_2026_27' && (
                            <th className="py-3.5 px-4 w-10 text-center">
                              <input
                                type="checkbox"
                                checked={selectedCount === totalEligible && totalEligible > 0}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                            </th>
                          )}
                          <th className="py-3.5 px-4">Student & ID</th>
                          <th className="py-3.5 px-4">Attendance Rate</th>
                          <th className="py-3.5 px-4">Annual Exam %</th>
                          <th className="py-3.5 px-4">Fee Clearance</th>
                          <th className="py-3.5 px-4">Batch Allocation Action</th>
                          <th className="py-3.5 px-4 text-right">Target Batch / Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayedStudents.map((student) => {
                          const isEligible =
                            student.clearanceStatus === 'Cleared' &&
                            student.resultStatus === 'Passed';

                          return (
                            <tr
                              key={student.id}
                              className={`transition-colors ${
                                student.promotionStatus === 'promoted'
                                  ? 'bg-emerald-50/30 hover:bg-emerald-50/50'
                                  : student.selected
                                  ? 'bg-indigo-50/40 hover:bg-indigo-50/60'
                                  : 'hover:bg-slate-50/80'
                              }`}
                            >
                              {academicYearView === 'AY_2026_27' && (
                                <td className="py-3.5 px-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={student.selected}
                                    disabled={!isEligible || student.action !== 'promote' || student.promotionStatus === 'promoted'}
                                    onChange={() => handleToggleStudent(student.id)}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-40"
                                  />
                                </td>
                              )}

                              <td className="py-3.5 px-4">
                                <p className="font-extrabold text-slate-900 text-sm">{student.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">
                                  {student.admissionNo} • Roll #{student.promotionStatus === 'promoted' && student.newRollNo ? student.newRollNo : student.rollNo}
                                </p>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`font-bold ${
                                      student.attendanceRate >= 75
                                        ? 'text-emerald-700'
                                        : 'text-rose-600'
                                    }`}
                                  >
                                    {student.attendanceRate}%
                                  </span>
                                  {student.attendanceRate < 75 && (
                                    <span className="text-[9px] font-bold bg-rose-50 text-rose-700 px-1 py-0.5 rounded">
                                      Below 75%
                                    </span>
                                  )}
                                </div>
                                <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      student.attendanceRate >= 75
                                        ? 'bg-emerald-500'
                                        : 'bg-rose-500'
                                    }`}
                                    style={{ width: `${Math.min(student.attendanceRate, 100)}%` }}
                                  />
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="font-extrabold text-slate-900">
                                  {student.annualAverage}%
                                </span>
                                <span
                                  className={`block text-[10px] font-bold ${
                                    student.resultStatus === 'Passed'
                                      ? 'text-emerald-600'
                                      : 'text-amber-600'
                                  }`}
                                >
                                  {student.resultStatus}
                                </span>
                              </td>

                              <td className="py-3.5 px-4">
                                {student.feeBalance === 0 ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    Fee Cleared (₹0)
                                  </span>
                                ) : (
                                  <div>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                      <Clock className="w-3 h-3 text-amber-600" />
                                      Due ₹{student.feeBalance.toLocaleString('en-IN')}
                                    </span>
                                    <Link
                                      href="/office/fees"
                                      className="block text-[10px] text-indigo-600 font-bold hover:underline mt-0.5"
                                    >
                                      Pay at Counter →
                                    </Link>
                                  </div>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                {student.promotionStatus === 'promoted' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Promoted to Class 9-B</span>
                                  </span>
                                ) : (
                                  <select
                                    value={student.action}
                                    onChange={(e) =>
                                      handleActionChange(student.id, e.target.value as any)
                                    }
                                    className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition-colors ${
                                      student.action === 'promote'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                        : student.action === 'retain'
                                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                                        : 'bg-rose-50 text-rose-800 border-rose-200'
                                    }`}
                                  >
                                    <option value="promote">✓ Promote to Next Class</option>
                                    <option value="retain">⚠ Retain in Class 8 (Repeater)</option>
                                    <option value="tc_applied">📄 TC Applied / Transfer</option>
                                  </select>
                                )}
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                {student.promotionStatus === 'promoted' ? (
                                  <span className="font-mono font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-1 rounded-md text-xs border border-emerald-200">
                                    Class 9-B • AY 27-28
                                  </span>
                                ) : (
                                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md text-xs">
                                    {student.targetClass}-{student.targetSection}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 2: CBSE TRANSFER CERTIFICATE (TC) REGISTRY           */}
            {/* ========================================================= */}
            {activeTab === 'tc' && (
              <div className="space-y-6">
                {/* 3 SUMMARY CARDS FOR TC */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                      <span>TOTAL TC ISSUED (AY 26–27)</span>
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      {tcRecords.filter((r) => r.status === 'Issued').length} Certificates
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-medium">
                      All cleared through Accounts & Library
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                      <span>PENDING CLEARANCE</span>
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-black text-amber-600 tracking-tight">
                      {tcRecords.filter((r) => r.status === 'Pending Verification').length} Requests
                    </div>
                    <div className="text-[11px] text-amber-700 mt-1 font-medium">
                      Awaiting counter fee clearance
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                      <span>BOARD AFFILIATION</span>
                      <Building2 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-2xl font-black text-indigo-600 tracking-tight">
                      CBSE Affiliated
                    </div>
                    <div className="text-[11px] text-indigo-700 mt-1 font-medium">
                      School Code: 55210 • Affil: 1930412
                    </div>
                  </div>
                </div>

                {/* TC LIST TABLE */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Official Transfer Certificates Log
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Official CBSE School Leaving Certificates with security serial numbers
                      </p>
                    </div>

                    <button
                      onClick={() => setIsGenerateTcModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create New TC</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3.5 px-4">TC Serial No.</th>
                          <th className="py-3.5 px-4">Student & Parents</th>
                          <th className="py-3.5 px-4">Class Last Studied</th>
                          <th className="py-3.5 px-4">Reason for Leaving</th>
                          <th className="py-3.5 px-4">Accounts & Library Clearance</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {tcRecords.map((tc) => (
                          <tr key={tc.tcNo} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="font-mono font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60">
                                {tc.tcNo}
                              </span>
                              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                                Adm: {tc.admissionNo}
                              </p>
                            </td>

                            <td className="py-3.5 px-4">
                              <p className="font-extrabold text-slate-900 text-sm">{tc.studentName}</p>
                              <p className="text-[10px] text-slate-500">F: {tc.fatherName}</p>
                              <p className="text-[10px] text-slate-500">M: {tc.motherName}</p>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-900">{tc.classLastStudied}</span>
                              <p className="text-[10px] text-slate-500 mt-0.5">{tc.annualExamResult}</p>
                            </td>

                            <td className="py-3.5 px-4 max-w-xs">
                              <p className="text-slate-700 text-xs truncate font-medium">
                                {tc.reasonForLeaving}
                              </p>
                              <p className="text-[10px] text-slate-400">Issued: {tc.issueDate}</p>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold">
                                  {tc.accountsCleared ? (
                                    <span className="text-emerald-700 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Fees Cleared
                                    </span>
                                  ) : (
                                    <span className="text-amber-700 flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-amber-600" /> Pending Counter Fee
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold">
                                  {tc.libraryCleared ? (
                                    <span className="text-emerald-700 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Library Books Returned
                                    </span>
                                  ) : (
                                    <span className="text-rose-700 flex items-center gap-1">
                                      <X className="w-3 h-3 text-rose-600" /> Overdue Books
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  tc.status === 'Issued'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {tc.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedTcForPrint(tc)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-xs"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print Official TC</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* VIEW 3: BATCH PROMOTION AUDIT LOGS                        */}
            {/* ========================================================= */}
            {activeTab === 'audit' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Committed Batch Promotion Registry & Historical Log
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Permanent audit trails of student promotion batches, academic transitions, and roll number increments
                      </p>
                    </div>

                    <Link
                      href="/students"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all"
                    >
                      <span>Open Enrolled Student Directory →</span>
                    </Link>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">
                              {log.batchName}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              ✓ {log.promotedCount} Promoted
                            </span>
                            {log.retainedCount > 0 && (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                ⚠ {log.retainedCount} Retained
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            {log.sourceYear} → {log.targetYear} • Executed {log.executedAt} by Central Front Office Desk
                          </p>
                          <p className="text-[11px] text-slate-600 font-medium">
                            Students included: <span className="font-bold text-slate-800">{log.students.join(', ')}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setActiveTab('promotion');
                              setAcademicYearView('AY_2027_28');
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs"
                          >
                            Inspect Promoted Batch
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. GENERATE NEW TC MODAL (ERGONOMIC SCROLL & HEIGHT FIX)   */}
      {/* ========================================================= */}
      {isGenerateTcModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-hidden">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden my-auto">
            {/* FIXED MODAL HEADER */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Issue CBSE Transfer Certificate (TC)
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Mandatory CBSE Bylaw 18-point School Leaving Documentation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGenerateTcModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCROLLABLE FORM BODY */}
            <form onSubmit={handleIssueNewTC} className="flex-1 flex flex-col min-h-0">
              <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={tcStudentName}
                      onChange={(e) => setTcStudentName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Admission Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={tcAdmNo}
                      onChange={(e) => setTcAdmNo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Class Last Studied *
                    </label>
                    <input
                      type="text"
                      required
                      value={tcClass}
                      onChange={(e) => setTcClass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Father's Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={tcFather}
                      onChange={(e) => setTcFather(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Mother's Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={tcMother}
                      onChange={(e) => setTcMother(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={tcDob}
                      onChange={(e) => setTcDob(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      DOB in Words *
                    </label>
                    <input
                      type="text"
                      required
                      value={tcDobWords}
                      onChange={(e) => setTcDobWords(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">
                      Reason for Leaving *
                    </label>
                    <input
                      type="text"
                      required
                      value={tcReason}
                      onChange={(e) => setTcReason(e.target.value)}
                      placeholder="e.g. Parent Relocation / Transfer to another city"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-slate-700 font-bold mb-1">
                      General Conduct
                    </label>
                    <select
                      value={tcConduct}
                      onChange={(e) => setTcConduct(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:bg-white"
                    >
                      <option value="Good / Exemplary">Good / Exemplary</option>
                      <option value="Good">Good</option>
                      <option value="Satisfactory">Satisfactory</option>
                    </select>
                  </div>
                </div>

                {/* Clearance Check confirmation */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Front Office Verification Ready</span>
                  </div>
                  <p className="text-emerald-700 font-medium">
                    Submitting assigns a permanent security serial and enables high-resolution official printing with CBSE bylaws.
                  </p>
                </div>
              </div>

              {/* FIXED MODAL FOOTER */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/60 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsGenerateTcModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors"
                >
                  Issue & Preview Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. OFFICIAL CBSE TRANSFER CERTIFICATE PRINT MODAL & SHEET  */}
      {/* ========================================================= */}
      {selectedTcForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-fadeIn overflow-hidden">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
            {/* Modal Controls (Hidden in Print) */}
            <div className="print:hidden p-3.5 sm:p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <span className="font-extrabold text-sm text-slate-900">
                  Official CBSE Transfer Certificate Preview — {selectedTcForPrint.tcNo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => setSelectedTcForPrint(null)}
                  className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE CBSE PRINTABLE SHEET CONTENT */}
            <div className="overflow-y-auto flex-1 p-6 sm:p-10 text-slate-900 bg-white font-serif leading-relaxed relative print:p-0 print:overflow-visible">
              {/* SUBTLE AUTHENTIC BACKGROUND WATERMARK (Does NOT obscure text!) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-[0.035]">
                <Building2 className="w-64 h-64 text-slate-900" strokeWidth={1} />
                <span className="text-4xl font-black font-sans uppercase tracking-[0.25em] text-slate-900 mt-2">
                  GREENWOOD ACADEMY
                </span>
                <span className="text-xs font-sans tracking-widest text-slate-700 mt-1 uppercase">
                  CBSE Affiliation #1930412
                </span>
              </div>

              {/* CBSE HEADER */}
              <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                <p className="text-[11px] font-sans font-bold tracking-widest uppercase text-slate-500">
                  Central Board of Secondary Education, New Delhi (CBSE)
                </p>
                <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 mt-1">
                  GREENWOOD ACADEMY
                </h1>
                <p className="text-xs font-sans font-semibold text-slate-600 mt-0.5">
                  CBSE Affiliation No: 1930412 &nbsp;|&nbsp; School Code: 55210
                </p>
                <p className="text-[11px] font-sans text-slate-500">
                  Sector 4, Green Valley Enclave, Chennai, Tamil Nadu – 600042
                </p>
                <div className="mt-3 inline-block border-2 border-slate-900 px-4 py-1 text-xs font-sans font-black tracking-widest uppercase">
                  TRANSFER CERTIFICATE
                </div>
              </div>

              {/* BOOK NO & SERIAL NO */}
              <div className="flex items-center justify-between text-xs font-sans font-bold mb-4 pb-2 border-b border-dashed border-slate-300">
                <div>
                  <span className="text-slate-500">Book No:</span> <span>04/2027</span>
                </div>
                <div>
                  <span className="text-slate-500">Sl. No:</span>{' '}
                  <span className="font-mono text-indigo-900">{selectedTcForPrint.tcNo}</span>
                </div>
                <div>
                  <span className="text-slate-500">Admission No:</span>{' '}
                  <span className="font-mono">{selectedTcForPrint.admissionNo}</span>
                </div>
              </div>

              {/* 18 MANDATORY CBSE CLAUSES */}
              <div className="space-y-2.5 text-xs">
                <div className="flex">
                  <span className="w-8 font-bold font-sans">1.</span>
                  <span className="w-64 font-sans text-slate-600">Name of the Pupil:</span>
                  <span className="flex-1 font-bold uppercase underline tracking-wide">
                    {selectedTcForPrint.studentName}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">2.</span>
                  <span className="w-64 font-sans text-slate-600">Mother's Name:</span>
                  <span className="flex-1 font-semibold">{selectedTcForPrint.motherName}</span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">3.</span>
                  <span className="w-64 font-sans text-slate-600">Father's / Guardian's Name:</span>
                  <span className="flex-1 font-semibold">{selectedTcForPrint.fatherName}</span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">4.</span>
                  <span className="w-64 font-sans text-slate-600">Nationality:</span>
                  <span className="flex-1 font-semibold">Indian</span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">5.</span>
                  <span className="w-64 font-sans text-slate-600">Whether candidate belongs to SC / ST / OBC:</span>
                  <span className="flex-1 font-semibold">General / Open Merit</span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">6.</span>
                  <span className="w-64 font-sans text-slate-600">Date of first admission in the school:</span>
                  <span className="flex-1 font-semibold">12-06-2022 in Class IV (Fourth)</span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">7.</span>
                  <span className="w-64 font-sans text-slate-600">Date of Birth (in Christian Era):</span>
                  <div className="flex-1">
                    <span className="font-bold">{selectedTcForPrint.dob}</span>
                    <p className="text-[11px] italic text-slate-600">
                      (in words): {selectedTcForPrint.dobWords}
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">8.</span>
                  <span className="w-64 font-sans text-slate-600">Class in which pupil last studied:</span>
                  <span className="flex-1 font-bold">
                    {selectedTcForPrint.classLastStudied} ({selectedTcForPrint.classInWords})
                  </span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">9.</span>
                  <span className="w-64 font-sans text-slate-600">School / Board Annual Exam last taken:</span>
                  <span className="flex-1 font-semibold">{selectedTcForPrint.annualExamResult}</span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">10.</span>
                  <span className="w-64 font-sans text-slate-600">Whether failed, if so once/twice in same class:</span>
                  <span className="flex-1 font-semibold">No</span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">11.</span>
                  <span className="w-64 font-sans text-slate-600">Subjects Studied:</span>
                  <span className="flex-1 font-semibold text-[11px]">
                    1. English Core &nbsp; 2. Mathematics &nbsp; 3. Science & Tech &nbsp; 4. Social Science &nbsp; 5. Hindi / Tamil &nbsp; 6. AI & Computers
                  </span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">12.</span>
                  <span className="w-64 font-sans text-slate-600">Whether qualified for promotion to higher class:</span>
                  <span className="flex-1 font-bold text-emerald-800">
                    {selectedTcForPrint.qualifiedForPromotion}
                  </span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">13.</span>
                  <span className="w-64 font-sans text-slate-600">Month up to which school dues have been paid:</span>
                  <span className="flex-1 font-semibold">{selectedTcForPrint.feePaidUpto}</span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">14.</span>
                  <span className="w-64 font-sans text-slate-600">Total No. of working days & present:</span>
                  <span className="flex-1 font-semibold">
                    {selectedTcForPrint.daysPresent} days present out of {selectedTcForPrint.totalWorkingDays} working days ({Math.round((selectedTcForPrint.daysPresent / selectedTcForPrint.totalWorkingDays) * 100)}%)
                  </span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">15.</span>
                  <span className="w-64 font-sans text-slate-600">General Conduct:</span>
                  <span className="flex-1 font-bold text-slate-900">{selectedTcForPrint.conduct}</span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">16.</span>
                  <span className="w-64 font-sans text-slate-600">Date of application for certificate:</span>
                  <span className="flex-1 font-semibold">{selectedTcForPrint.issueDate}</span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">17.</span>
                  <span className="w-64 font-sans text-slate-600">Date of issue of certificate:</span>
                  <span className="flex-1 font-bold">{selectedTcForPrint.issueDate}</span>
                </div>

                <div className="flex">
                  <span className="w-8 font-bold font-sans">18.</span>
                  <span className="w-64 font-sans text-slate-600">Reason for leaving the school:</span>
                  <span className="flex-1 font-bold text-slate-900 underline">
                    {selectedTcForPrint.reasonForLeaving}
                  </span>
                </div>
              </div>

              {/* THREE CBSE STATUTORY SIGNATURE BOXES */}
              <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs font-sans font-bold">
                <div>
                  <div className="h-10 border-b border-dotted border-slate-400 mb-1 flex items-end justify-center pb-1">
                    <span className="text-[10px] text-slate-400 italic">Signature</span>
                  </div>
                  <p className="text-slate-800">Class Teacher</p>
                  <p className="text-[10px] text-slate-400 font-normal">Prepared by</p>
                </div>

                <div>
                  <div className="h-10 border-b border-dotted border-slate-400 mb-1 flex items-end justify-center pb-1">
                    <span className="text-[10px] text-slate-400 italic">Verified Stamp</span>
                  </div>
                  <p className="text-slate-800">Office Superintendent</p>
                  <p className="text-[10px] text-slate-400 font-normal">Checked by</p>
                </div>

                <div>
                  <div className="h-10 border-b border-dotted border-slate-400 mb-1 flex items-end justify-center pb-1">
                    <span className="text-[11px] font-serif font-extrabold text-indigo-900">Dr. M. Sundaram</span>
                  </div>
                  <p className="text-slate-900 font-black">Principal</p>
                  <p className="text-[10px] text-slate-500 font-normal">Counter Signed & School Seal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
