'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Building2,
  Users,
  GraduationCap,
  Activity,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  KeyRound,
  ExternalLink,
  Copy,
  Check,
  X,
  Server,
  Terminal,
  TrendingUp,
  MapPin,
  Lock,
  Sparkles,
} from 'lucide-react';

interface SchoolTenant {
  id: string;
  name: string;
  code: string;
  affiliationNo: string;
  board: 'CBSE' | 'ICSE' | 'State Board';
  city: string;
  state: string;
  studentsCount: number;
  facultyCount: number;
  principalName: string;
  principalEmail: string;
  status: 'active' | 'setup' | 'trial';
  academicYear: string;
  portalUrl: string;
}

export default function PlatformSuperAdminPage() {
  const [schools, setSchools] = useState<SchoolTenant[]>([
    {
      id: 'sch_1',
      name: 'Greenwood Academy',
      code: 'GA-CHN',
      affiliationNo: 'CBSE #1930412',
      board: 'CBSE',
      city: 'Chennai',
      state: 'Tamil Nadu',
      studentsCount: 1420,
      facultyCount: 68,
      principalName: 'Dr. Aruna Natarajan, Ph.D.',
      principalEmail: 'principal@greenwood.edu',
      status: 'active',
      academicYear: '2026 - 2027 (Term 1)',
      portalUrl: '/',
    },
    {
      id: 'sch_2',
      name: 'Oakridge Public School',
      code: 'OPS-BLR',
      affiliationNo: 'CBSE #1930588',
      board: 'CBSE',
      city: 'Bangalore',
      state: 'Karnataka',
      studentsCount: 2150,
      facultyCount: 94,
      principalName: 'Prof. Sandeep Sen',
      principalEmail: 'principal@oakridge.edu',
      status: 'active',
      academicYear: '2026 - 2027 (Term 1)',
      portalUrl: '/',
    },
    {
      id: 'sch_3',
      name: 'Delhi Heritage Academy',
      code: 'DHA-DEL',
      affiliationNo: 'CBSE #1930901',
      board: 'CBSE',
      city: 'New Delhi',
      state: 'Delhi NCR',
      studentsCount: 1890,
      facultyCount: 82,
      principalName: 'Mrs. Meenakshi Sundaram',
      principalEmail: 'principal@delhiheritage.edu',
      status: 'setup',
      academicYear: '2026 - 2027 (Provisioning)',
      portalUrl: '/',
    },
    {
      id: 'sch_4',
      name: "St. Xavier's Model School",
      code: 'SX-MYS',
      affiliationNo: 'ICSE #KA-042',
      board: 'ICSE',
      city: 'Mysore',
      state: 'Karnataka',
      studentsCount: 1120,
      facultyCount: 56,
      principalName: 'Fr. Thomas Alvares, S.J.',
      principalEmail: 'principal@stxaviers.edu',
      status: 'active',
      academicYear: '2026 - 2027 (Term 1)',
      portalUrl: '/',
    },
  ]);

  const [filterBoard, setFilterBoard] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New School Form State
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newBoard, setNewBoard] = useState<'CBSE' | 'ICSE' | 'State Board'>('CBSE');
  const [newAffiliation, setNewAffiliation] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPrincipalName, setNewPrincipalName] = useState('');
  const [newPrincipalEmail, setNewPrincipalEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('School@2026Pass');

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName || !newPrincipalEmail) {
      alert('Please fill out the school name and principal email.');
      return;
    }

    const newSchool: SchoolTenant = {
      id: `sch_${Date.now()}`,
      name: newSchoolName,
      code: newSchoolName.slice(0, 3).toUpperCase(),
      affiliationNo: newAffiliation || `${newBoard} #Pending`,
      board: newBoard,
      city: newCity || 'India',
      state: 'State',
      studentsCount: 0,
      facultyCount: 1,
      principalName: newPrincipalName || 'School Principal',
      principalEmail: newPrincipalEmail,
      status: 'setup',
      academicYear: '2026 - 2027',
      portalUrl: '/',
    };

    setSchools((prev) => [newSchool, ...prev]);
    setIsOnboardModalOpen(false);
    alert(
      `School "${newSchoolName}" instance deployed! Initial principal credentials dispatched to ${newPrincipalEmail}.`
    );

    // Reset
    setNewSchoolName('');
    setNewAffiliation('');
    setNewCity('');
    setNewPrincipalName('');
    setNewPrincipalEmail('');
  };

  const filteredSchools = schools.filter((s) => {
    const matchesBoard = filterBoard === 'all' || s.board === filterBoard;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.principalEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBoard && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* TOP SAAS PLATFORM HEADER */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs shadow-indigo-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                Antigravity School OS
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-full">
                Multi-Tenant Master Console
              </span>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="w-96 relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campuses, tenant IDs, or principal emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-xs"
          />
        </div>

        {/* ACTIONS & PROFILE */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnboardModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs shadow-indigo-300"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Onboard New School</span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2.5">
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
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
        {/* HERO TITLE & ECOSYSTEM CONTEXT */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-700 uppercase tracking-widest mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Consolidated Fleet Orchestration • 24ms Supabase Latency
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ecosystem Architecture & Institutional Nodes
            </h1>
            <p className="text-xs lg:text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
              Unified tenant isolation with Supabase Row-Level Security (RLS), multi-school Principal credential provisioning, and centralized academic telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              Preview Greenwood Principal Suite →
            </Link>
            <Link
              href="/office/admission"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              Open Admission Desk →
            </Link>
          </div>
        </div>

        {/* 4 HIGH-BREATHING KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                TOTAL ONBOARDED INSTITUTIONS
              </span>
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {schools.length}
              </span>
              <span className="text-xs text-slate-400 font-semibold">Campuses</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-2">
              16 CBSE • 2 ICSE (+3 this quarter)
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                TOTAL ENROLLED LEARNERS
              </span>
              <GraduationCap className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                24,820
              </span>
              <span className="text-xs text-slate-400 font-semibold">Students</span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-2">
              100% Parent App Sync Validated
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                ACTIVE FACULTY MEMBERS
              </span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                1,140
              </span>
              <span className="text-xs text-slate-400 font-semibold">Educators</span>
            </div>
            <p className="text-[11px] text-indigo-700 font-semibold mt-2">
              98.2% Mobile App Engagement
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                SYSTEM HEALTH & RLS STATE
              </span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                100%
              </span>
              <span className="text-xs text-slate-400 font-semibold">Healthy</span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-2">
              0 Tenant Isolation Anomalies
            </p>
          </div>
        </div>

        {/* SUPABASE CLUSTER TELEMETRY BANNER */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900">
                  Supabase Production Cluster Telemetry
                </h4>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  ap-south-1 Mumbai
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Connected to project <strong className="font-mono text-slate-700">production-cluster</strong> • Row-Level Security active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-600 font-semibold">
            <div>
              <span className="text-slate-400 font-normal">Throughput:</span> 8,420 rps
            </div>
            <div>
              <span className="text-slate-400 font-normal">Query Latency:</span> 24ms
            </div>
            <div>
              <span className="text-slate-400 font-normal">DB Size:</span> 1.4 GB
            </div>
          </div>
        </div>

        {/* SCHOOL DIRECTORY CONTROLS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

          <p className="text-xs text-slate-400">
            Showing {filteredSchools.length} of {schools.length} institutions
          </p>
        </div>

        {/* GRID OF SCHOOL CARDS (Matching Stitch 3207d62ee57447af94138a4e8b04c233) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSchools.map((school) => (
            <div
              key={school.id}
              className="bg-white rounded-2xl p-6 lg:p-7 border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-base flex items-center justify-center shrink-0 border border-indigo-100">
                      {school.code.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900">
                          {school.name}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-slate-700">
                          {school.affiliationNo}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {school.city}, {school.state}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      school.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {school.status === 'active' ? '● Active • Live' : '⚙ Setup in Progress'}
                  </span>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-slate-50 border border-slate-100 mt-4 text-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      LEARNERS
                    </p>
                    <p className="text-base font-extrabold text-slate-900 mt-0.5">
                      {school.studentsCount > 0 ? school.studentsCount.toLocaleString() : 'Pending'}
                    </p>
                  </div>
                  <div className="border-x border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      FACULTY
                    </p>
                    <p className="text-base font-extrabold text-slate-900 mt-0.5">
                      {school.facultyCount} Staff
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      SESSION
                    </p>
                    <p className="text-xs font-bold text-indigo-700 mt-1">
                      {school.academicYear}
                    </p>
                  </div>
                </div>

                {/* Principal Credentials Row */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Designated Principal:</span>
                    <strong className="text-slate-900 font-semibold">
                      {school.principalName}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Login Email:</span>
                    <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {school.principalEmail}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => alert(`Reset password email sent to ${school.principalEmail}`)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Reset Password</span>
                </button>

                <Link
                  href={school.portalUrl}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-xs"
                >
                  <span>Open School Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ONBOARD NEW SCHOOL MODAL */}
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
                    Onboard New Institution
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Provision new school tenant & create initial Principal credentials
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOnboardModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    School / Institution Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cambridge International Academy"
                    value={newSchoolName}
                    onChange={(e) => setNewSchoolName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Education Board
                  </label>
                  <select
                    value={newBoard}
                    onChange={(e) => setNewBoard(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="CBSE">CBSE (Central Board)</option>
                    <option value="ICSE">ICSE / CISCE</option>
                    <option value="State Board">State Board</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Affiliation Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CBSE #1930777"
                    value={newAffiliation}
                    onChange={(e) => setNewAffiliation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    City & Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coimbatore, Tamil Nadu"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Principal Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. K. Radhakrishnan"
                    value={newPrincipalName}
                    onChange={(e) => setNewPrincipalName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Principal Official Login Email
                  </label>
                  <input
                    type="email"
                    placeholder="principal@cambridgeacademy.edu"
                    value={newPrincipalEmail}
                    onChange={(e) => setNewPrincipalEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Temporary Password Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    Initial Temporary Password
                  </p>
                  <p className="font-mono text-xs font-bold text-indigo-700 mt-0.5">
                    {tempPassword}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(tempPassword)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {copiedKey === tempPassword ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-300"
                >
                  Deploy School & Send Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
