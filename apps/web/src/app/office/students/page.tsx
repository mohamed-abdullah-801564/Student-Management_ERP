'use client';

import React, { useState, useEffect } from 'react';
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
  UserPlus,
  CreditCard,
  Award,
  GraduationCap,
  Users,
  LogOut,
  RefreshCw,
  Phone,
  Mail,
  Bus,
  ShieldCheck,
  ChevronRight,
  Download,
} from 'lucide-react';

interface OfficeStudentRecord {
  id: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  gradeSection: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  feeStatus: string;
  status: string;
  admissionDate: string;
  transportMode: string | null;
  busRouteNo: string | null;
}

export default function OfficeStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<OfficeStudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState('ALL');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          admission_no,
          roll_no,
          first_name,
          last_name,
          stream,
          status,
          fee_status,
          admission_date,
          transport_mode,
          bus_route_no,
          parents_guardians (
            father_name,
            mother_name,
            father_phone,
            primary_email
          )
        `)
        .order('admission_no', { ascending: true });

      if (data && data.length > 0) {
        const mapped: OfficeStudentRecord[] = data.map((s: any) => {
          const parent = Array.isArray(s.parents_guardians)
            ? s.parents_guardians[0]
            : s.parents_guardians;

          return {
            id: s.id,
            admissionNo: s.admission_no || 'GW-2026-0000',
            rollNo: s.roll_no || '01',
            name: `${s.first_name || ''} ${s.last_name || ''}`.trim(),
            gradeSection: s.stream || 'General Secondary',
            parentName: parent?.father_name || parent?.mother_name || 'Parent Guardian',
            parentPhone: parent?.father_phone || '+91 98401 00000',
            parentEmail: parent?.primary_email || '',
            feeStatus: s.fee_status || 'Pending',
            status: s.status || 'Active',
            admissionDate: s.admission_date || '2026-07-14',
            transportMode: s.transport_mode,
            busRouteNo: s.bus_route_no,
          };
        });
        setStudents(mapped);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      selectedClass === 'ALL' || s.gradeSection.includes(selectedClass);

    const matchesFee =
      selectedFeeStatus === 'ALL' ||
      (selectedFeeStatus === 'CLEARED' && s.feeStatus === 'Cleared') ||
      (selectedFeeStatus === 'PENDING' && s.feeStatus !== 'Cleared');

    return matchesSearch && matchesClass && matchesFee;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* ========================================================= */}
      {/* DESK SIDEBAR (Admin Office Desk)                           */}
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
              href="/office/students"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all bg-indigo-50 text-indigo-700 shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Enrolled Students</span>
              </div>
              <span className="text-[9px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                {students.length}
              </span>
            </Link>

            <Link
              href="/office/fees"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-slate-500" />
                <span>Fee Collection Counter</span>
              </div>
            </Link>

            <Link
              href="/office/promotion"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-slate-500" />
                <span>Batch Promotion Desk</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Office Operator & Sign Out Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Admin Office Terminal</p>
              <p className="text-[10px] text-slate-500">office@greenwood.edu</p>
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

      {/* ========================================================= */}
      {/* MAIN CONTAINER                                            */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TOP HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                  Admissions Office Registry
                </span>
                <button
                  onClick={fetchStudents}
                  disabled={loading}
                  title="Refresh students from Supabase"
                  className="p-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-500 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
                </button>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Enrolled Students Register
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Official institutional bio-data records & enrolled student directory
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/office/admission"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Register New Admission</span>
              </Link>
            </div>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, admission no, or parent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Streams / Classes</option>
                <option value="General Secondary">General Secondary</option>
                <option value="CBSE Board Secondary">CBSE Board Secondary</option>
                <option value="PCM">PCM / Computer Science</option>
              </select>

              <select
                value={selectedFeeStatus}
                onChange={(e) => setSelectedFeeStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Fee Status</option>
                <option value="CLEARED">Fee Cleared</option>
                <option value="PENDING">Fee Pending</option>
              </select>
            </div>
          </div>

          {/* STUDENTS TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500 font-medium space-y-2">
                <RefreshCw className="w-5 h-5 mx-auto animate-spin text-indigo-600" />
                <p>Loading enrolled students from Supabase...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 font-medium">
                No students found matching your search criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Student Name & Roll No</th>
                      <th className="py-3 px-4">Admission Number</th>
                      <th className="py-3 px-4">Class & Stream</th>
                      <th className="py-3 px-4">Parent / Guardian</th>
                      <th className="py-3 px-4">Contact Phone</th>
                      <th className="py-3 px-4">Transport</th>
                      <th className="py-3 px-4 text-center">Fee Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {student.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{student.name}</div>
                              <div className="text-[10px] text-slate-400">Roll #{student.rollNo}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                          {student.admissionNo}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {student.gradeSection}
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {student.parentName}
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                          {student.parentPhone}
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                          {student.transportMode ? (
                            <span className="inline-flex items-center gap-1 text-slate-700">
                              <Bus className="w-3 h-3 text-indigo-600" />
                              {student.transportMode}
                            </span>
                          ) : (
                            <span className="text-slate-400">Own Transport</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {student.feeStatus === 'Cleared' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Cleared
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
