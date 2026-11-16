'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Mail,
  Phone,
  BookOpen,
  Calendar,
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  inCharge?: string;
  periodsPerWeek: number;
  status: 'present' | 'leave' | 'od';
  substituteCoveredBy?: string;
  email: string;
  phone: string;
}

export default function StaffDirectoryPage() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const staffList: StaffMember[] = [
    {
      id: 'fac_1',
      name: 'Mrs. Deepa R.',
      designation: 'Senior Mathematics Faculty',
      department: 'Mathematics',
      inCharge: 'Grade 8 - Section B',
      periodsPerWeek: 24,
      status: 'present',
      email: 'deepa.r@greenwood.edu',
      phone: '+91 98401 23456',
    },
    {
      id: 'fac_2',
      name: 'Mr. Anand Kumar',
      designation: 'Senior Physics Faculty',
      department: 'Science',
      inCharge: 'Grade 9 - Section A',
      periodsPerWeek: 26,
      status: 'leave',
      substituteCoveredBy: 'Mrs. Deepa R. (P4)',
      email: 'anand.k@greenwood.edu',
      phone: '+91 98402 34567',
    },
    {
      id: 'fac_3',
      name: 'Mr. Karthik Raja',
      designation: 'English Faculty & Form Tutor',
      department: 'Languages',
      inCharge: 'Grade 8 - Section C',
      periodsPerWeek: 22,
      status: 'present',
      email: 'karthik.r@greenwood.edu',
      phone: '+91 98403 45678',
    },
    {
      id: 'fac_4',
      name: 'Mrs. Preetha V.',
      designation: 'Mathematics Faculty',
      department: 'Mathematics',
      inCharge: 'Grade 9 - Section B',
      periodsPerWeek: 24,
      status: 'present',
      email: 'preetha.v@greenwood.edu',
      phone: '+91 98404 56789',
    },
    {
      id: 'fac_5',
      name: 'Mrs. Malathi S.',
      designation: 'English Faculty',
      department: 'Languages',
      periodsPerWeek: 20,
      status: 'leave',
      substituteCoveredBy: 'Mr. Karthik Raja (P2)',
      email: 'malathi.s@greenwood.edu',
      phone: '+91 98405 67890',
    },
    {
      id: 'fac_6',
      name: 'Mr. Vignesh P.',
      designation: 'Higher Secondary Mathematics',
      department: 'Mathematics',
      inCharge: 'Grade 11 - Section A',
      periodsPerWeek: 28,
      status: 'od',
      substituteCoveredBy: 'Mrs. Preetha V. (P3)',
      email: 'vignesh.p@greenwood.edu',
      phone: '+91 98406 78901',
    },
    {
      id: 'fac_7',
      name: 'Dr. S. Raman',
      designation: 'Head of Department - Chemistry',
      department: 'Science',
      inCharge: 'Grade 12 - Section A',
      periodsPerWeek: 26,
      status: 'present',
      email: 'raman.s@greenwood.edu',
      phone: '+91 98407 89012',
    },
    {
      id: 'fac_8',
      name: 'Mrs. Shanthi M.',
      designation: 'Primary Section Coordinator',
      department: 'Primary Wing',
      inCharge: 'Grade 4 - Section A',
      periodsPerWeek: 18,
      status: 'present',
      email: 'shanthi.m@greenwood.edu',
      phone: '+91 98408 90123',
    },
  ];

  const departments = ['all', 'Mathematics', 'Science', 'Languages', 'Primary Wing'];

  const filteredStaff = staffList.filter((s) => {
    const matchesDept = selectedDept === 'all' || s.department === selectedDept;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.inCharge && s.inCharge.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Staff & Faculty Directory
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage teacher allocations, class in-charge roles, and daily duty status
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search faculty name, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-slate-200 text-xs text-slate-900 pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-indigo-500 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* DEPARTMENT PILLS */}
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  selectedDept === dept
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {dept === 'all' ? 'All Departments (68)' : dept}
              </button>
            ))}
          </div>

          {/* FACULTY TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-semibold">Faculty Name & Designation</th>
                    <th className="py-3.5 px-4 font-semibold">Department</th>
                    <th className="py-3.5 px-4 font-semibold">Class In-Charge Role</th>
                    <th className="py-3.5 px-4 font-semibold">Weekly Load</th>
                    <th className="py-3.5 px-4 font-semibold">Today's Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                            {staff.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{staff.name}</p>
                            <p className="text-[11px] text-slate-400">{staff.designation}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {staff.department}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {staff.inCharge ? (
                          <span className="inline-block text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {staff.inCharge}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">
                          {staff.periodsPerWeek} Periods
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {staff.status === 'present' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Present
                          </span>
                        )}
                        {staff.status === 'leave' && (
                          <div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              On Leave
                            </span>
                            {staff.substituteCoveredBy && (
                              <p className="text-[10px] text-indigo-600 mt-0.5">
                                Sub: {staff.substituteCoveredBy}
                              </p>
                            )}
                          </div>
                        )}
                        {staff.status === 'od' && (
                          <div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                              <AlertCircle className="w-3 h-3 text-indigo-600" />
                              Official Duty
                            </span>
                            {staff.substituteCoveredBy && (
                              <p className="text-[10px] text-indigo-600 mt-0.5">
                                Sub: {staff.substituteCoveredBy}
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => alert(`Viewing full faculty profile for ${staff.name}`)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          View Details
                        </button>
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
