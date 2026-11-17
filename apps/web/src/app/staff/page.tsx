'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { supabase } from '../../lib/supabase';
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
  UserPlus,
  Shield,
  Key,
  X,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  role: 'coordinator' | 'incharge' | 'teacher' | 'admission_officer';
  inCharge?: string;
  periodsPerWeek: number;
  status: 'present' | 'leave' | 'od';
  substituteCoveredBy?: string;
  email: string;
  phone: string;
  permissions?: string[];
}

export default function StaffDirectoryPage() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedRole, setSelectedRole] = useState<'all' | 'coordinator' | 'incharge' | 'teacher' | 'admission_officer'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Staff / Admin Form State
  const [newName, setNewName] = useState('');
  const [newEmpId, setNewEmpId] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDesignation, setNewDesignation] = useState('Academic Coordinator');
  const [newDept, setNewDept] = useState('Science');
  const [newRole, setNewRole] = useState<'coordinator' | 'incharge' | 'teacher' | 'admission_officer'>('coordinator');
  const [newInCharge, setNewInCharge] = useState('None');
  const [newPermissions, setNewPermissions] = useState<string[]>([
    'Create & Manage Staff',
    'Assign Substitute Teachers',
  ]);

  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: 'fac_coord_1',
      name: 'Dr. S. Raman',
      designation: 'Vice Principal & Senior Academic Coordinator',
      department: 'Languages',
      role: 'coordinator',
      periodsPerWeek: 16,
      status: 'present',
      email: 'raman.s@greenwood.edu',
      phone: '+91 98401 11223',
      permissions: ['Create & Manage Staff', 'Assign Substitutes', 'Approve Timetable'],
    },
    {
      id: 'fac_1',
      name: 'Mrs. Deepa R.',
      designation: 'Senior Mathematics Faculty',
      department: 'Mathematics',
      role: 'incharge',
      inCharge: 'Grade 8 - Section B',
      periodsPerWeek: 24,
      status: 'present',
      email: 'deepa.r@greenwood.edu',
      phone: '+91 98401 23456',
      permissions: ['Class In-Charge', 'Morning Attendance', 'Parent Communication'],
    },
    {
      id: 'fac_2',
      name: 'Mr. Anand Kumar',
      designation: 'Senior Physics Faculty & HOD',
      department: 'Science',
      role: 'incharge',
      inCharge: 'Grade 9 - Section A',
      periodsPerWeek: 26,
      status: 'leave',
      substituteCoveredBy: 'Mrs. Deepa R. (P4)',
      email: 'anand.k@greenwood.edu',
      phone: '+91 98402 34567',
      permissions: ['Class In-Charge', 'Lab Allocation'],
    },
    {
      id: 'fac_adm_1',
      name: 'Mr. R. Rajesh Kumar',
      designation: 'Front Office & Admission Administrator',
      department: 'Administration',
      role: 'admission_officer',
      periodsPerWeek: 0,
      status: 'present',
      email: 'admissions@greenwood.edu',
      phone: '+91 98402 71829',
      permissions: ['Admission Desk', 'Document Verification', 'Fee Clearance'],
    },
    {
      id: 'fac_3',
      name: 'Mr. Karthik Raja',
      designation: 'English Faculty & Form Tutor',
      department: 'Languages',
      role: 'incharge',
      inCharge: 'Grade 8 - Section C',
      periodsPerWeek: 22,
      status: 'present',
      email: 'karthik.r@greenwood.edu',
      phone: '+91 98403 45678',
      permissions: ['Class In-Charge'],
    },
    {
      id: 'fac_4',
      name: 'Mrs. Preetha V.',
      designation: 'Mathematics Faculty',
      department: 'Mathematics',
      role: 'incharge',
      inCharge: 'Grade 9 - Section B',
      periodsPerWeek: 24,
      status: 'present',
      email: 'preetha.v@greenwood.edu',
      phone: '+91 98404 56789',
      permissions: ['Class In-Charge'],
    },
    {
      id: 'fac_5',
      name: 'Mrs. Malathi S.',
      designation: 'English Faculty',
      department: 'Languages',
      role: 'teacher',
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
      role: 'incharge',
      inCharge: 'Grade 11 - Section A',
      periodsPerWeek: 28,
      status: 'od',
      substituteCoveredBy: 'Mrs. Preetha V. (P3)',
      email: 'vignesh.p@greenwood.edu',
      phone: '+91 98406 78901',
      permissions: ['Class In-Charge'],
    },
    {
      id: 'fac_7',
      name: 'Dr. K. Swaminathan',
      designation: 'Senior Chemistry Faculty',
      department: 'Science',
      role: 'coordinator',
      inCharge: 'Grade 12 - Section A',
      periodsPerWeek: 26,
      status: 'present',
      email: 'swaminathan.k@greenwood.edu',
      phone: '+91 98407 89012',
      permissions: ['Lab In-Charge', 'Examination Committee'],
    },
    {
      id: 'fac_8',
      name: 'Mrs. Shanthi M.',
      designation: 'Primary Section Coordinator',
      department: 'Primary Wing',
      role: 'coordinator',
      inCharge: 'Grade 4 - Section A',
      periodsPerWeek: 18,
      status: 'present',
      email: 'shanthi.m@greenwood.edu',
      phone: '+91 98408 90123',
      permissions: ['Primary Wing Coordinator'],
    },
  ]);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMember: StaffMember = {
      id: `fac_${Date.now()}`,
      name: newName,
      designation: newDesignation,
      department: newDept,
      role: newRole,
      inCharge: newInCharge !== 'None' ? newInCharge : undefined,
      periodsPerWeek: newRole === 'admission_officer' ? 0 : 22,
      status: 'present',
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.')}@greenwood.edu`,
      phone: newPhone || '+91 98401 00000',
      permissions: newPermissions,
    };

    setStaffList((prev) => [newMember, ...prev]);

    try {
      await supabase.from('profiles').insert({
        id: crypto.randomUUID(),
        school_id: '11111111-1111-1111-1111-111111111111',
        full_name: newName,
        email: newEmail,
        phone: newPhone,
        role: newRole,
        designation: newDesignation,
      });
    } catch (err) {
      console.warn('Supabase profile note:', err);
    }

    setNewName('');
    setNewEmpId('');
    setNewEmail('');
    setNewPhone('');
    setIsModalOpen(false);
  };

  const togglePermission = (perm: string) => {
    setNewPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const departments = ['all', 'Mathematics', 'Science', 'Languages', 'Primary Wing', 'Administration'];

  const filteredStaff = staffList.filter((s) => {
    const matchesDept = selectedDept === 'all' || s.department === selectedDept;
    const matchesRole = selectedRole === 'all' || s.role === selectedRole;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.inCharge && s.inCharge.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesRole && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Staff & Faculty Directory
                </h2>
                <span className="text-xs font-extrabold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {staffList.length} Active Personnel
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Executive authority: Principal assigns coordinators, in-charges, and delegated administrative permissions
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
                  className="bg-white border border-slate-200 text-xs text-slate-900 pl-8 pr-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500 shadow-xs"
                />
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Create Staff / Administrator</span>
              </button>
            </div>
          </div>

          {/* ROLE & PERMISSION FILTERS */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Personnel' },
              { id: 'coordinator', label: 'Coordinators / Administrators' },
              { id: 'incharge', label: 'Class In-Charges' },
              { id: 'teacher', label: 'Subject Faculty' },
              { id: 'admission_officer', label: 'Admission & Front Office' },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === role.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          {/* FACULTY TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-semibold">Faculty / Administrator</th>
                    <th className="py-3.5 px-4 font-semibold">Assigned Role</th>
                    <th className="py-3.5 px-4 font-semibold">Department</th>
                    <th className="py-3.5 px-4 font-semibold">Class In-Charge Role</th>
                    <th className="py-3.5 px-4 font-semibold">Delegated Permissions</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                            {staff.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">{staff.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{staff.designation}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            staff.role === 'coordinator'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : staff.role === 'incharge'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : staff.role === 'admission_officer'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {staff.role === 'coordinator'
                            ? 'Administrator'
                            : staff.role === 'incharge'
                            ? 'Class In-Charge'
                            : staff.role === 'admission_officer'
                            ? 'Front Office'
                            : 'Faculty'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {staff.department}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {staff.inCharge ? (
                          <span className="inline-block text-[11px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md">
                            {staff.inCharge}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {staff.permissions && staff.permissions.length > 0 ? (
                            staff.permissions.map((p, idx) => (
                              <span key={idx} className="text-[9px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                                {p}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[11px]">Academic Normal</span>
                          )}
                        </div>
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
                          </div>
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

      {/* CREATE STAFF / ADMINISTRATOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Create Staff / Administrator
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Principal Executive Desk: Delegate roles and permissions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. K. Venkatesh"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    placeholder="FAC-2026-088"
                    value={newEmpId}
                    onChange={(e) => setNewEmpId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@greenwood.edu"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98401 XXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Primary Role *
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-indigo-700 focus:outline-none"
                  >
                    <option value="coordinator">Coordinator / Administrator</option>
                    <option value="incharge">Class In-Charge Teacher</option>
                    <option value="teacher">Subject Faculty</option>
                    <option value="admission_officer">Front Office / Admission Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Assign Class In-Charge (Pre-KG to 12th)
                  </label>
                  <select
                    value={newInCharge}
                    onChange={(e) => setNewInCharge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
                  >
                    <option value="None">None (Subject Faculty / Non-Class In-Charge)</option>
                    <optgroup label="Kindergarten / Early Years">
                      <option value="Pre-KG - Section A">Pre-KG – Section A</option>
                      <option value="LKG - Section A">LKG – Section A</option>
                      <option value="LKG - Section B">LKG – Section B</option>
                      <option value="UKG - Section A">UKG – Section A</option>
                      <option value="UKG - Section B">UKG – Section B</option>
                    </optgroup>
                    <optgroup label="Primary School (Classes 1 - 5)">
                      <option value="Class 1 - Section A">Class 1 – Section A</option>
                      <option value="Class 1 - Section B">Class 1 – Section B</option>
                      <option value="Class 2 - Section A">Class 2 – Section A</option>
                      <option value="Class 2 - Section B">Class 2 – Section B</option>
                      <option value="Class 3 - Section A">Class 3 – Section A</option>
                      <option value="Class 3 - Section B">Class 3 – Section B</option>
                      <option value="Class 4 - Section A">Class 4 – Section A</option>
                      <option value="Class 4 - Section B">Class 4 – Section B</option>
                      <option value="Class 5 - Section A">Class 5 – Section A</option>
                      <option value="Class 5 - Section B">Class 5 – Section B</option>
                    </optgroup>
                    <optgroup label="Middle School (Classes 6 - 8)">
                      <option value="Class 6 - Section A">Class 6 – Section A</option>
                      <option value="Class 6 - Section B">Class 6 – Section B</option>
                      <option value="Class 7 - Section A">Class 7 – Section A</option>
                      <option value="Class 7 - Section B">Class 7 – Section B</option>
                      <option value="Grade 8 - Section A">Class 8 – Section A</option>
                      <option value="Grade 8 - Section B">Class 8 – Section B</option>
                      <option value="Grade 8 - Section C">Class 8 – Section C</option>
                    </optgroup>
                    <optgroup label="Secondary School (CBSE 9 & 10)">
                      <option value="Grade 9 - Section A">Class 9 – Section A</option>
                      <option value="Grade 9 - Section B">Class 9 – Section B</option>
                      <option value="Grade 9 - Section C">Class 9 – Section C</option>
                      <option value="Grade 10 - Section A">Class 10 – Section A</option>
                      <option value="Grade 10 - Section B">Class 10 – Section B</option>
                      <option value="Grade 10 - Section C">Class 10 – Section C</option>
                    </optgroup>
                    <optgroup label="Senior Secondary (CBSE 11 & 12 Streams)">
                      <option value="Grade 11 - Section A">Class 11 – Section A (PCM + Computer Science)</option>
                      <option value="Grade 11 - Section B">Class 11 – Section B (PCM + Biology / NEET)</option>
                      <option value="Grade 11 - Section C">Class 11 – Section C (Commerce + Applied Maths)</option>
                      <option value="Grade 11 - Section D">Class 11 – Section D (Humanities & Liberal Arts)</option>
                      <option value="Grade 12 - Section A">Class 12 – Section A (PCM + Computer Science)</option>
                      <option value="Grade 12 - Section B">Class 12 – Section B (PCM + Biology)</option>
                      <option value="Grade 12 - Section C">Class 12 – Section C (Commerce)</option>
                      <option value="Grade 12 - Section D">Class 12 – Section D (Humanities)</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* DEFAULT CBSE SUBJECT / DEPARTMENT SELECTION */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Primary Teaching Subject & Curriculum Department
                </label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none"
                >
                  <optgroup label="Core Foundation Subjects (Classes 1 - 10)">
                    <option value="Languages (Tamil)">Tamil (Regional Second Language)</option>
                    <option value="Languages (English)">English (Core Language & Literature)</option>
                    <option value="Languages (Hindi)">Hindi (Course B / Communicative)</option>
                    <option value="Mathematics">Mathematics (Foundation & Standard)</option>
                    <option value="Science">General Science (Physics, Chemistry, Biology)</option>
                    <option value="Social Science">Social Science (History, Geography, Civics, Economics)</option>
                    <option value="Computer Science">Computer Applications & AI Foundation</option>
                  </optgroup>
                  <optgroup label="Senior Secondary Specializations (Classes 11 & 12)">
                    <option value="Physics">Physics (Higher Secondary CBSE Code 042)</option>
                    <option value="Chemistry">Chemistry (Higher Secondary CBSE Code 043)</option>
                    <option value="Biology">Biology (Botany & Zoology CBSE Code 044)</option>
                    <option value="Computer Science">Computer Science with Python (CBSE Code 083)</option>
                    <option value="Accountancy">Accountancy & Financial Markets (CBSE Code 055)</option>
                    <option value="Business Studies">Business Studies (CBSE Code 054)</option>
                    <option value="Economics">Economics (Macro & Indian Economic Development)</option>
                    <option value="Humanities">History, Political Science & Psychology</option>
                  </optgroup>
                  <optgroup label="Campus Operations & Administration">
                    <option value="Physical Education">Physical Education, Yoga & Sports</option>
                    <option value="Administration">Front Office Desk & Admissions Administration</option>
                  </optgroup>
                </select>
              </div>

              {/* GRANULAR PERMISSIONS */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <p className="font-extrabold text-[10px] text-slate-500 uppercase tracking-wider">
                  Delegated Administrative Permissions
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Create & Manage Staff',
                    'Admission Desk & Student Enrollment',
                    'Assign Substitute Teachers',
                    'Manage Class & Exam Timetables',
                    'Review Attendance & Marks',
                  ].map((perm) => (
                    <label key={perm} className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={newPermissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                        className="rounded text-indigo-600 focus:ring-0"
                      />
                      <span className="text-[11px] font-medium">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm shadow-indigo-200 transition-colors"
                >
                  Save & Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
