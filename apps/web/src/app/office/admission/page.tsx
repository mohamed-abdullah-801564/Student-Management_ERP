'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  Camera,
  FileText,
  User,
  Users,
  Smartphone,
  CreditCard,
  Bus,
  ShieldCheck,
  Check,
  ArrowRight,
  Sparkles,
  Info,
  Search,
  Filter,
  UserPlus,
  FileCheck,
  GraduationCap,
  Clock,
  Printer,
  Download,
  Award,
  LogOut,
} from 'lucide-react';

export default function StudentAdmissionRegistryPage() {
  const router = useRouter();
  // Navigation View: 'wizard' (Stage by stage new admission) | 'registry' (All students) | 'documents' (Verification desk)
  const [activeView, setActiveView] = useState<'wizard' | 'registry' | 'documents'>('wizard');

  // Step in Wizard: 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedGrade, setSelectedGrade] = useState('11');
  const [selectedStream, setSelectedStream] = useState('PCM_CS');
  const [gender, setGender] = useState('Male');
  const [secondLang, setSecondLang] = useState('Hindi');
  const [feeCycle, setFeeCycle] = useState<'3terms' | '4quarters' | 'annual'>('3terms');
  const [transportRequired, setTransportRequired] = useState(true);
  const [busRoute, setBusRoute] = useState('Route #4: Anna Nagar West → Campus');

  // Bio-Data Inputs
  const [studentName, setStudentName] = useState('Aditya Vikram R.');
  const [dob, setDob] = useState('2010-07-14');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [aadhaar, setAadhaar] = useState('5421 8902 4310');
  const [casteCategory, setCasteCategory] = useState('General');
  const [fatherName, setFatherName] = useState('Mr. R. Rajesh Kumar');
  const [fatherOcc, setFatherOcc] = useState('Senior Software Architect • Cognizant');
  const [motherName, setMotherName] = useState('Mrs. Meena Rajesh');
  const [primaryPhone, setPrimaryPhone] = useState('98402 71829');
  const [parentEmail, setParentEmail] = useState('rajesh.kumar@cognizant.com');
  const [address, setAddress] = useState('Plot 42, 4th Main Road, Anna Nagar West, Chennai - 600040');

  // Completed Admission State
  const [confirmedRegNo, setConfirmedRegNo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [motherTongue, setMotherTongue] = useState('Tamil');
  const [customMotherTongue, setCustomMotherTongue] = useState('');
  const [receiptSent, setReceiptSent] = useState(false);

  // Search & Filter for Registry View
  const [registrySearch, setRegistrySearch] = useState('');
  const [registryClassFilter, setRegistryClassFilter] = useState('ALL');
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);

  const loadEnrolledStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          admission_no,
          roll_no,
          first_name,
          last_name,
          gender,
          blood_group,
          fee_status,
          verification_status,
          admission_date,
          admission_type,
          stream,
          transport_mode,
          classes_sections (grade, section, stream),
          parents_guardians (father_name, father_phone, mother_name)
        `)
        .order('admission_date', { ascending: false });

      if (data && data.length > 0) {
        setEnrolledStudents(data);
      }
    } catch (err) {
      console.warn('Supabase fetch note:', err);
    }
  };

  useEffect(() => {
    loadEnrolledStudents();
  }, []);

  const streams = [
    {
      id: 'PCM_CS',
      title: 'Group I: PCM + Computer Science',
      subjects: 'Physics, Chemistry, Mathematics, Computer Science, English Core',
      tag: 'Engineering & CS',
      lab: 'Python CS Lab • Advanced Physics Lab',
      seats: '6 available in Batch 11-A',
    },
    {
      id: 'PCMB',
      title: 'Group II: Bio-Maths / PCM-B',
      subjects: 'Physics, Chemistry, Mathematics, Biology, English Core',
      tag: 'NEET & Medical Track',
      lab: 'Botany & Zoology Research Lab',
      seats: '12 available in Batch 11-B',
    },
    {
      id: 'Commerce',
      title: 'Group III: Commerce + Applied Maths',
      subjects: 'Accountancy, Business Studies, Economics, Applied Maths, English',
      tag: 'Finance & CA',
      lab: 'FinTech Simulation Lab',
      seats: '14 available in Batch 11-C',
    },
    {
      id: 'Humanities',
      title: 'Group IV: Humanities & Liberal Arts',
      subjects: 'History, Political Science, Economics, Psychology, English Core',
      tag: 'Law, UPSC & Media',
      lab: 'Social Dynamics Research Wing',
      seats: '18 available in Batch 11-D',
    },
  ];

  // Dynamic Fee Calculations based on Fee Billing Preference and Bus Transport
  const baseTuition = 72000;
  const labFund = 14500;
  const sportsTechFee = 8000;
  const transportFee = transportRequired ? 22000 : 0;
  const grossAnnual = baseTuition + labFund + sportsTechFee + transportFee; // 1,16,500 (with bus) or 94,500 (without)

  const annualDiscount = feeCycle === 'annual' ? Math.round(grossAnnual * 0.05) : 0;
  const netAnnual = grossAnnual - annualDiscount;

  const dueToday = feeCycle === 'annual'
    ? netAnnual
    : feeCycle === '3terms'
    ? Math.round(grossAnnual / 3) + (grossAnnual % 3)
    : Math.round(grossAnnual / 4);

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  const handleConfirmAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newReg = `GW-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // 1. Insert parent
      const { data: parentData } = await supabase
        .from('parents_guardians')
        .insert({
          school_id: '11111111-1111-1111-1111-111111111111',
          father_name: fatherName,
          father_occupation: fatherOcc,
          father_phone: primaryPhone.startsWith('+91') ? primaryPhone : `+91 ${primaryPhone}`,
          mother_name: motherName,
          primary_email: parentEmail,
          emergency_contact: primaryPhone.startsWith('+91') ? primaryPhone : `+91 ${primaryPhone}`,
          residential_address: address,
        })
        .select('id')
        .single();

      const parentId = parentData?.id || null;

      // 2. Insert student
      const parts = studentName.trim().split(' ');
      const firstName = parts[0] || 'Aditya';
      const lastName = parts.slice(1).join(' ') || 'Vikram';

      await supabase.from('students').insert({
        school_id: '11111111-1111-1111-1111-111111111111',
        admission_no: newReg,
        roll_no: `${selectedGrade}${gender === 'Male' ? '01' : '02'}`,
        first_name: firstName,
        last_name: lastName,
        dob: dob,
        gender: gender,
        blood_group: bloodGroup,
        aadhaar_no: aadhaar,
        parent_id: parentId,
        stream: parseInt(selectedGrade) >= 11 ? selectedStream : 'General Secondary',
        admission_date: new Date().toISOString().split('T')[0],
        fee_status: 'Cleared',
        transport_mode: transportRequired ? busRoute : 'Own / Self',
        status: 'Active',
      });

      // Refresh list
      loadEnrolledStudents();
    } catch (err) {
      console.warn('Supabase insert note:', err);
    } finally {
      setIsSubmitting(false);
      setConfirmedRegNo(newReg);
    }
  };

  const stepsList = [
    { no: 1, title: 'Bio-Data & Identity', sub: 'Civil records & Aadhaar' },
    { no: 2, title: 'Class & Stream', sub: 'Group allocation' },
    { no: 3, title: 'Parent & Contact', sub: 'Mobile login bio-data' },
    { no: 4, title: 'Fee & Transport', sub: 'Schedule & route' },
    { no: 5, title: 'Review & Confirm', sub: 'Instant student reg' },
  ];

  return (
    <>
      <div className="print:hidden flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* DESK SIDEBAR (Left Sub-navigation) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
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
              Admission Operations
            </p>

            <button
              onClick={() => setActiveView('wizard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'wizard'
                  ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <span>New Student Admission</span>
              </div>
              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                Active
              </span>
            </button>

            <button
              onClick={() => setActiveView('registry')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'registry'
                  ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-slate-500" />
                <span>Enrolled Students</span>
              </div>
              <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                1,420
              </span>
            </button>

            <button
              onClick={() => setActiveView('documents')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'documents'
                  ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4 text-slate-500" />
                <span>Doc Verification Desk</span>
              </div>
              <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                14
              </span>
            </button>

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

        {/* Office Operator & Sign Out Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Admin Office Terminal</p>
              <p className="text-[10px] text-slate-500">Admissions Counter</p>
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
              <span>Academic Year 2026-2027</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              CBSE Affiliation #1930412
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">142 Enrolled This Term</p>
              <p className="text-[10px] text-emerald-600 font-semibold">● Central Registry Live</p>
            </div>
          </div>
        </header>

        {/* VIEW 1: STAGE BY STAGE ADMISSION WIZARD */}
        {activeView === 'wizard' && (
          <main className="max-w-4xl mx-auto w-full px-6 py-8 pb-32 space-y-8">
            {/* Header Title */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Admissions Terminal • New Student Bio-Data Registry
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                New Student Admission & Bio-Data Registration
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Stage-by-stage registration for CBSE & State Board admissions. Automatically provisions parent login credentials and configures fee accounts.
              </p>
            </div>

            {/* STAGE-BY-STAGE PROGRESS STEPPER */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="grid grid-cols-5 gap-2">
                {stepsList.map((step) => {
                  const isDone = currentStep > step.no;
                  const isCurrent = currentStep === step.no;

                  return (
                    <button
                      key={step.no}
                      type="button"
                      onClick={() => setCurrentStep(step.no)}
                      className={`text-left p-2.5 rounded-xl transition-all ${
                        isCurrent
                          ? 'bg-indigo-50 border border-indigo-200 text-indigo-900'
                          : isDone
                          ? 'bg-emerald-50/50 border border-emerald-100 text-emerald-900'
                          : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                            isCurrent
                              ? 'bg-indigo-600 text-white'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isDone ? '✓' : step.no}
                        </span>
                        <span className="text-[11px] font-bold truncate">Stage {step.no}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-800 truncate">{step.title}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CONFIRMED ADMISSION MODAL / CARD */}
            {confirmedRegNo ? (
              <div className="bg-white p-8 rounded-2xl border-2 border-emerald-400 shadow-lg text-center space-y-5 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    ADMISSION REGISTRATION COMPLETED
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                    {studentName} is Enrolled!
                  </h2>
                  <p className="text-sm font-mono text-indigo-600 font-extrabold mt-1">
                    Student Registration Number: {confirmedRegNo}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Allocated Class:</span>
                    <strong className="text-slate-900">Class {selectedGrade} – Section A</strong>
                  </div>
                  {parseInt(selectedGrade) >= 11 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Stream Group:</span>
                      <strong className="text-slate-900">{selectedStream}</strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Parent Mobile (App Login):</span>
                    <strong className="text-slate-900">+91 {primaryPhone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Parent Portal PIN:</span>
                    <strong className="text-slate-900">Auto-generated via SMS</strong>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Admission Slip</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReceiptSent(true);
                      setTimeout(() => setReceiptSent(false), 6000);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Send Digital Receipt (SMS / WhatsApp)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmedRegNo(null);
                      setCurrentStep(1);
                      setStudentName('');
                      setAadhaar('');
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    + Register Another Student
                  </button>
                </div>

                {receiptSent && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Digital Receipt, Fee Invoice & Parent Mobile App Login PIN dispatched to +91 {primaryPhone} via SMS & WhatsApp!</span>
                  </div>
                )}
              </div>
            ) : (
              /* THE STEPPER FORM */
              <form onSubmit={handleConfirmAdmission} className="space-y-6">
                {/* STAGE 1: STUDENT BIO-DATA & IDENTITY */}
                {currentStep === 1 && (
                  <div className="bg-white p-6 lg:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                          STAGE 1 OF 5
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                          Student Bio-Data & Identity Verification
                        </h3>
                        <p className="text-xs text-slate-500">
                          Official civil records, birth certificate name, and Aadhaar identity
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        UIDAI Standard Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      {/* Photo Box */}
                      <div className="md:col-span-3 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <div className="w-24 h-28 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-slate-400 overflow-hidden border border-slate-300">
                          <User className="w-12 h-12 text-slate-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-800 mt-2.5">Passport Photo</p>
                        <p className="text-[10px] text-slate-400">2x2" white background</p>
                        <button
                          type="button"
                          onClick={() => alert('Photo selected from webcam/scanner.')}
                          className="mt-3 px-3 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-indigo-600 hover:bg-slate-50 shadow-xs flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                        </button>
                      </div>

                      {/* Bio-data Fields */}
                      <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Full Name (As per Birth Certificate / Aadhaar) *
                          </label>
                          <input
                            type="text"
                            required
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="e.g. Aditya Vikram R."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            required
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Gender *
                          </label>
                          <div className="flex rounded-xl bg-slate-100 p-1">
                            {['Male', 'Female', 'Other'].map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setGender(g)}
                                className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                                  gender === g ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                                }`}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Blood Group *
                          </label>
                          <select
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white"
                          >
                            <option value="O+">O+ (Positive)</option>
                            <option value="O-">O- (Negative)</option>
                            <option value="A+">A+ (Positive)</option>
                            <option value="A-">A- (Negative)</option>
                            <option value="B+">B+ (Positive)</option>
                            <option value="B-">B- (Negative)</option>
                            <option value="AB+">AB+ (Positive)</option>
                            <option value="AB-">AB- (Negative)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Aadhaar Card Number (12 Digits) *
                          </label>
                          <input
                            type="text"
                            required
                            value={aadhaar}
                            onChange={(e) => setAadhaar(e.target.value)}
                            placeholder="5421 8902 4310"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-semibold text-slate-900 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Caste / Social Category
                          </label>
                          <select
                            value={casteCategory}
                            onChange={(e) => setCasteCategory(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white"
                          >
                            <option value="General">General / OC</option>
                            <option value="OBC">OBC (Non-Creamy Layer)</option>
                            <option value="SC">Scheduled Caste (SC)</option>
                            <option value="ST">Scheduled Tribe (ST)</option>
                            <option value="EWS">EWS / RTE Quota</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Mother Tongue *
                          </label>
                          <div className="space-y-1.5">
                            <select
                              value={motherTongue}
                              onChange={(e) => setMotherTongue(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white"
                            >
                              <option value="Tamil">Tamil</option>
                              <option value="English">English</option>
                              <option value="Hindi">Hindi</option>
                              <option value="Telugu">Telugu</option>
                              <option value="Malayalam">Malayalam</option>
                              <option value="Kannada">Kannada</option>
                              <option value="Bengali">Bengali</option>
                              <option value="Marathi">Marathi</option>
                              <option value="Gujarati">Gujarati</option>
                              <option value="Other">Other (Custom Specify)</option>
                            </select>
                            {motherTongue === 'Other' && (
                              <input
                                type="text"
                                placeholder="Type custom mother tongue..."
                                value={customMotherTongue}
                                onChange={(e) => setCustomMotherTongue(e.target.value)}
                                className="w-full bg-white border border-indigo-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 2: CLASS, STREAM & BOARD ALLOCATION */}
                {currentStep === 2 && (
                  <div className="bg-white p-6 lg:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                          STAGE 2 OF 5
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                          Class, Stream & Board Allocation
                        </h3>
                        <p className="text-xs text-slate-500">
                          Grade level, Higher Secondary group selection, and language options
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Admission Grade Level *
                        </label>
                        <select
                          value={selectedGrade}
                          onChange={(e) => setSelectedGrade(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white"
                        >
                          <option value="Nursery">Nursery / Kindergarten</option>
                          <option value="1">Class 1 (Primary)</option>
                          <option value="2">Class 2</option>
                          <option value="3">Class 3</option>
                          <option value="4">Class 4</option>
                          <option value="5">Class 5</option>
                          <option value="6">Class 6 (Middle School)</option>
                          <option value="7">Class 7</option>
                          <option value="8">Class 8</option>
                          <option value="9">Class 9 (CBSE Secondary Foundation)</option>
                          <option value="10">Class 10 (CBSE Board AISSE)</option>
                          <option value="11">Class 11 (Higher Secondary Stream Specialization)</option>
                          <option value="12">Class 12 (CBSE Board AISSCE)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Second Language Choice *
                        </label>
                        <select
                          value={secondLang}
                          onChange={(e) => setSecondLang(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white"
                        >
                          <option value="Hindi">Hindi (Course A)</option>
                          <option value="Tamil">Tamil (State / CBSE)</option>
                          <option value="Sanskrit">Sanskrit (Classical)</option>
                          <option value="French">French (Foreign Lang)</option>
                        </select>
                      </div>
                    </div>

                    {/* HIGHER SECONDARY STREAM SELECTOR (Only shown for 11 & 12) */}
                    {parseInt(selectedGrade) >= 11 && (
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Choose Stream Group (Classes 11 & 12) *
                          </label>
                          <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                            CBSE Curriculum Aligned
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {streams.map((stream) => {
                            const isSelected = selectedStream === stream.id;
                            return (
                              <button
                                key={stream.id}
                                type="button"
                                onClick={() => setSelectedStream(stream.id)}
                                className={`text-left p-4 rounded-xl border transition-all ${
                                  isSelected
                                    ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20'
                                    : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="font-extrabold text-xs text-slate-900">
                                    {stream.title}
                                  </span>
                                  <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                                    {stream.tag}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                                  {stream.subjects}
                                </p>
                                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                                  <span>{stream.lab}</span>
                                  <span className="text-emerald-700 font-bold">{stream.seats}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STAGE 3: PARENT & GUARDIAN BIO-DATA */}
                {currentStep === 3 && (
                  <div className="bg-white p-6 lg:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                          STAGE 3 OF 5
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                          Parent & Guardian Bio-Data
                        </h3>
                        <p className="text-xs text-slate-500">
                          Critical contact details powering the Parent Mobile App login and notification delivery
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Father / Primary Guardian Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={fatherName}
                          onChange={(e) => setFatherName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Father's Occupation & Employer
                        </label>
                        <input
                          type="text"
                          value={fatherOcc}
                          onChange={(e) => setFatherOcc(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Mother's Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={motherName}
                          onChange={(e) => setMotherName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Primary Mobile (Parent App Login Username) *</span>
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-xs text-slate-500 font-bold">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            value={primaryPhone}
                            onChange={(e) => setPrimaryPhone(e.target.value)}
                            placeholder="98402 71829"
                            className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Parent Email Address
                        </label>
                        <input
                          type="email"
                          value={parentEmail}
                          onChange={(e) => setParentEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Permanent Residential Address *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 4: FEE STRUCTURE & TRANSPORT */}
                {currentStep === 4 && (
                  <div className="bg-white p-6 lg:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                          STAGE 4 OF 5
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                          Fee Schedule & School Transport Setup
                        </h3>
                        <p className="text-xs text-slate-500">
                          Tuition schedule, concession eligibility, and bus route allocation
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Fee Billing Cycle Preference *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { id: '3terms', label: '3 Equal Terms', desc: 'Term 1, Term 2 & Annual Board Term', tag: 'Standard' },
                            { id: '4quarters', label: 'Quarterly (4 Terms)', desc: 'Apr, Jul, Oct & Jan installments', tag: 'Flexible' },
                            { id: 'annual', label: 'Annual One-Time', desc: 'Includes 5% upfront fee waiver', tag: '5% Off' },
                          ].map((cycle) => (
                            <button
                              key={cycle.id}
                              type="button"
                              onClick={() => setFeeCycle(cycle.id as any)}
                              className={`p-3.5 rounded-xl border text-left transition-all ${
                                feeCycle === cycle.id
                                  ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-extrabold text-xs text-slate-900">{cycle.label}</span>
                                <span className="text-[9px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                                  {cycle.tag}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">{cycle.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dynamic Fee Breakdown Box based on selected Billing Cycle (Image 3 fix) */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2.5">
                        <div className="flex justify-between text-slate-600">
                          <span>Tuition Fee (Annual Base)</span>
                          <span className="font-bold text-slate-900">₹{baseTuition.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>CBSE Composite Science & Computer Lab Fund</span>
                          <span className="font-bold text-slate-900">₹{labFund.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Sports, Library & Smart Campus Tech Fee</span>
                          <span className="font-bold text-slate-900">₹{sportsTechFee.toLocaleString('en-IN')}</span>
                        </div>
                        {transportRequired && (
                          <div className="flex justify-between text-slate-600">
                            <span>School GPS Bus Transport (Annual)</span>
                            <span className="font-bold text-indigo-700">₹{transportFee.toLocaleString('en-IN')}</span>
                          </div>
                        )}

                        {feeCycle === 'annual' && (
                          <div className="flex justify-between text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200/80 font-bold">
                            <span>5% Upfront Annual Fee Waiver Applied</span>
                            <span>-₹{annualDiscount.toLocaleString('en-IN')}</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                          <span>
                            {feeCycle === 'annual'
                              ? 'Net Annual Account Payable (Cleared Today)'
                              : 'Total Annual Account Receivable'}
                          </span>
                          <span className="text-indigo-700">
                            ₹{netAnnual.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Installment breakdown banner for Terms / Quarters */}
                        {feeCycle !== 'annual' && (
                          <div className="pt-2 border-t border-dashed border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase">
                              <span>Installment Schedule ({feeCycle === '3terms' ? '3 Terms' : '4 Quarters'})</span>
                              <span className="text-indigo-600">Due Today: ₹{dueToday.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                              {feeCycle === '3terms' ? (
                                <>
                                  <div className="bg-indigo-50 border border-indigo-200/60 p-2 rounded-lg">
                                    <span className="text-[10px] text-indigo-700 font-bold block">Term 1 (Today)</span>
                                    <span className="font-extrabold text-xs text-indigo-950">₹{dueToday.toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="bg-white border border-slate-200 p-2 rounded-lg">
                                    <span className="text-[10px] text-slate-500 font-bold block">Term 2 (10 Oct)</span>
                                    <span className="font-extrabold text-xs text-slate-800">₹{Math.round(grossAnnual / 3).toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="bg-white border border-slate-200 p-2 rounded-lg sm:col-span-2">
                                    <span className="text-[10px] text-slate-500 font-bold block">Term 3 (15 Jan)</span>
                                    <span className="font-extrabold text-xs text-slate-800">₹{Math.round(grossAnnual / 3).toLocaleString('en-IN')}</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="bg-indigo-50 border border-indigo-200/60 p-2 rounded-lg">
                                    <span className="text-[10px] text-indigo-700 font-bold block">Q1 (Today)</span>
                                    <span className="font-extrabold text-xs text-indigo-950">₹{dueToday.toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="bg-white border border-slate-200 p-2 rounded-lg">
                                    <span className="text-[10px] text-slate-500 font-bold block">Q2 (10 Jul)</span>
                                    <span className="font-extrabold text-xs text-slate-800">₹{Math.round(grossAnnual / 4).toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="bg-white border border-slate-200 p-2 rounded-lg">
                                    <span className="text-[10px] text-slate-500 font-bold block">Q3 (10 Oct)</span>
                                    <span className="font-extrabold text-xs text-slate-800">₹{Math.round(grossAnnual / 4).toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="bg-white border border-slate-200 p-2 rounded-lg">
                                    <span className="text-[10px] text-slate-500 font-bold block">Q4 (10 Jan)</span>
                                    <span className="font-extrabold text-xs text-slate-800">₹{Math.round(grossAnnual / 4).toLocaleString('en-IN')}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Transport Toggle */}
                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Bus className="w-5 h-5 text-indigo-600" />
                            <div>
                              <p className="text-xs font-bold text-slate-900">
                                Opt for School Bus Transport
                              </p>
                              <p className="text-[11px] text-slate-500">
                                Live GPS tracking integrated with Parent Mobile App
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setTransportRequired(!transportRequired)}
                            className={`w-11 h-6 rounded-full transition-colors relative ${
                              transportRequired ? 'bg-indigo-600' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                                transportRequired ? 'left-5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>

                        {transportRequired && (
                          <div className="pt-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                              Select Bus Route
                            </label>
                            <select
                              value={busRoute}
                              onChange={(e) => setBusRoute(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900"
                            >
                              <option value="Route #4: Anna Nagar West → Campus">
                                Route #4: Anna Nagar West → Roundtana → Campus
                              </option>
                              <option value="Route #2: Kilpauk → Shenoy Nagar → Campus">
                                Route #2: Kilpauk → Shenoy Nagar → Campus
                              </option>
                              <option value="Route #8: Mogappair East → Nolambur → Campus">
                                Route #8: Mogappair East → Nolambur → Campus
                              </option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STAGE 5: FINAL REVIEW & CONFIRM */}
                {currentStep === 5 && (
                  <div className="bg-white p-6 lg:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                          STAGE 5 OF 5
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                          Final Review & Instant Admission Generation
                        </h3>
                        <p className="text-xs text-slate-500">
                          Verify student bio-data summary before issuing the permanent registration number
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">STUDENT NAME</p>
                          <p className="font-extrabold text-slate-900 text-sm mt-0.5">{studentName}</p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">CLASS & BOARD</p>
                          <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                            Class {selectedGrade} • CBSE Affiliated
                          </p>
                        </div>

                        {parseInt(selectedGrade) >= 11 && (
                          <div className="sm:col-span-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">STREAM GROUP</p>
                            <p className="font-bold text-indigo-700 mt-0.5">{selectedStream}</p>
                          </div>
                        )}

                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">PARENT MOBILE</p>
                          <p className="font-mono font-bold text-slate-900 mt-0.5">+91 {primaryPhone}</p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">AADHAAR #</p>
                          <p className="font-mono text-slate-700 mt-0.5">{aadhaar}</p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">FATHER'S NAME</p>
                          <p className="font-semibold text-slate-900 mt-0.5">{fatherName}</p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">FEE SCHEDULE</p>
                          <p className="font-semibold text-slate-900 mt-0.5">
                            {feeCycle === '3terms' ? '3 Terms' : feeCycle === 'annual' ? 'Annual One-Time' : 'Quarterly'}
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">RESIDENTIAL ADDRESS</p>
                          <p className="text-slate-700 mt-0.5">{address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEPPER NAVIGATION BUTTONS */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back: Stage {currentStep - 1}</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-300 transition-all"
                    >
                      <span>Continue to Stage {currentStep + 1}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-lg shadow-emerald-200 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm Admission & Generate Student Reg No</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </main>
        )}

        {/* VIEW 2: ENROLLED STUDENTS REGISTRY TABLE */}
        {activeView === 'registry' && (
          <main className="max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Enrolled Students Registry
                  </h2>
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    {(enrolledStudents.length > 0 ? enrolledStudents : [1, 2, 3, 4, 5, 6]).length} Active Records
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Central CBSE student master registry. Search, inspect 360° profiles, and verify Aadhaar civil records.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveView('wizard')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ New Student Admission</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by student name, admission #, phone..."
                  value={registrySearch}
                  onChange={(e) => setRegistrySearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={registryClassFilter}
                  onChange={(e) => setRegistryClassFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 font-semibold focus:outline-none"
                >
                  <option value="ALL">All Classes (Nursery - 12)</option>
                  <option value="12">Class 12</option>
                  <option value="11">Class 11</option>
                  <option value="10">Class 10</option>
                  <option value="9">Class 9</option>
                  <option value="8">Class 8</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">STUDENT NAME & BIO</th>
                      <th className="py-3.5 px-4">GRADE & STREAM</th>
                      <th className="py-3.5 px-4">PARENT / GUARDIAN</th>
                      <th className="py-3.5 px-4">ADMISSION DATE</th>
                      <th className="py-3.5 px-4">VERIFICATION</th>
                      <th className="py-3.5 px-4">FEE STATUS</th>
                      <th className="py-3.5 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(enrolledStudents.length > 0
                      ? enrolledStudents
                      : [
                          {
                            id: '44444444-4444-4444-4444-000000000001',
                            first_name: 'Rahul',
                            last_name: 'Suresh',
                            admission_no: 'GW-2026-0842',
                            roll_no: '18',
                            classes_sections: { grade: 8, section: 'B', stream: 'General Secondary' },
                            parents_guardians: { father_name: 'Mr. Suresh Ramanathan', father_phone: '+91 98401 23456' },
                            admission_date: '2026-07-14',
                            admission_type: 'New CBSE Admission',
                            verification_status: 'UIDAI Aadhaar Verified',
                            fee_status: 'Cleared',
                          },
                          {
                            id: '44444444-4444-4444-4444-000000000002',
                            first_name: 'Aanya',
                            last_name: 'Arvind',
                            admission_no: 'GW-2026-0104',
                            roll_no: '04',
                            classes_sections: { grade: 10, section: 'A', stream: 'CBSE Board Secondary' },
                            parents_guardians: { father_name: 'Dr. Arvind Swaminathan', father_phone: '+91 98402 11223' },
                            admission_date: '2026-06-10',
                            admission_type: 'New CBSE Admission',
                            verification_status: 'UIDAI Aadhaar Verified',
                            fee_status: 'Cleared',
                          },
                          {
                            id: '44444444-4444-4444-4444-000000000003',
                            first_name: 'Rohan',
                            last_name: 'Mehra',
                            admission_no: 'GW-2026-0112',
                            roll_no: '12',
                            classes_sections: { grade: 11, section: 'A', stream: 'PCM-CS' },
                            parents_guardians: { father_name: 'Mr. Rajesh Mehra', father_phone: '+91 98403 99887' },
                            admission_date: '2026-06-15',
                            admission_type: 'New CBSE Admission',
                            verification_status: 'UIDAI Aadhaar Verified',
                            fee_status: 'Cleared',
                          },
                          {
                            id: '44444444-4444-4444-4444-000000000004',
                            first_name: 'Priya',
                            last_name: 'Murali',
                            admission_no: 'GW-2026-0220',
                            roll_no: '21',
                            classes_sections: { grade: 12, section: 'B', stream: 'Commerce with Maths' },
                            parents_guardians: { father_name: 'Mr. Murali Krishnan', father_phone: '+91 98404 55667' },
                            admission_date: '2026-06-18',
                            admission_type: 'Promoted',
                            verification_status: 'UIDAI Aadhaar Verified',
                            fee_status: 'Pending',
                          },
                          {
                            id: '44444444-4444-4444-4444-000000000005',
                            first_name: 'Aditya',
                            last_name: 'Vikram',
                            admission_no: 'GW-2026-0845',
                            roll_no: '07',
                            classes_sections: { grade: 8, section: 'B', stream: 'General Secondary' },
                            parents_guardians: { father_name: 'Mr. Rajesh Kumar', father_phone: '+91 98402 71829' },
                            admission_date: '2026-07-15',
                            admission_type: 'New CBSE Admission',
                            verification_status: 'UIDAI Aadhaar Verified',
                            fee_status: 'Cleared',
                          },
                        ]
                    )
                      .filter((s: any) => {
                        const fullName = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase();
                        const matchesSearch =
                          fullName.includes(registrySearch.toLowerCase()) ||
                          (s.admission_no || '').toLowerCase().includes(registrySearch.toLowerCase()) ||
                          (s.parents_guardians?.father_phone || '').includes(registrySearch);

                        const grade = s.classes_sections?.grade?.toString() || '';
                        const matchesClass = registryClassFilter === 'ALL' || grade === registryClassFilter;

                        return matchesSearch && matchesClass;
                      })
                      .map((s: any) => {
                        const fullName = `${s.first_name || ''} ${s.last_name || ''}`.trim();
                        const initials = `${s.first_name?.[0] || 'S'}${s.last_name?.[0] || 'T'}`;
                        const grade = s.classes_sections?.grade
                          ? `Class ${s.classes_sections.grade}-${s.classes_sections.section}`
                          : 'Class 8-B';
                        const stream = s.stream || s.classes_sections?.stream || 'General';
                        const fatherName = s.parents_guardians?.father_name || 'Mr. Suresh Ramanathan';
                        const fatherPhone = s.parents_guardians?.father_phone || '+91 98401 23456';

                        return (
                          <tr key={s.id || s.admission_no} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center shrink-0">
                                  {initials}
                                </div>
                                <div>
                                  <p className="font-extrabold text-slate-900 text-sm">{fullName}</p>
                                  <p className="text-[10px] text-slate-400 font-mono font-medium">
                                    {s.admission_no} • Roll #{s.roll_no || '18'}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="inline-block font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md text-[11px]">
                                {grade}
                              </span>
                              <p className="text-[10px] text-slate-400 mt-0.5">{stream}</p>
                            </td>

                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-slate-800">{fatherName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{fatherPhone}</p>
                            </td>

                            <td className="py-3.5 px-4">
                              <p className="font-medium text-slate-700">{s.admission_date || '2026-07-14'}</p>
                              <p className="text-[10px] text-slate-400">{s.admission_type || 'New CBSE Admission'}</p>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                {s.verification_status || 'UIDAI Aadhaar Verified'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                  s.fee_status === 'Cleared'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : s.fee_status === 'Partial'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                ● {s.fee_status || 'Cleared'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <Link
                                href={`/students/${s.id || s.admission_no}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all shadow-2xs"
                              >
                                <span>View 360° Profile</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* VIEW 3: DOCUMENT VERIFICATION & FEES */}
        {activeView === 'documents' && (
          <main className="max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Document Verification & Fee Clearance Desk
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review birth certificates, transfer certificates (TC), and Aadhaar cards for new joiners
              </p>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Aditya Vikram R.', class: 'Class 11-A', doc: 'Previous School TC & 10th Marksheet', status: 'Verified' },
                { name: 'Harish Kalyan', class: 'Class 9-C', doc: 'Birth Certificate & Aadhaar Copy', status: 'Pending Review' },
                { name: 'Deepak Raman', class: 'Class 10-A', doc: 'Migration Certificate (CBSE)', status: 'Verified' },
              ].map((doc, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{doc.name} ({doc.class})</h4>
                    <p className="text-xs text-slate-500">{doc.doc}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </main>
        )}
      </div>
    </div>

    {/* PRINT-ONLY OFFICIAL ADMISSION CHALLAN & FEE RECEIPT */}
    <div className="hidden print:block min-h-screen p-8 bg-white text-slate-900 font-sans leading-relaxed">
      <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
        <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">
          GREENWOOD ACADEMY
        </h1>
        <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">
          Senior Secondary CBSE School • Affiliation No. 1930412
        </p>
        <p className="text-[11px] text-slate-600">
          Campus: 42, Rajiv Gandhi Salai (OMR), Sholinganallur, Chennai, Tamil Nadu – 600119
        </p>
        <p className="text-[10px] text-slate-500">
          Official Front Office & Admission Desk • Registration Receipt
        </p>
      </div>

      <div className="flex justify-between items-center text-xs font-bold text-slate-800 py-3 border-b border-slate-200">
        <span>Registration No: <strong className="font-mono text-indigo-700">{confirmedRegNo || 'GW-2026-0842'}</strong></span>
        <span>Date of Admission: 14 September 2026</span>
      </div>

      <div className="my-6 border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 text-xs">
        <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">STUDENT & PARENT PARTICULARS</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Student Legal Name</span>
            <span className="font-extrabold text-slate-900 text-sm">{studentName}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Allocated Class & Section</span>
            <span className="font-extrabold text-slate-900 text-sm">Class {selectedGrade} – Section A {parseInt(selectedGrade) >= 11 ? `(${selectedStream})` : ''}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Father / Guardian Name</span>
            <span className="font-bold text-slate-800">{fatherName}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Primary Mobile (Parent App Login)</span>
            <span className="font-mono font-bold text-slate-900">+91 {primaryPhone}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">School Transport Commute</span>
            <span className="font-bold text-slate-800">{transportRequired ? busRoute : 'Self / Own Conveyance'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Date of Birth & Gender</span>
            <span className="font-bold text-slate-800">{dob} ({gender})</span>
          </div>
        </div>
      </div>

      {/* FEE SUMMARY TABLE */}
      <div className="my-6 space-y-2">
        <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">FEE ASSESSMENT & CHALLAN VOUCHER</h3>
        <table className="w-full text-xs border border-slate-200">
          <thead className="bg-slate-100 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-2 border text-left">Fee Head</th>
              <th className="p-2 border text-left">Periodicity</th>
              <th className="p-2 border text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">Annual Tuition Base Fee</td>
              <td className="p-2 border">Annual AY 2026-27</td>
              <td className="p-2 border text-right font-mono">₹72,000</td>
            </tr>
            <tr>
              <td className="p-2 border">CBSE Composite Science & Computer Lab Fund</td>
              <td className="p-2 border">Annual</td>
              <td className="p-2 border text-right font-mono">₹14,500</td>
            </tr>
            <tr>
              <td className="p-2 border">Sports, Library & Smart Campus Tech Fee</td>
              <td className="p-2 border">Annual</td>
              <td className="p-2 border text-right font-mono">₹8,000</td>
            </tr>
            {transportRequired && (
              <tr>
                <td className="p-2 border">School GPS Bus Transport Fee</td>
                <td className="p-2 border">Annual</td>
                <td className="p-2 border text-right font-mono">₹22,000</td>
              </tr>
            )}
            {feeCycle === 'annual' && (
              <tr className="bg-emerald-50 text-emerald-800 font-bold">
                <td className="p-2 border">5% Upfront Lumsum Discount</td>
                <td className="p-2 border">Annual Waiver</td>
                <td className="p-2 border text-right font-mono">-₹{annualDiscount.toLocaleString('en-IN')}</td>
              </tr>
            )}
            <tr className="font-bold bg-slate-50 text-slate-900">
              <td colSpan={2} className="p-2 border text-right uppercase">Net Total Account</td>
              <td className="p-2 border text-right font-mono text-sm">₹{netAnnual.toLocaleString('en-IN')}</td>
            </tr>
            <tr className="font-extrabold bg-indigo-50 text-indigo-950">
              <td colSpan={2} className="p-2 border text-right uppercase">Amount Paid Today ({feeCycle === 'annual' ? 'Full Settlement' : feeCycle === '3terms' ? 'Term 1 Installment' : 'Q1 Installment'})</td>
              <td className="p-2 border text-right font-mono text-sm">₹{dueToday.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="pt-16 grid grid-cols-2 text-center text-xs">
        <div>
          <div className="border-t border-slate-800 pt-2 font-bold w-48 mx-auto">
            Parent / Guardian Signature
          </div>
        </div>
        <div>
          <div className="border-t border-slate-800 pt-2 font-bold w-48 mx-auto">
            Authorized Cashier / Admission Officer
          </div>
          <p className="text-[10px] text-slate-500 pt-1">Greenwood Academy Front Desk</p>
        </div>
      </div>
    </div>
  </>
  );
}
