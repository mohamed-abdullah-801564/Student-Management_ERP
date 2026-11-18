'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
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
  Award,
} from 'lucide-react';

interface StudentFeeRecord {
  id: string;
  admissionId: string;
  studentName: string;
  gradeSection: string;
  parentName: string;
  parentPhone: string;
  plan: string;
  busRoute: string | null;
  totalAnnual: number;
  term1Status: 'paid';
  term1Receipt: string;
  term2Status: 'paid' | 'pending';
  term2Receipt?: string;
  term2Amount: number;
  term2DueDate: string;
  term3Status: 'upcoming';
  term3Amount: number;
  outstandingDue: number;
}

const INITIAL_RECORDS: StudentFeeRecord[] = [
  {
    id: 's1',
    admissionId: 'GW-2026-0842',
    studentName: 'Rahul Suresh',
    gradeSection: 'Class 8-B',
    parentName: 'Mr. Suresh Kumar',
    parentPhone: '+91 98402 11920',
    plan: '3 Equal Terms',
    busRoute: 'School Bus Route #12 (Anna Nagar)',
    totalAnnual: 116500,
    term1Status: 'paid',
    term1Receipt: 'GW-REC-2026-0842',
    term2Status: 'pending',
    term2Amount: 38833,
    term2DueDate: '15 Oct 2026',
    term3Status: 'upcoming',
    term3Amount: 38833,
    outstandingDue: 38833,
  },
  {
    id: 's2',
    admissionId: 'GW-2026-1049',
    studentName: 'Priya Sundaram',
    gradeSection: 'Class 11-A (PCM_CS)',
    parentName: 'Dr. M. Sundaram',
    parentPhone: '+91 94440 28190',
    plan: '3 Equal Terms',
    busRoute: 'School Bus Route #4 (Kilpauk)',
    totalAnnual: 116500,
    term1Status: 'paid',
    term1Receipt: 'GW-REC-2026-1049',
    term2Status: 'paid',
    term2Receipt: 'GW-REC-2026-2180',
    term2Amount: 38833,
    term2DueDate: '15 Oct 2026',
    term3Status: 'upcoming',
    term3Amount: 38833,
    outstandingDue: 0,
  },
  {
    id: 's3',
    admissionId: 'GW-2026-0412',
    studentName: 'Harish Kalyan',
    gradeSection: 'Class 9-C',
    parentName: 'Dr. M. Kalyan',
    parentPhone: '+91 98840 99120',
    plan: '3 Equal Terms',
    busRoute: null,
    totalAnnual: 94500,
    term1Status: 'paid',
    term1Receipt: 'GW-REC-2026-0412',
    term2Status: 'pending',
    term2Amount: 31500,
    term2DueDate: '15 Oct 2026',
    term3Status: 'upcoming',
    term3Amount: 31500,
    outstandingDue: 31500,
  },
  {
    id: 's4',
    admissionId: 'GW-2026-0982',
    studentName: 'Ananya Deshmukh',
    gradeSection: 'Class 8-B',
    parentName: 'Mrs. Sangeetha Deshmukh',
    parentPhone: '+91 97100 48211',
    plan: '3 Equal Terms',
    busRoute: 'School Bus Route #12 (Anna Nagar)',
    totalAnnual: 116500,
    term1Status: 'paid',
    term1Receipt: 'GW-REC-2026-0982',
    term2Status: 'pending',
    term2Amount: 38833,
    term2DueDate: '15 Oct 2026',
    term3Status: 'upcoming',
    term3Amount: 38833,
    outstandingDue: 38833,
  },
  {
    id: 's5',
    admissionId: 'GW-2026-1188',
    studentName: 'Karthik Raja',
    gradeSection: 'Class 12-A',
    parentName: 'Mr. Raja Ram',
    parentPhone: '+91 98410 77290',
    plan: 'Annual (5% Paid upfront)',
    busRoute: 'School Bus Route #2 (Mylapore)',
    totalAnnual: 110675,
    term1Status: 'paid',
    term1Receipt: 'GW-REC-2026-1188',
    term2Status: 'paid',
    term2Receipt: 'GW-REC-2026-1188',
    term2Amount: 0,
    term2DueDate: 'Settled',
    term3Status: 'upcoming',
    term3Amount: 0,
    outstandingDue: 0,
  },
];

