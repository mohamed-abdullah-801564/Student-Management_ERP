'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
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
} from 'lucide-react';

export default function StudentAdmissionRegistryPage() {
  const [selectedGrade, setSelectedGrade] = useState('11');
  const [selectedStream, setSelectedStream] = useState('PCM_CS');
  const [gender, setGender] = useState('Male');
  const [feeCycle, setFeeCycle] = useState<'3terms' | '4quarters'>('3terms');
  const [transportRequired, setTransportRequired] = useState(true);

  // Form inputs
  const [studentName, setStudentName] = useState('Aditya Vikram R.');
  const [dob, setDob] = useState('2010-07-14');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [aadhaar, setAadhaar] = useState('5421 8902 4310');
  const [fatherName, setFatherName] = useState('Mr. R. Rajesh Kumar');
  const [fatherOcc, setFatherOcc] = useState('Senior Software Architect • Cognizant');
  const [motherName, setMotherName] = useState('Mrs. Meena Rajesh');
  const [primaryPhone, setPrimaryPhone] = useState('98402 71829');
  const [address, setAddress] = useState('Plot 42, 4th Main Road, Anna Nagar West, Chennai - 600040');

  const streams = [
    {
      id: 'PCM_CS',
      title: 'Group I: PCM + Computer Science',
      subjects: 'Physics, Chemistry, Mathematics, Computer Science, English Core',
      tag: 'Popular Choice',
      lab: 'CS Python Lab • Physics Lab',
      seats: '6 available in Batch 11-A',
    },
    {
      id: 'PCMB',
      title: 'Group II: Bio-Maths / PCM-B',
      subjects: 'Physics, Chemistry, Mathematics, Biology, English Core',
      tag: 'NEET Track',
      lab: 'Botany / Zoology Laboratory',
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
      tag: 'Law & Civils',
      lab: 'Social Dynamics Research Center',
      seats: '18 available in Batch 11-D',
    },
  ];

  const handleConfirmAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    const regNo = `GW-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    alert(
      `Admission Confirmed!\n\nStudent: ${studentName}\nReg Number: ${regNo}\nClass: Grade ${selectedGrade}-A\nStream: ${selectedStream}\nPrimary Mobile for Parent App: +91 ${primaryPhone}\n\nSMS notification with Parent App login credentials dispatched to +91 ${primaryPhone}!`
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-24">
      {/* HEADER */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">
                Greenwood Academy
              </h2>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Administrative Front Office Desk
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>AY 2026-2027</span>
          </div>

          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-900">
              142 Enrolled This Term
            </p>
            <p className="text-[10px] text-emerald-600 font-semibold">
              ● Central Registry Live
            </p>
          </div>

          <Link
            href="/"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            Switch to Principal View →
          </Link>
        </div>
      </header>

      {/* FORM BODY */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Admissions Terminal • New Student Bio-Data Registry
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Admission & Enrollment Registry
          </h1>
          <p className="text-xs lg:text-sm text-slate-500 mt-1">
            Central registry desk for CBSE / State Board enrollments. Automatically provisions parent login credentials and configures fee accounts.
          </p>
        </div>

        <form onSubmit={handleConfirmAdmission} className="space-y-6">
          {/* CARD 1: STUDENT BIO-DATA & IDENTITY */}
          <div className="bg-white p-6 lg:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center">
                  01
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Student Bio-Data & Identity
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official civil records and government identity verification
                  </p>
                </div>
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
                <p className="text-xs font-bold text-slate-800 mt-2.5">
                  Passport Photo
                </p>
                <p className="text-[10px] text-slate-400">2x2" white background</p>
                <button
                  type="button"
                  className="mt-3 px-3 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-indigo-600 hover:bg-slate-50 shadow-xs flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
              </div>

              {/* Bio-Data Inputs */}
              <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Full Name (as per Birth Certificate / Aadhaar) *
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Gender
                  </label>
                  <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                    {['Male', 'Female', 'Other'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`flex-1 py-1 rounded-lg transition-all ${
                          gender === g
                            ? 'bg-white text-indigo-700 font-bold shadow-xs'
                            : 'text-slate-600'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="O+">O+ (Positive)</option>
                    <option value="A+">A+ (Positive)</option>
                    <option value="B+">B+ (Positive)</option>
                    <option value="AB+">AB+ (Positive)</option>
                    <option value="O-">O- (Negative)</option>
                    <option value="A-">A- (Negative)</option>
                    <option value="B-">B- (Negative)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Aadhaar Card Number (12 Digits)
                  </label>
                  <input
                    type="text"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    placeholder="XXXX XXXX XXXX"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: ACADEMIC PLACEMENT & HIGHER SECONDARY STREAM */}
          <div className="bg-white p-6 lg:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center">
                  02
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Academic Placement & Stream Selection
                  </h3>
                  <p className="text-xs text-slate-500">
                    Target cohort allocation, elective stream choice, and previous TC verification
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Target Grade Level
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="11">Grade 11 (Senior Secondary Yr 1)</option>
                  <option value="12">Grade 12 (Senior Secondary Yr 2)</option>
                  <option value="10">Grade 10 (High School)</option>
                  <option value="9">Grade 9 (High School)</option>
                  <option value="8">Grade 8 (Middle School)</option>
                  <option value="7">Grade 7 (Middle School)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Section Allocation
                </label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white">
                  <option value="A">Section A (Room 204 • 28/32 seats)</option>
                  <option value="B">Section B (Room 206 • 30/32 seats)</option>
                  <option value="C">Section C (Room 208 • 24/32 seats)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Second Language Option
                </label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white">
                  <option value="Tamil">Tamil (Higher Standard)</option>
                  <option value="Hindi">Hindi (Core)</option>
                  <option value="French">French (Introductory)</option>
                  <option value="Sanskrit">Sanskrit (Classical)</option>
                </select>
              </div>
            </div>

            {/* DYNAMIC STREAM SELECTOR (Active for Grades 11 & 12) */}
            {(selectedGrade === '11' || selectedGrade === '12') && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Higher Secondary Stream Specialization</span>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Determines lab batches, exam papers, and subject teacher roster
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {streams.map((stream) => {
                    const isSelected = selectedStream === stream.id;

                    return (
                      <div
                        key={stream.id}
                        onClick={() => setSelectedStream(stream.id)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">
                              {stream.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              {stream.subjects}
                            </p>
                          </div>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {stream.tag}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                          <span className="text-indigo-700 font-semibold">
                            {stream.lab}
                          </span>
                          <span className="text-slate-400">
                            {stream.seats}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Previous School & TC Row */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Previous School Attended
                </label>
                <input
                  type="text"
                  defaultValue="St. Michael's Matriculation Higher Secondary School"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Transfer Certificate (TC) Number
                </label>
                <input
                  type="text"
                  defaultValue="TC-2026-CH-0941"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 uppercase"
                />
              </div>
            </div>
          </div>

          {/* CARD 3: PARENT & MOBILE APP CONTACT */}
          <div className="bg-white p-6 lg:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center">
                  03
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Parent & Mobile App Contact
                  </h3>
                  <p className="text-xs text-slate-500">
                    Authorized guardians and mobile OTP login credentials
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                Parent App Auto-Provisioning
              </span>
            </div>

            {/* CRITICAL NOTICE BANNER */}
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-indigo-900">
                  Critical: Primary Guardian Mobile Number for App Access
                </h4>
                <p className="text-[11px] text-indigo-700 mt-0.5 leading-relaxed">
                  The primary phone number entered below will receive OTP verification codes to log into the Oakridge Parent App. It will receive instant push notifications for morning attendance, homework, and fee receipts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Father's Full Name *
                </label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Father's Occupation & Company
                </label>
                <input
                  type="text"
                  value={fatherOcc}
                  onChange={(e) => setFatherOcc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Mother's Full Name
                </label>
                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Primary Mobile Number (OTP for Parent App) *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-xs font-bold text-slate-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={primaryPhone}
                    onChange={(e) => setPrimaryPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    placeholder="98401 XXXXX"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Residential Street Address & Pincode *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* CARD 4: FEE SCHEDULE & TRANSPORT */}
          <div className="bg-white p-6 lg:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center">
                  04
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Fee Schedule & Transport Setup
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configures quarterly vs term billing and school bus pick-up route
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Tuition Fee Payment Frequency
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setFeeCycle('3terms')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      feeCycle === '3terms'
                        ? 'border-indigo-600 bg-indigo-50/50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900">3 Terms / Year</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Term 1, Term 2, Term 3 (CBSE Standard)
                    </p>
                  </div>

                  <div
                    onClick={() => setFeeCycle('4quarters')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      feeCycle === '4quarters'
                        ? 'border-indigo-600 bg-indigo-50/50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900">4 Quarters / Year</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Q1 (Jun), Q2 (Sep), Q3 (Dec), Q4 (Feb)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    School Bus / Van Transport
                  </label>
                  <button
                    type="button"
                    onClick={() => setTransportRequired(!transportRequired)}
                    className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                      transportRequired
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {transportRequired ? 'Transport Required' : 'No Transport (Own)'}
                  </button>
                </div>

                {transportRequired && (
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900">
                    <option value="route_4">Route #4: Anna Nagar West → School Campus</option>
                    <option value="route_2">Route #2: Kilpauk → Shenoy Nagar → Campus</option>
                    <option value="route_8">Route #8: Mogappair East → Campus</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM STICKY ACTION BAR */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 lg:px-12 py-3.5 z-40 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-800">
                Application Status: Ready for Final Confirmation
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => alert('Application saved as draft in admissions queue.')}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-300 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Admission & Generate Student Reg No</span>
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
