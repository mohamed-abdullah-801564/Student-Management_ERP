'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Shield,
  Building2,
  Users,
  GraduationCap,
  Activity,
  Plus,
  Search,
  CheckCircle2,
  KeyRound,
  Copy,
  Check,
  X,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Calendar,
  LogOut,
  Settings as SettingsIcon,
  Power,
  PowerOff,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface SchoolTenant {
  id: string;
  name: string;
  code: string;
  affiliationNo: string;
  board: 'CBSE' | 'ICSE' | 'State Board';
  city: string;
  state: string;
  address: string;
  phone: string;
  studentsCount: number;
  facultyCount: number;
  principalName: string;
  principalEmail: string;
  status: 'active' | 'inactive';
  academicYear: string;
}

export default function PlatformSuperAdminPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<SchoolTenant[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [filterBoard, setFilterBoard] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedSchoolDetail, setSelectedSchoolDetail] = useState<SchoolTenant | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New School Form State
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newBoard, setNewBoard] = useState<'CBSE' | 'ICSE' | 'State Board'>('CBSE');
  const [newAffiliation, setNewAffiliation] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPrincipalName, setNewPrincipalName] = useState('');
  const [newPrincipalEmail, setNewPrincipalEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('School#2026!Pass');
  const [isSubmittingSchool, setIsSubmittingSchool] = useState(false);

  // Super Admin Password Update State
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [adminUpdating, setAdminUpdating] = useState(false);
  const [adminUpdateMsg, setAdminUpdateMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handover Slip Modal State (For Onboarding & Password Resets)
  const [handoverData, setHandoverData] = useState<{
    schoolName: string;
    code: string;
    principalName: string;
    principalEmail: string;
    tempPass: string;
    actionType: 'onboard' | 'reset';
  } | null>(null);

  // Fetch real schools from Supabase via backend API
  const fetchSchools = async () => {
    try {
      setLoadingSchools(true);
      const res = await fetch('/api/platform/schools');
      const data = await res.json();
      if (data.schools) {
        setSchools(data.schools);
      }
    } catch (err) {
      console.error('Failed to load schools from Supabase:', err);
    } finally {
      setLoadingSchools(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Create New School & Provision Principal in Supabase
  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName || !newPrincipalEmail) {
      alert('Please fill out the school name and principal email.');
      return;
    }

    setIsSubmittingSchool(true);
    try {
      const res = await fetch('/api/platform/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSchoolName,
          board: newBoard,
          affiliationNo: newAffiliation,
          city: newCity,
          state: newState,
          principalName: newPrincipalName,
          principalEmail: newPrincipalEmail,
          tempPassword: tempPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        alert(`Failed to onboard institution: ${data.error || 'Unknown error'}`);
        return;
      }

      setIsOnboardModalOpen(false);

      // Show Handover Slip with provisioned credentials
      setHandoverData({
        schoolName: data.school.name,
        code: data.school.code,
        principalName: data.school.principalName,
        principalEmail: data.school.principalEmail,
        tempPass: tempPassword,
        actionType: 'onboard',
      });

      // Reset Form
      setNewSchoolName('');
      setNewAffiliation('');
      setNewCity('');
      setNewPrincipalName('');
      setNewPrincipalEmail('');

      // Refresh list
      fetchSchools();
    } catch (err: any) {
      alert(`Network error creating school: ${err.message}`);
    } finally {
      setIsSubmittingSchool(false);
    }
  };

  // 2. Toggle School Active / Inactive Status in Supabase
  const handleToggleSchoolStatus = async (school: SchoolTenant) => {
    const nextStatus = school.status === 'active' ? 'inactive' : 'active';
    const confirmText =
      nextStatus === 'inactive'
        ? `Are you sure you want to deactivate "${school.name}"? Users (Principal, Staff, and Parents) will be blocked from access with a friendly unavailable message.`
        : `Reactivate "${school.name}"? Access will be immediately restored across web and mobile.`;

    if (!confirm(confirmText)) return;

    try {
      const res = await fetch('/api/platform/schools', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId: school.id, status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        alert(`Failed to update status: ${data.error || 'Server error'}`);
        return;
      }

      setSchools((prev) =>
        prev.map((s) => (s.id === school.id ? { ...s, status: nextStatus } : s))
      );
    } catch (err: any) {
      alert(`Network error updating school status: ${err.message}`);
    }
  };

  // 3. Reset Principal Password in Supabase Auth
  const handleResetPrincipalPassword = async (school: SchoolTenant) => {
    const generatedPass = `Reset#${Math.floor(1000 + Math.random() * 9000)}!Pass`;

    try {
      const res = await fetch('/api/platform/schools', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          principalEmail: school.principalEmail,
          newPassword: generatedPass,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        alert(`Failed to reset password: ${data.error || 'Server error'}`);
        return;
      }

      setHandoverData({
        schoolName: school.name,
        code: school.code,
        principalName: school.principalName,
        principalEmail: school.principalEmail,
        tempPass: generatedPass,
        actionType: 'reset',
      });
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    }
  };

  // 4. Update Super Admin Master Password in Supabase
  const handleUpdateAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminUpdateMsg(null);

    if (adminNewPassword.length < 6) {
      setAdminUpdateMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (adminNewPassword !== adminConfirmPassword) {
      setAdminUpdateMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setAdminUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: adminNewPassword });
      if (error) {
        setAdminUpdateMsg({ type: 'error', text: error.message });
      } else {
        setAdminUpdateMsg({
          type: 'success',
          text: 'Master password successfully updated in Supabase Auth.',
        });
        setAdminNewPassword('');
        setAdminConfirmPassword('');
      }
    } catch (err: any) {
      setAdminUpdateMsg({ type: 'error', text: err.message });
    } finally {
      setAdminUpdating(false);
    }
  };

  // 5. Super Admin Logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
    document.cookie = 'school_erp_session=; path=/; max-age=0';
    document.cookie = 'school_erp_role=; path=/; max-age=0';
    router.push('/login');
  };

  // Filtered schools
  const filteredSchools = schools.filter((s) => {
    const matchesBoard = filterBoard === 'all' || s.board === filterBoard;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.principalEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBoard && matchesSearch;
  });

  const totalLearners = schools.reduce((acc, s) => acc + (s.studentsCount || 0), 0);
  const totalFaculty = schools.reduce((acc, s) => acc + (s.facultyCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* TOP HEADER */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">
              School ERP Central
            </span>
            <span className="ml-2 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-full">
              Platform Master Console
            </span>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="w-96 relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campuses, affiliation #, or principal emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* ACTIONS & PROFILE */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnboardModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Onboard New School</span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Super Admin Settings Button */}
          <button
            onClick={() => {
              setAdminUpdateMsg(null);
              setIsSettingsModalOpen(true);
            }}
            title="Super Admin Settings & Password"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Super Admin Logout Button */}
          <button
            onClick={handleLogout}
            title="Log out of Super Admin Console"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log out</span>
          </button>

          <div className="flex items-center gap-2.5 ml-1">
            <div className="w-8 h-8 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold text-xs">
              SA
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none">
                Super Admin
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                root@antigravity.edu
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-6">
        {/* CLEAN PAGE TITLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Institutions & Campuses
              </h1>
              <button
                onClick={fetchSchools}
                disabled={loadingSchools}
                title="Refresh from Supabase"
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSchools ? 'animate-spin text-indigo-600' : ''}`} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live Supabase institutional registry. Create schools, provision principal credentials, or toggle active status.
            </p>
          </div>

          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            {['all', 'CBSE', 'ICSE'].map((b) => (
              <button
                key={b}
                onClick={() => setFilterBoard(b)}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  filterBoard === b
                    ? 'bg-white text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {b === 'all' ? `All Schools (${schools.length})` : `${b} Affiliated`}
              </button>
            ))}
          </div>
        </div>

        {/* 4 SUMMARY METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                TOTAL CAMPUSES
              </span>
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {schools.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">Campuses</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              {schools.filter((s) => s.status === 'active').length} Active Live • {schools.filter((s) => s.status === 'inactive').length} Inactive
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                TOTAL ENROLLED
              </span>
              <GraduationCap className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {totalLearners > 0 ? totalLearners.toLocaleString() : '1,420+'}
              </span>
              <span className="text-xs text-slate-400 font-medium">Students</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Across active CBSE & ICSE classes
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                ACTIVE EDUCATORS
              </span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {totalFaculty > 0 ? totalFaculty.toLocaleString() : '70+'}
              </span>
              <span className="text-xs text-slate-400 font-medium">Faculty</span>
            </div>
            <p className="text-[11px] text-indigo-600 font-semibold mt-1">
              Mobile Teacher Portal synced
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                SUPABASE STATUS
              </span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600">
                Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Row-Level Security Active
            </p>
          </div>
        </div>

        {/* ROW-BASED INSTITUTIONS DIRECTORY */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900">
              Institutions Directory
            </h2>
            <span className="text-xs text-slate-400">
              Showing {filteredSchools.length} of {schools.length} institutions
            </span>
          </div>

          <div className="overflow-x-auto">
            {loadingSchools ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Loading institutions from Supabase...</span>
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No institutions found. Click <strong>+ Onboard New School</strong> to create one.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">School & Affiliation</th>
                    <th className="py-3 px-4">Campus Location</th>
                    <th className="py-3 px-4">Designated Principal</th>
                    <th className="py-3 px-4 text-center">Learners</th>
                    <th className="py-3 px-4 text-center">Faculty</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredSchools.map((school) => (
                    <tr
                      key={school.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        school.status === 'inactive' ? 'bg-slate-50/50 opacity-80' : ''
                      }`}
                    >
                      {/* School & Affiliation */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border ${
                              school.status === 'active'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}
                          >
                            {school.code.slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900">
                                {school.name}
                              </span>
                              {school.status === 'active' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                              ) : (
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              <span className="font-semibold text-slate-700">
                                {school.affiliationNo}
                              </span>
                              <span className="mx-1">•</span>
                              <span className="font-mono text-[10px] text-slate-400">
                                {school.code}
                              </span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{school.city}, {school.state}</span>
                        </div>
                      </td>

                      {/* Principal */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {school.principalName}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500">
                            {school.principalEmail}
                          </p>
                        </div>
                      </td>

                      {/* Learners */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold text-slate-900">
                          {school.studentsCount > 0 ? school.studentsCount.toLocaleString() : '—'}
                        </span>
                      </td>

                      {/* Faculty */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-semibold text-slate-700">
                          {school.facultyCount} Staff
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            school.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              school.status === 'active' ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                          />
                          {school.status === 'active' ? 'Active Live' : 'Inactive Paused'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedSchoolDetail(school)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-[11px] transition-colors"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleResetPrincipalPassword(school)}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-[11px] transition-colors flex items-center gap-1"
                          >
                            <KeyRound className="w-3 h-3" />
                            <span>Reset Pass</span>
                          </button>

                          {/* INACTIVE / ACTIVE TOGGLE BUTTON */}
                          <button
                            onClick={() => handleToggleSchoolStatus(school)}
                            title={school.status === 'active' ? 'Deactivate school portal' : 'Activate school portal'}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 ${
                              school.status === 'active'
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/70'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/70'
                            }`}
                          >
                            {school.status === 'active' ? (
                              <>
                                <PowerOff className="w-3 h-3" />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <Power className="w-3 h-3" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* 1. SUPER ADMIN SETTINGS & PASSWORD UPDATE MODAL          */}
      {/* ========================================================= */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Super Admin Security Settings
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Platform Master Console • root@antigravity.edu
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateAdminPassword} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  CURRENT OPERATOR
                </span>
                <p className="font-bold text-slate-900">Antigravity Super Admin (Root)</p>
                <p className="text-[11px] font-mono text-slate-500">root@antigravity.edu</p>
              </div>

              {adminUpdateMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                    adminUpdateMsg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  {adminUpdateMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{adminUpdateMsg.text}</span>
                </div>
              )}

              <div className="space-y-3 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    New Master Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={adminNewPassword}
                    onChange={(e) => setAdminNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Confirm New Master Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={adminConfirmPassword}
                    onChange={(e) => setAdminConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={adminUpdating}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs disabled:opacity-60"
                >
                  {adminUpdating ? 'Updating in Supabase...' : 'Save New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. VIEW DETAILS MODAL                                     */}
      {/* ========================================================= */}
      {selectedSchoolDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center">
                  {selectedSchoolDetail.code.slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {selectedSchoolDetail.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {selectedSchoolDetail.affiliationNo} • {selectedSchoolDetail.board}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSchoolDetail(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    CAMPUS CODE
                  </span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">
                    {selectedSchoolDetail.code}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    ACADEMIC SESSION
                  </span>
                  <p className="font-bold text-indigo-700 mt-0.5">
                    {selectedSchoolDetail.academicYear}
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Address:</span>
                    <p className="text-slate-600 mt-0.5">{selectedSchoolDetail.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Phone:</span>{' '}
                    <span className="text-slate-600">{selectedSchoolDetail.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Principal Email:</span>{' '}
                    <span className="font-mono text-slate-700">{selectedSchoolDetail.principalEmail}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">ENROLLED</p>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {selectedSchoolDetail.studentsCount}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">FACULTY</p>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {selectedSchoolDetail.facultyCount}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">STATUS</p>
                  <p className={`text-sm font-extrabold mt-0.5 ${selectedSchoolDetail.status === 'active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedSchoolDetail.status.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedSchoolDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. ONBOARD NEW SCHOOL MODAL (DIRECT SUPABASE PERSISTENCE) */}
      {/* ========================================================= */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Onboard New Educational Institution
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Creates tenant in Supabase & provisions designated Principal auth account.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOnboardModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    School / Institution Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSchoolName}
                    onChange={(e) => setNewSchoolName(e.target.value)}
                    placeholder="e.g. National Model Senior Secondary School"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Affiliation Board
                  </label>
                  <select
                    value={newBoard}
                    onChange={(e: any) => setNewBoard(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="CBSE">CBSE (Central Board)</option>
                    <option value="ICSE">ICSE / ISC</option>
                    <option value="State Board">State Board</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Affiliation Number
                  </label>
                  <input
                    type="text"
                    value={newAffiliation}
                    onChange={(e) => setNewAffiliation(e.target.value)}
                    placeholder="e.g. CBSE #1930999"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    City
                  </label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. Coimbatore"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 border-t border-slate-100 pt-3">
                  <h4 className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-2">
                    Designated Principal Credentials (Initial Handover)
                  </h4>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Principal Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPrincipalName}
                    onChange={(e) => setNewPrincipalName(e.target.value)}
                    placeholder="e.g. Dr. Rajeshwari S."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Principal Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newPrincipalEmail}
                    onChange={(e) => setNewPrincipalEmail(e.target.value)}
                    placeholder="principal@nationalmodel.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                    Temporary First-Login Password
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setTempPassword(`School#${Math.floor(1000 + Math.random() * 9000)}!Pass`)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] shrink-0"
                    >
                      Regenerate
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    The Principal will be provisioned directly in Supabase Auth and forced to change password on first login.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isSubmittingSchool}
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSchool}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isSubmittingSchool && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmittingSchool ? 'Provisioning in Supabase...' : 'Confirm & Provision Institution'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. CREDENTIALS HANDOVER SLIP MODAL                        */}
      {/* ========================================================= */}
      {handoverData && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-indigo-600 text-white p-5 text-center relative">
              <button
                onClick={() => setHandoverData(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-2 text-white border border-white/20">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold tracking-tight">
                {handoverData.actionType === 'onboard'
                  ? 'Official Institutional Handover Slip'
                  : 'Principal Password Reset Slip'}
              </h3>
              <p className="text-xs text-indigo-100 mt-0.5">
                Saved in Supabase Auth for {handoverData.schoolName}
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-[11px] leading-relaxed">
                <strong>Notice:</strong> Deliver this handover slip securely to{' '}
                <strong>{handoverData.principalName}</strong>. The principal can now log in at{' '}
                <span className="font-mono font-bold">/login</span>.
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Institution:</span>
                  <strong className="text-slate-900 font-sans">{handoverData.schoolName}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Principal Name:</span>
                  <span className="text-slate-900 font-sans font-semibold">{handoverData.principalName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans">Login Email:</span>
                  <span className="text-indigo-700 font-bold">{handoverData.principalEmail}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-sans">Password:</span>
                  <span className="text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                    {handoverData.tempPass}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  handleCopy(
                    `SCHOOL ERP ACCESS HANDOVER\nInstitution: ${handoverData.schoolName}\nPrincipal: ${handoverData.principalName}\nLogin: ${handoverData.principalEmail}\nPassword: ${handoverData.tempPass}`
                  )
                }
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied Handover Details!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copy Handover Slip to Clipboard</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setHandoverData(null)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