export default function FeeAccountsManagementPage() {
  const [records, setRecords] = useState<StudentFeeRecord[]>(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals State
  const [paymentModalRecord, setPaymentModalRecord] = useState<StudentFeeRecord | null>(null);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Cheque' | 'NEFT' | 'POS'>('Cash');
  const [chequeRef, setChequeRef] = useState('');
  const [cashierDesk, setCashierDesk] = useState('Counter #2 (Mrs. Kamala)');

  const [receiptModalData, setReceiptModalData] = useState<{
    record: StudentFeeRecord;
    receiptNo: string;
    amount: number;
    mode: string;
    date: string;
  } | null>(null);

  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [noticeSentSuccess, setNoticeSentSuccess] = useState(false);

  // Filter Logic
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.admissionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.parentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      classFilter === 'ALL' || r.gradeSection.includes(classFilter);

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PENDING' && r.term2Status === 'pending') ||
      (statusFilter === 'PAID' && r.term2Status === 'paid');

    return matchesSearch && matchesClass && matchesStatus;
  });

  const pendingCount = records.filter((r) => r.term2Status === 'pending').length;

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalRecord) return;

    const newReceiptNo = `GW-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const settledAmount = paymentModalRecord.term2Amount;

    // Update in local state
    setRecords((prev) =>
      prev.map((item) =>
        item.id === paymentModalRecord.id
          ? {
              ...item,
              term2Status: 'paid',
              term2Receipt: newReceiptNo,
              outstandingDue: 0,
            }
          : item
      )
    );

    // Open receipt modal
    setReceiptModalData({
      record: paymentModalRecord,
      receiptNo: newReceiptNo,
      amount: settledAmount,
      mode: `${paymentMode} ${chequeRef ? `(Ref: ${chequeRef})` : ''} - ${cashierDesk}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });

    setPaymentModalRecord(null);
    setChequeRef('');
  };

  const handleBroadcastNotice = (e: React.FormEvent) => {
    e.preventDefault();
    setNoticeSentSuccess(true);
    setTimeout(() => {
      setNoticeSentSuccess(false);
      setIsBroadcastModalOpen(false);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* ========================================================= */}
      {/* DESK SIDEBAR (Admin Office Desk - Same as Admission Desk)  */}
      {/* ========================================================= */}
      <aside className="print:hidden w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
        <div>
          {/* School Crest */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-slate-900 tracking-tight">
                Greenwood Academy
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
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
              href="/students"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-slate-500" />
                <span>Enrolled Students</span>
              </div>
              <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                1,420
              </span>
            </Link>

            <Link
              href="/office/fees"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all bg-indigo-50 text-indigo-700 shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Fee Accounts & Counter</span>
              </div>
              <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                Term 2 Due
              </span>
            </Link>

            <Link
              href="/office/promotion"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-slate-500" />
                <span>Class Promotion & TC</span>
              </div>
              <span className="text-[9px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                AY 27
              </span>
            </Link>
          </div>
        </div>

        {/* Footer Link to Principal View */}
        <div className="p-4 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <span>Executive Principal View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTAINER WITH HEADER & BREATHING SPACE               */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        {/* TOP BAR */}
        <header className="print:hidden h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Academic Year 2026-2027</span>
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
                Front Office Accounts Desk
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Counter #2 Active
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT (GENEROUS PADDING & BREATHING SPACE) */}
        <main className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto w-full">
          {/* HEADER SECTION */}
          <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                <Link href="/office/admission" className="hover:text-indigo-600">
                  Admin Office Portal
                </Link>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-600 font-bold">Fee Accounts & Collection</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Fee Accounts & Counter Collection Desk
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Term 2 Billing Cycle (AY 2026–27) • Central Accounts Registry & Cashier Counter
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsBroadcastModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-all shadow-xs"
              >
                <Bell className="w-4 h-4 text-amber-600" />
                <span>Broadcast Fee Notice & SMS</span>
              </button>

              <button
                onClick={() => setPaymentModalRecord(records[0])}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
              >
                <Plus className="w-4 h-4" />
                <span>Record Counter Payment</span>
              </button>
            </div>
          </div>

          {/* 4 HIGH-LEVEL KPI METRICS */}
          <div className="print:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                <span>ANNUAL RECEIVABLES</span>
                <Building2 className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                ₹16.54 Cr
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                1,420 Enrolled Students • CBSE
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                <span>TERM 1 COLLECTION</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600 tracking-tight">
                100% Cleared
              </div>
              <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                ₹5.51 Cr collected at admission
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                <span>TERM 2 COLLECTION</span>
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-indigo-600 tracking-tight">
                84.2% Collected
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                Due Date: October 15, 2026
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                <span>PENDING ACCOUNTS</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-rose-600 tracking-tight">
                {pendingCount} Pending
              </div>
              <div className="text-[11px] text-rose-700 mt-1 font-medium">
                ₹{(pendingCount * 38833).toLocaleString('en-IN')} pending at counter
              </div>
            </div>
          </div>

          {/* FILTER & SEARCH CONTROL BAR */}
          <div className="print:hidden flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search student, parent, or ID (GW-2026-...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Classes</option>
                <option value="Class 8-B">Class 8-B</option>
                <option value="Class 9-C">Class 9-C</option>
                <option value="Class 11-A">Class 11-A</option>
                <option value="Class 12-A">Class 12-A</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Term 2 Pending</option>
                <option value="PAID">Term 2 Settled</option>
              </select>
            </div>
          </div>

          {/* STUDENT FEE REGISTRY TABLE */}
          <div className="print:hidden bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Student & Civil ID</th>
                    <th className="py-3 px-4">Grade & Stream</th>
                    <th className="py-3 px-4">Fee Structure</th>
                    <th className="py-3 px-4">Term 1</th>
                    <th className="py-3 px-4">Term 2 (Oct 15)</th>
                    <th className="py-3 px-4">Term 3</th>
                    <th className="py-3 px-4 text-right">Balance Due</th>
                    <th className="py-3 px-4 text-center">Cashier Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Student */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {r.studentName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{r.studentName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {r.admissionId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{r.gradeSection}</div>
                        <div className="text-[10px] text-slate-400">{r.parentName}</div>
                      </td>

                      {/* Fee Plan */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-700">{r.plan}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          {r.busRoute ? (
                            <>
                              <Bus className="w-3 h-3 text-indigo-500" />
                              <span>Bus Opted</span>
                            </>
                          ) : (
                            <span>Own Transport</span>
                          )}
                        </div>
                      </td>

                      {/* Term 1 */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          <Check className="w-3 h-3" /> Paid
                        </span>
                        <div className="text-[9.5px] text-slate-400 mt-0.5">
                          {r.term1Receipt}
                        </div>
                      </td>

                      {/* Term 2 */}
                      <td className="py-3.5 px-4">
                        {r.term2Status === 'paid' ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                              <Check className="w-3 h-3" /> Paid
                            </span>
                            <div className="text-[9.5px] text-slate-400 mt-0.5">
                              {r.term2Receipt}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold">
                              <Clock className="w-3 h-3" /> Due ₹{r.term2Amount.toLocaleString('en-IN')}
                            </span>
                            <div className="text-[9.5px] text-slate-400 mt-0.5">
                              Due {r.term2DueDate}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Term 3 */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-medium">
                          Upcoming
                        </span>
                        <div className="text-[9.5px] text-slate-400 mt-0.5">Jan 2027</div>
                      </td>

                      {/* Balance Due */}
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`font-black ${
                            r.outstandingDue > 0 ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          ₹{r.outstandingDue.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Cashier Action */}
                      <td className="py-3.5 px-4 text-center">
                        {r.term2Status === 'pending' ? (
                          <button
                            onClick={() => setPaymentModalRecord(r)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-all shadow-xs"
                          >
                            Collect at Counter
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setReceiptModalData({
                                record: r,
                                receiptNo: r.term2Receipt || r.term1Receipt,
                                amount: r.term2Amount || 38834,
                                mode: 'Counter Collection Desk #2',
                                date: '14 Sep 2026',
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-all"
                          >
                            View Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: RECORD MANUAL COUNTER PAYMENT                   */}
      {/* ========================================================= */}
      {paymentModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Record Manual Counter Payment
                </h3>
                <p className="text-xs text-slate-500">
                  {paymentModalRecord.studentName} • {paymentModalRecord.admissionId}
                </p>
              </div>
              <button
                onClick={() => setPaymentModalRecord(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
              {/* Payment Summary Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase">
                    Installment Sinking
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">
                    Term 2 Academic & Transport Installment
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Total Payable</div>
                  <div className="text-lg font-black text-indigo-600">
                    ₹{paymentModalRecord.term2Amount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Payment Method *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Cash', 'Cheque', 'NEFT', 'POS'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        paymentMode === mode
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {mode === 'POS' ? 'Card POS' : mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cheque / UTR / Reference */}
              {paymentMode !== 'Cash' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {paymentMode === 'Cheque'
                      ? 'Cheque / DD Number & Bank *'
                      : paymentMode === 'NEFT'
                      ? 'NEFT / IMPS UTR Reference Number *'
                      : 'POS Card Authorization Code *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      paymentMode === 'Cheque'
                        ? 'e.g. HDFC Chq #892104 (Anna Nagar Br.)'
                        : 'e.g. UTR / Trans ID 2026101482910'
                    }
                    value={chequeRef}
                    onChange={(e) => setChequeRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Cashier Desk Operator */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cashier Desk / Counter *
                </label>
                <select
                  value={cashierDesk}
                  onChange={(e) => setCashierDesk(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Counter #2 (Mrs. Kamala)">
                    Counter #2 (Mrs. Kamala - Main Office)
                  </option>
                  <option value="Counter #1 (Mr. Ramesh)">
                    Counter #1 (Mr. Ramesh - Front Gate)
                  </option>
                  <option value="Central Trust Account (NEFT Direct)">
                    Central Trust Account (NEFT Direct)
                  </option>
                </select>
              </div>

              {/* Notice */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Confirming this transaction will instantly issue an official receipt
                  and update the Parent Mobile App to <strong>PAID ✓</strong>.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalRecord(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-200"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: OFFICIAL PRINTABLE RECEIPT                       */}
      {/* ========================================================= */}
      {receiptModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            {/* Action Bar (Print Hidden) */}
            <div className="print:hidden flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                Official Digital Receipt Generated ✓
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setReceiptModalData(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Paper */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              {/* Crest */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Greenwood Academy
                  </h2>
                  <p className="text-[10px] text-slate-500 font-medium">
                    CBSE Affiliation #1930412 • Anna Nagar West, Chennai - 600020
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-indigo-700">
                    {receiptModalData.receiptNo}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Date: {receiptModalData.date}
                  </div>
                </div>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Student Name: </span>
                  <span className="font-bold text-slate-900">
                    {receiptModalData.record.studentName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Admission ID: </span>
                  <span className="font-bold text-slate-900">
                    {receiptModalData.record.admissionId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Grade / Batch: </span>
                  <span className="font-bold text-slate-900">
                    {receiptModalData.record.gradeSection}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Parent Contact: </span>
                  <span className="font-bold text-slate-900">
                    {receiptModalData.record.parentPhone}
                  </span>
                </div>
              </div>

              {/* Line Items */}
              <table className="w-full text-xs text-left border-t border-b border-slate-200 my-2 py-2">
                <thead>
                  <tr className="text-[10px] text-slate-400 uppercase">
                    <th className="py-1">Description</th>
                    <th className="py-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-1.5 text-slate-700">Tuition Fee (Term 2)</td>
                    <td className="py-1.5 text-right font-bold text-slate-900">
                      ₹24,000
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-slate-700">
                      Science & Technology Composite Fund
                    </td>
                    <td className="py-1.5 text-right font-bold text-slate-900">
                      ₹4,833
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-slate-700">
                      Sports, Campus & Library Tech Fund
                    </td>
                    <td className="py-1.5 text-right font-bold text-slate-900">
                      ₹2,667
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-slate-700">
                      School GPS Transport Route #12
                    </td>
                    <td className="py-1.5 text-right font-bold text-slate-900">
                      ₹7,333
                    </td>
                  </tr>
                  <tr className="border-t border-slate-300 font-black text-slate-900">
                    <td className="py-2 text-sm">Total Amount Settled</td>
                    <td className="py-2 text-right text-sm text-emerald-600">
                      ₹{receiptModalData.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Mode & Seal */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <div>
                  <span className="text-slate-400">Payment Mode: </span>
                  <span className="font-semibold text-slate-800">
                    {receiptModalData.mode}
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  OFFICIAL RECEIPT SEAL ✓
                </div>
              </div>
            </div>

            {/* Print Hidden Done Button */}
            <div className="print:hidden flex justify-end pt-4">
              <button
                onClick={() => setReceiptModalData(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: BROADCAST FEE NOTICE & PUSH NOTIFICATION        */}
      {/* ========================================================= */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">
                  Broadcast Term 2 Fee Notice
                </h3>
              </div>
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {noticeSentSuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Notice Dispatched Successfully!
                </h4>
                <p className="text-xs text-slate-500">
                  Push notification delivered to 225 active parent devices & SMS sent.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBroadcastNotice} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Audience
                  </label>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    Parents with Term 2 Outstanding Due ({pendingCount} Parents)
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Push Notification Headline
                  </label>
                  <input
                    type="text"
                    defaultValue="Greenwood Academy: Term 2 Fee Notice"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Message Body
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Dear Parent, Term 2 academic installment for AY 2026–27 is due on Oct 15, 2026. Please settle via Counter #2 or Bank NEFT. View invoice in your school app."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Will trigger instant notification banner on parent Android mobile devices.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBroadcastModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Push & SMS Notice</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
