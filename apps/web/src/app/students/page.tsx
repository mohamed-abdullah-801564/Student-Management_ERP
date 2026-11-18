'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { NumberTicker } from '@/components/ui/number-ticker';
import { supabase } from '@/lib/supabase';
import {
  GraduationCap,
  Users,
  Search,
  Filter,
  UserPlus,
  Download,
  Phone,
  Mail,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface StudentRecord {
  id: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  className: string;
  section: string;
  gender: 'Male' | 'Female';
  parentName: string;
  parentPhone: string;
  feeStatus: 'Paid' | 'Partial' | 'Pending';
  attendanceRate: number;
  initials: string;
  avatarBg: string;
}

const MOCK_STUDENTS_LIST: StudentRecord[] = [
  {
    id: '1',
    admissionNo: 'GW-2022-8192',
    rollNo: '8B01',
    name: 'Aakash Raman',
    className: 'Class 8',
    section: 'B',
    gender: 'Male',
    parentName: 'Mr. Ramanathan K.',
    parentPhone: '+91 98401 23411',
    feeStatus: 'Paid',
    attendanceRate: 96.5,
    initials: 'AR',
    avatarBg: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: '2',
    admissionNo: 'GW-2022-8193',
    rollNo: '8B02',
    name: 'Ananya Sri',
    className: 'Class 8',
    section: 'B',
    gender: 'Female',
    parentName: 'Mrs. Sridevi V.',
    parentPhone: '+91 98402 77123',
    feeStatus: 'Paid',
    attendanceRate: 98.0,
    initials: 'AS',
    avatarBg: 'bg-rose-100 text-rose-700',
  },
  {
    id: '3',
    admissionNo: 'GW-2022-8194',
    rollNo: '8B03',
    name: 'Bhuvanesh K.',
    className: 'Class 8',
    section: 'B',
    gender: 'Male',
    parentName: 'Mr. Karthik Raja',
    parentPhone: '+91 98403 99881',
    feeStatus: 'Paid',
    attendanceRate: 99.2,
    initials: 'BK',
    avatarBg: 'bg-amber-100 text-amber-800',
  },
  {
    id: '4',
    admissionNo: 'GW-2022-8195',
    rollNo: '8B04',
    name: 'Dinesh Kumar',
    className: 'Class 8',
    section: 'B',
    gender: 'Male',
    parentName: 'Mr. Kumaresan P.',
    parentPhone: '+91 98404 12345',
    feeStatus: 'Partial',
    attendanceRate: 88.4,
    initials: 'DK',
    avatarBg: 'bg-slate-100 text-slate-700',
  },
  {
    id: '5',
    admissionNo: 'GW-2020-5512',
    rollNo: '12CS04',
    name: 'Adithya Narayanan',
    className: 'Class 12',
    section: 'A',
    gender: 'Male',
    parentName: 'Dr. Narayanan S.',
    parentPhone: '+91 98405 88219',
    feeStatus: 'Paid',
    attendanceRate: 97.8,
    initials: 'AN',
    avatarBg: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: '6',
    admissionNo: 'GW-2020-6218',
    rollNo: '12BM02',
    name: 'Kavitha Ranganathan',
    className: 'Class 12',
    section: 'B',
    gender: 'Female',
    parentName: 'Mr. Ranganathan M.',
    parentPhone: '+91 98406 43210',
    feeStatus: 'Paid',
    attendanceRate: 98.4,
    initials: 'KR',
    avatarBg: 'bg-purple-100 text-purple-700',
  },
  {
    id: '7',
    admissionNo: 'GW-2022-7419',
    rollNo: '10A03',
    name: 'Rahul Suresh',
    className: 'Class 8',
    section: 'B',
    gender: 'Male',
    parentName: 'Mr. Suresh Kumar',
    parentPhone: '+91 98401 23456',
    feeStatus: 'Paid',
    attendanceRate: 94.2,
    initials: 'RS',
    avatarBg: 'bg-blue-100 text-blue-700',
  },
  {
    id: '8',
    admissionNo: 'GW-2024-9102',
    rollNo: '4A12',
    name: 'Priya Suresh',
    className: 'Class 4',
    section: 'A',
    gender: 'Female',
    parentName: 'Mr. Suresh Kumar',
    parentPhone: '+91 98401 23456',
    feeStatus: 'Paid',
    attendanceRate: 96.0,
    initials: 'PS',
    avatarBg: 'bg-pink-100 text-pink-700',
  },
];

export default function StudentsDirectoryPage() {
  const [students, setStudents] = useState<StudentRecord[]>(MOCK_STUDENTS_LIST);
  const [loadingDb, setLoadingDb] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedFeeFilter, setSelectedFeeFilter] = useState('ALL');

  useEffect(() => {
    async function loadStudentsFromSupabase() {
      try {
        setLoadingDb(true);
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: StudentRecord[] = data.map((st: any, idx: number) => ({
            id: st.id,
            admissionNo: st.admission_no || `GW-2026-${st.roll_no || idx + 1}`,
            rollNo: st.roll_no ? `8B${st.roll_no}` : '8B01',
            name: `${st.first_name || ''} ${st.last_name || ''}`.trim() || 'Student Scholar',
            className: 'Class 8',
            section: 'B',
            gender: st.gender === 'Female' ? 'Female' : 'Male',
            parentName: 'Parent / Guardian',
            parentPhone: '+91 98401 00000',
            feeStatus: (st.fee_status === 'Cleared' || st.fee_status === 'Paid') ? 'Paid' : 'Pending',
            attendanceRate: 96.0,
            initials: `${(st.first_name || 'S')[0]}${(st.last_name || 'S')[0]}`,
            avatarBg: idx % 2 === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-800',
          }));
          setStudents(mapped);
        }
      } catch (err) {
        console.log('Using default mock student roster:', err);
      } finally {
        setLoadingDb(false);
      }
    }

    loadStudentsFromSupabase();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      selectedClass === 'ALL' || student.className === selectedClass;

    const matchesFee =
      selectedFeeFilter === 'ALL' || student.feeStatus === selectedFeeFilter;

    return matchesSearch && matchesClass && matchesFee;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onPublishNotice={() => {}} />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* TOP BANNER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Central Student & Admissions Registry
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Students & Admissions Directory
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete student records across Nursery through Class 12 • AY 2026-2027
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/office/admission"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-indigo-300 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ New Admission</span>
              </Link>

              <button
                onClick={() => alert('CBSE General Registry export initiated.')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* KPI STATS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                TOTAL ENROLLED
              </p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                <NumberTicker value={1420} />
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                ● 100% Capacity
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                BOYS
              </p>
              <p className="text-xl font-extrabold text-indigo-700 mt-1">
                <NumberTicker value={748} />
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">52.7% of total</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                GIRLS
              </p>
              <p className="text-xl font-extrabold text-rose-600 mt-1">
                <NumberTicker value={672} />
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">47.3% of total</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                NEW ADMISSIONS
              </p>
              <p className="text-xl font-extrabold text-emerald-600 mt-1">
                <NumberTicker value={142} />
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">This term</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                RTE QUOTA SEATS
              </p>
              <p className="text-xl font-extrabold text-amber-600 mt-1">
                <NumberTicker value={35} />
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Govt. compliant</p>
            </div>
          </div>

          {/* FILTER & SEARCH BAR */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by student, roll #, adm #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-semibold"
              >
                <option value="ALL">All Classes (Nursery - 12)</option>
                <option value="Class 12">Class 12</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 4">Class 4</option>
              </select>

              <select
                value={selectedFeeFilter}
                onChange={(e) => setSelectedFeeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-semibold"
              >
                <option value="ALL">All Fee Status</option>
                <option value="Paid">Fee Paid</option>
                <option value="Partial">Partial Due</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* STUDENTS TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Admission #</th>
                    <th className="py-3.5 px-4">Class & Sec</th>
                    <th className="py-3.5 px-4">Parent / Contact</th>
                    <th className="py-3.5 px-4">Attendance</th>
                    <th className="py-3.5 px-4">Fee Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${student.avatarBg}`}
                          >
                            {student.initials}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">{student.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Roll: {student.rollNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">
                        {student.admissionNo}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">{student.className}</span>
                        <span className="text-slate-400"> - {student.section}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{student.parentName}</p>
                        <p className="text-[10px] text-slate-400">{student.parentPhone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${student.attendanceRate}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-700">{student.attendanceRate}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {student.feeStatus === 'Paid' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Paid
                          </span>
                        )}
                        {student.feeStatus === 'Partial' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Partial Due
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/students/${student.id}`}
                          className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 text-[11px]"
                        >
                          <span>View Bio-Data →</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
