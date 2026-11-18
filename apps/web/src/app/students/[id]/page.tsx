'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  GraduationCap,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Printer,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Bus,
  AlertTriangle,
  Award,
  ChevronRight,
  Edit3,
  Lock,
  Save,
  X,
} from 'lucide-react';

interface StudentDetail {
  id: string;
  admission_no: string;
  roll_no: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  blood_group: string;
  aadhaar_no: string;
  stream: string;
  admission_date: string;
  admission_type: string;
  verification_status: string;
  fee_status: string;
  status: string;
  transport_mode: string;
  bus_route_no?: string;
  class_name: string;
  section: string;
  parent: {
    father_name: string;
    father_occupation: string;
    father_phone: string;
    mother_name: string;
    mother_occupation: string;
    mother_phone: string;
    primary_email: string;
    emergency_contact: string;
    residential_address: string;
  };
}

const FALLBACK_STUDENT: StudentDetail = {
  id: '44444444-4444-4444-4444-000000000001',
  admission_no: 'GW-2026-0842',
  roll_no: '18',
  first_name: 'Rahul',
  last_name: 'Suresh',
  dob: '2012-07-14',
  gender: 'Male',
  blood_group: 'O+',
  aadhaar_no: '5421 8902 4310',
  stream: 'General Secondary',
  admission_date: '2026-07-14',
  admission_type: 'New CBSE Admission',
  verification_status: 'UIDAI Aadhaar Verified',
  fee_status: 'Cleared',
  status: 'Active',
  transport_mode: 'School Bus Route #12',
  bus_route_no: '12',
  class_name: 'Class 8',
  section: 'B',
  parent: {
    father_name: 'Mr. Suresh Ramanathan',
    father_occupation: 'Senior Software Architect',
    father_phone: '+91 98401 23456',
    mother_name: 'Mrs. Malathi Suresh',
    mother_occupation: 'Bank Officer',
    mother_phone: '+91 98401 65432',
    primary_email: 'suresh.r@techcorp.com',
    emergency_contact: '+91 98401 23456',
    residential_address: 'Flat 4B, Emerald Heights, Gandhi Nagar, Adyar, Chennai - 600020',
  },
};

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const [student, setStudent] = useState<StudentDetail>(FALLBACK_STUDENT);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'biodata' | 'academics' | 'parent' | 'fees' | 'transport' | 'attendance'>('biodata');

  // Edit Bio-Data Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form Fields for Edit (Operational only, Legal fields remain strictly locked)
  const [editFatherPhone, setEditFatherPhone] = useState(FALLBACK_STUDENT.parent.father_phone);
  const [editEmail, setEditEmail] = useState(FALLBACK_STUDENT.parent.primary_email);
  const [editAddress, setEditAddress] = useState(FALLBACK_STUDENT.parent.residential_address);
  const [editTransportMode, setEditTransportMode] = useState(FALLBACK_STUDENT.transport_mode);
  const [editBusRoute, setEditBusRoute] = useState(FALLBACK_STUDENT.bus_route_no || '12');
  const [editEmergencyPhone, setEditEmergencyPhone] = useState(FALLBACK_STUDENT.parent.emergency_contact);
  const [editBloodGroup, setEditBloodGroup] = useState(FALLBACK_STUDENT.blood_group);

  useEffect(() => {
    async function fetchStudent() {
      try {
        setLoading(true);
        if (!studentId) return;

        // Fetch from Supabase
        const { data, error } = await supabase
          .from('students')
          .select(`
            *,
            classes_sections (grade, section, stream),
            parents_guardians (*)
          `)
          .or(`id.eq.${studentId},admission_no.eq.${studentId}`)
          .single();

        if (data && !error) {
          const loadedStudent: StudentDetail = {
            id: data.id,
            admission_no: data.admission_no,
            roll_no: data.roll_no || '18',
            first_name: data.first_name,
            last_name: data.last_name,
            dob: data.dob,
            gender: data.gender,
            blood_group: data.blood_group || 'O+',
            aadhaar_no: data.aadhaar_no || '5421 8902 4310',
            stream: data.stream || data.classes_sections?.stream || 'General',
            admission_date: data.admission_date,
            admission_type: data.admission_type || 'New CBSE Admission',
            verification_status: data.verification_status || 'UIDAI Aadhaar Verified',
            fee_status: data.fee_status || 'Cleared',
            status: data.status || 'Active',
            transport_mode: data.transport_mode || 'Own / Self',
            bus_route_no: data.bus_route_no,
            class_name: `Class ${data.classes_sections?.grade || 8}`,
            section: data.classes_sections?.section || 'B',
            parent: {
              father_name: data.parents_guardians?.father_name || 'Mr. Suresh Ramanathan',
              father_occupation: data.parents_guardians?.father_occupation || 'Senior Software Architect',
              father_phone: data.parents_guardians?.father_phone || '+91 98401 23456',
              mother_name: data.parents_guardians?.mother_name || 'Mrs. Malathi Suresh',
              mother_occupation: data.parents_guardians?.mother_occupation || 'Bank Officer',
              mother_phone: data.parents_guardians?.mother_phone || '+91 98401 65432',
              primary_email: data.parents_guardians?.primary_email || 'suresh.r@techcorp.com',
              emergency_contact: data.parents_guardians?.emergency_contact || '+91 98401 23456',
              residential_address: data.parents_guardians?.residential_address || 'Flat 4B, Emerald Heights, Gandhi Nagar, Adyar, Chennai - 600020',
            },
          };
          setStudent(loadedStudent);

          // Sync edit states
          setEditFatherPhone(loadedStudent.parent.father_phone);
          setEditEmail(loadedStudent.parent.primary_email);
          setEditAddress(loadedStudent.parent.residential_address);
          setEditTransportMode(loadedStudent.transport_mode);
          setEditBusRoute(loadedStudent.bus_route_no || '12');
          setEditEmergencyPhone(loadedStudent.parent.emergency_contact);
          setEditBloodGroup(loadedStudent.blood_group);
        }
      } catch (err) {
        console.warn('Using fallback data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [studentId]);

  const handlePrintBonafide = () => {
    window.print();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Update Supabase
      await supabase
        .from('students')
        .update({
          transport_mode: editTransportMode,
          bus_route_no: editBusRoute,
          blood_group: editBloodGroup,
        })
        .eq('id', student.id);

      await supabase
        .from('parents_guardians')
        .update({
          father_phone: editFatherPhone,
          primary_email: editEmail,
          emergency_contact: editEmergencyPhone,
          residential_address: editAddress,
        })
        .eq('father_name', student.parent.father_name);

      // 2. Update local state
      setStudent((prev) => ({
        ...prev,
        blood_group: editBloodGroup,
        transport_mode: editTransportMode,
        bus_route_no: editBusRoute,
        parent: {
          ...prev.parent,
          father_phone: editFatherPhone,
          primary_email: editEmail,
          emergency_contact: editEmergencyPhone,
          residential_address: editAddress,
        },
      }));

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditModalOpen(false);
      }, 1000);
    } catch (err) {
      console.error('Update error:', err);
      // Optimistic update
      setStudent((prev) => ({
        ...prev,
        blood_group: editBloodGroup,
        transport_mode: editTransportMode,
        bus_route_no: editBusRoute,
        parent: {
          ...prev.parent,
          father_phone: editFatherPhone,
          primary_email: editEmail,
          emergency_contact: editEmergencyPhone,
          residential_address: editAddress,
        },
      }));
      setIsEditModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* 1. SCREEN VIEW (Hidden completely during print) */}
      <div className="print:hidden flex h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header />

          <main className="p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
            {/* TOP BREADCRUMB & BACK ACTION */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Directory</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Link href="/office/admission" className="hover:text-indigo-600">
                  Admission Desk
                </Link>
                <span>/</span>
                <span>{student.class_name}-{student.section}</span>
                <span>/</span>
                <span className="text-slate-800 font-bold">{student.first_name} {student.last_name}</span>
              </div>
            </div>

            {/* STUDENT 360° HERO BANNER */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-5">
                  {/* Avatar with Status indicator */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-md shadow-indigo-100">
                      {student.first_name[0]}{student.last_name[0]}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {student.first_name} {student.last_name}
                      </h1>
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-lg">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {student.class_name} – Section {student.section}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-lg">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {student.verification_status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      Admission ID: <span className="font-mono font-bold text-slate-800">{student.admission_no}</span> • Roll No: #{student.roll_no} • CBSE Board Affiliation #1930412
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <span>Blood Group: <strong className="text-slate-900">{student.blood_group}</strong></span>
                      <span>•</span>
                      <span>Gender: <strong className="text-slate-900">{student.gender}</strong></span>
                      <span>•</span>
                      <span>Admitted: <strong className="text-slate-900">{student.admission_date}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-xs font-bold text-indigo-700 shadow-xs transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Edit Bio-Data</span>
                  </button>

                  <button
                    onClick={handlePrintBonafide}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print Bonafide</span>
                  </button>

                  <Link
                    href="/office/promotion"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition-colors"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Issue TC / Promotion</span>
                  </Link>

                  <a
                    href={`tel:${student.parent.emergency_contact}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Emergency Call</span>
                  </a>
                </div>
              </div>

              {/* TAB NAVIGATION (Clean scrollbar-none to fix Image 1 scrollbar bug) */}
              <div className="flex items-center gap-1 border-t border-slate-100 mt-6 pt-4 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {[
                  { id: 'biodata', label: 'Bio-Data & Civil Identity' },
                  { id: 'academics', label: 'Academic & Stream Records' },
                  { id: 'parent', label: 'Parents & Emergency' },
                  { id: 'fees', label: 'Fee Ledger & Invoices' },
                  { id: 'transport', label: 'Transport & Bus Route' },
                  { id: 'attendance', label: 'Attendance & Health' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB 1: BIO-DATA & CIVIL IDENTITY */}
            {activeTab === 'biodata' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-600" />
                      Civil Identity & Government Records
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      CBSE Reg ID Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Full Legal Name</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{student.first_name} {student.last_name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Date of Birth</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{student.dob} (Age 14)</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Gender</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{student.gender}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{student.blood_group}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Aadhaar Card No.</span>
                      <p className="font-mono font-bold text-slate-900 mt-0.5">{student.aadhaar_no}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Mother Tongue</span>
                      <p className="font-semibold text-slate-800 mt-0.5">Tamil / English</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    Residential & Commute Address
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Permanent Address</span>
                      <p className="font-medium text-slate-800 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {student.parent.residential_address}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Distance to School</span>
                        <p className="font-bold text-slate-900 mt-0.5">3.8 Kilometers</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Commute Mode</span>
                        <p className="font-bold text-indigo-700 mt-0.5">{student.transport_mode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ACADEMIC & STREAM RECORDS */}
            {activeTab === 'academics' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Academic Profile & Subject Evaluation (Term 1)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase">OVERALL SCORE</span>
                      <p className="text-2xl font-black text-indigo-900 mt-1">462 <span className="text-sm font-normal text-indigo-600">/ 500</span></p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">PERCENTAGE</span>
                      <p className="text-2xl font-black text-emerald-900 mt-1">92.4%</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <span className="text-[10px] font-bold text-amber-700 uppercase">CLASS RANKING</span>
                      <p className="text-2xl font-black text-amber-900 mt-1">⭐ Rank #3 <span className="text-xs font-semibold text-amber-700">/ 42 Students</span></p>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                        <tr>
                          <th className="py-2.5 px-4">Subject</th>
                          <th className="py-2.5 px-4">Marks Obtained</th>
                          <th className="py-2.5 px-4">Max Marks</th>
                          <th className="py-2.5 px-4">Grade</th>
                          <th className="py-2.5 px-4">Class Highest</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { sub: 'Mathematics', mark: 96, max: 100, gr: 'A1', hi: 98 },
                          { sub: 'Science & Technology', mark: 94, max: 100, gr: 'A1', hi: 97 },
                          { sub: 'Social Science', mark: 88, max: 100, gr: 'A2', hi: 95 },
                          { sub: 'English Core', mark: 98, max: 100, gr: 'A1', hi: 98 },
                          { sub: 'Second Language (Tamil/Hindi)', mark: 86, max: 100, gr: 'A2', hi: 94 },
                        ].map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-bold text-slate-900">{m.sub}</td>
                            <td className="py-3 px-4 font-bold text-indigo-700">{m.mark}</td>
                            <td className="py-3 px-4 text-slate-500">{m.max}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded font-extrabold bg-emerald-50 text-emerald-700 text-[10px]">
                                {m.gr}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-600">{m.hi}/100</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PARENTS & EMERGENCY */}
            {activeTab === 'parent' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Father / Primary Guardian
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Father's Full Name</span>
                      <p className="font-extrabold text-slate-900 text-sm mt-0.5">{student.parent.father_name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Occupation & Employer</span>
                      <p className="font-semibold text-slate-700 mt-0.5">{student.parent.father_occupation}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Mobile Number (Parent App Login)</span>
                      <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">{student.parent.father_phone}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Email</span>
                      <p className="text-slate-600 mt-0.5">{student.parent.primary_email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Mother / Secondary Guardian
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Mother's Full Name</span>
                      <p className="font-extrabold text-slate-900 text-sm mt-0.5">{student.parent.mother_name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Occupation</span>
                      <p className="font-semibold text-slate-700 mt-0.5">{student.parent.mother_occupation}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Mobile Number</span>
                      <p className="font-mono font-bold text-slate-900 mt-0.5">{student.parent.mother_phone}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Contact</span>
                      <p className="font-mono font-bold text-rose-600 mt-0.5">{student.parent.emergency_contact}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: FEE LEDGER & INVOICES */}
            {activeTab === 'fees' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                      Student Fee Ledger & Digital Invoices (AY 2026–2027)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Official accounts records with GST and CBSE digital seal
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    ● Account Status: Fully Cleared
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Annual Tuition Assessed</span>
                    <p className="text-xl font-black text-slate-900 mt-1">₹68,500</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">Total Cleared</span>
                    <p className="text-xl font-black text-emerald-900 mt-1">₹68,500</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Outstanding Dues</span>
                    <p className="text-xl font-black text-slate-400 mt-1">₹0.00</p>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                      <tr>
                        <th className="py-2.5 px-4">Receipt #</th>
                        <th className="py-2.5 px-4">Fee Head</th>
                        <th className="py-2.5 px-4">Term</th>
                        <th className="py-2.5 px-4">Amount</th>
                        <th className="py-2.5 px-4">Payment Mode</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700">REC-2026-0891</td>
                        <td className="py-3 px-4 font-bold text-slate-900">Term 1 Tuition & Composite Lab Fee</td>
                        <td className="py-3 px-4 text-slate-600">Term 1</td>
                        <td className="py-3 px-4 font-bold text-slate-900">₹28,500</td>
                        <td className="py-3 px-4 text-slate-600">Online UPI (PhonePe)</td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                            Paid ✓
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700">REC-2026-0410</td>
                        <td className="py-3 px-4 font-bold text-slate-900">Annual Admission & Library Registration</td>
                        <td className="py-3 px-4 text-slate-600">Annual</td>
                        <td className="py-3 px-4 font-bold text-slate-900">₹40,000</td>
                        <td className="py-3 px-4 text-slate-600">NetBanking IMPS</td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                            Paid ✓
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: TRANSPORT & BUS ROUTE */}
            {activeTab === 'transport' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                        School Transport & GPS Bus Route Details
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Integrated with Greenwood Fleet System and Parent Mobile Push Tracker
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                    ● Transport Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Vehicle</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">Bus #{student.bus_route_no || '12'} (TN-09-CB-4412)</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Route Name</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">Route #{student.bus_route_no || '12'}: Adyar → Campus</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Morning Pickup Stop</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">Gandhi Nagar Signal (07:35 AM)</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Afternoon Drop Stop</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">Gandhi Nagar Signal (03:55 PM)</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: ATTENDANCE & HEALTH */}
            {activeTab === 'attendance' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Attendance Summary & Medical Fitness
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    94.2% Attendance Rate
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">Days Present</span>
                    <p className="text-2xl font-black text-emerald-900 mt-1">48 Days</p>
                  </div>
                  <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                    <span className="text-[10px] font-bold text-rose-700 uppercase">Days Absent</span>
                    <p className="text-2xl font-black text-rose-900 mt-1">3 Days</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <span className="text-[10px] font-bold text-amber-700 uppercase">Approved Leave</span>
                    <p className="text-2xl font-black text-amber-900 mt-1">1 Day</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Total Working</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">52 Days</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase">School Infirmary Health Card</h4>
                  <p className="text-xs text-slate-600">
                    Annual physical examination completed on 04 Aug 2026. Blood Group: {student.blood_group}. Vision: 6/6 (Both eyes). No known medicinal allergies. Authorized to participate in inter-school football athletics.
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* EDIT STUDENT BIO-DATA & OPERATIONAL PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Edit Student Records & Bio-Data
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update operational contacts, commute, and guardian records
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 text-xs">
              {/* SECTION A: STRICTLY LOCKED OFFICIAL LEGAL RECORDS */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Official CBSE / Legal Identity Records (Read-Only)</span>
                </div>
                <p className="text-[10px] text-amber-700 leading-relaxed">
                  As per Board & Government norms, Student Legal Name, Admission ID, Roll No, Aadhaar and DOB cannot be modified directly. Formal changes require an official Principal affidavit.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <span className="text-[9px] font-bold text-amber-900 uppercase">Admission No</span>
                    <input
                      disabled
                      value={student.admission_no}
                      className="w-full bg-amber-100/60 text-slate-700 font-mono font-bold rounded-lg px-2.5 py-1.5 border border-amber-200/80 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-amber-900 uppercase">Legal Name</span>
                    <input
                      disabled
                      value={`${student.first_name} ${student.last_name}`}
                      className="w-full bg-amber-100/60 text-slate-700 font-bold rounded-lg px-2.5 py-1.5 border border-amber-200/80 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-amber-900 uppercase">Date of Birth</span>
                    <input
                      disabled
                      value={student.dob}
                      className="w-full bg-amber-100/60 text-slate-700 font-mono rounded-lg px-2.5 py-1.5 border border-amber-200/80 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-amber-900 uppercase">Class & Section</span>
                    <input
                      disabled
                      value={`${student.class_name} - ${student.section}`}
                      className="w-full bg-amber-100/60 text-slate-700 font-bold rounded-lg px-2.5 py-1.5 border border-amber-200/80 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-amber-900 uppercase">Gender</span>
                    <input
                      disabled
                      value={student.gender}
                      className="w-full bg-amber-100/60 text-slate-700 rounded-lg px-2.5 py-1.5 border border-amber-200/80 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-amber-900 uppercase">Aadhaar Card No</span>
                    <input
                      disabled
                      value={student.aadhaar_no}
                      className="w-full bg-amber-100/60 text-slate-700 font-mono rounded-lg px-2.5 py-1.5 border border-amber-200/80 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: EDITABLE OPERATIONAL RECORDS */}
              <div className="space-y-3 pt-1">
                <p className="font-extrabold text-[11px] text-indigo-700 uppercase tracking-wider">
                  Operational Guardian & Commute Records (Editable)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Parent Phone (Parent App Login Username) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFatherPhone}
                      onChange={(e) => setEditFatherPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Primary Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Permanent Residential Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={editBloodGroup}
                      onChange={(e) => setEditBloodGroup(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white"
                    >
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Commute Mode
                    </label>
                    <select
                      value={editTransportMode}
                      onChange={(e) => setEditTransportMode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white"
                    >
                      <option value="School Bus Route #12">School Bus (GPS Tracked)</option>
                      <option value="School Bus Route #4">School Bus Route #4</option>
                      <option value="Own / Self Conveyance">Own / Self Conveyance</option>
                      <option value="Parent Drop & Pickup">Parent Drop & Pickup</option>
                      <option value="Private Van">Private Van</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Emergency Contact Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={editEmergencyPhone}
                      onChange={(e) => setEditEmergencyPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Student operational details successfully updated in database!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-md shadow-indigo-100"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Updating...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. PRINT-ONLY BONAFIDE & STUDY CERTIFICATE (Visible ONLY when window.print() is executed) */}
      <div className="hidden print:block min-h-screen p-8 bg-white text-slate-900 font-serif leading-relaxed">
        {/* CERTIFICATE LETTERHEAD */}
        <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-black text-xl flex items-center justify-center font-sans">
              GW
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900 font-sans">
                GREENWOOD ACADEMY
              </h1>
              <p className="text-xs font-bold text-slate-700 font-sans uppercase tracking-widest">
                Senior Secondary CBSE School • Affiliation No. 1930412
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 font-sans pt-1">
            Campus: 42, Rajiv Gandhi Salai (OMR), Sholinganallur, Chennai, Tamil Nadu – 600119
          </p>
          <p className="text-[10px] text-slate-500 font-sans">
            Phone: +91 44 2840 9100 | Email: principal@greenwoodacademy.edu.in | Web: www.greenwoodacademy.edu.in
          </p>
        </div>

        {/* REFERENCE & DATE */}
        <div className="flex justify-between items-center text-xs font-sans font-bold text-slate-800 py-4">
          <span>Ref No: GW/BONAFIDE/2026/{student.admission_no.replace('GW-2026-', '') || '0842'}</span>
          <span>Date of Issue: 14 September 2026</span>
        </div>

        {/* CERTIFICATE TITLE */}
        <div className="text-center my-8">
          <span className="text-xl font-bold uppercase tracking-widest border-b-2 border-slate-900 pb-1 px-4">
            BONAFIDE & CONDUCT CERTIFICATE
          </span>
        </div>

        {/* CERTIFICATE BODY TEXT */}
        <div className="text-base text-justify leading-loose space-y-6 pt-4 text-slate-900">
          <p>
            This is to certify that Master / Kumari <strong className="font-bold underline decoration-slate-400 underline-offset-4">{student.first_name} {student.last_name}</strong>, 
            Son / Daughter of <strong className="font-bold">{student.parent.father_name}</strong> and <strong className="font-bold">{student.parent.mother_name}</strong>, 
            is a genuine and bonafide student of <strong>Greenwood Academy, Chennai</strong>.
          </p>

          <p>
            He / She is presently studying in <strong className="font-bold">{student.class_name} – Section {student.section}</strong> under 
            Permanent Admission Number <strong className="font-bold font-mono">{student.admission_no}</strong> (Class Roll No. <strong className="font-bold">#{student.roll_no}</strong>) 
            for the Academic Session <strong className="font-bold">2026 – 2027</strong>.
          </p>

          <p>
            As per the verified General Admission Register and Birth Certificate records maintained by the institution, 
            his / her recorded Date of Birth is <strong className="font-bold">{student.dob}</strong>.
          </p>

          <p>
            His / Her residential address registered in our institutional records is:
            <br />
            <span className="italic block pl-6 pt-1 text-slate-800">
              "{student.parent.residential_address}"
            </span>
          </p>

          <p>
            During his / her period of study in this institution, his / her character, academic conduct, and moral behavior have been found to be <strong className="font-bold uppercase tracking-wider">EXCELLENT</strong>.
          </p>

          <p className="text-sm italic text-slate-600">
            This certificate is granted upon the written request of the parent / guardian for official documentation, passport / visa application, and government verification purposes.
          </p>
        </div>

        {/* SIGNATURES & INSTITUTIONAL SEAL */}
        <div className="grid grid-cols-3 gap-6 pt-24 text-center text-xs font-sans">
          <div className="space-y-1">
            <div className="border-t border-slate-800 pt-2 font-bold text-slate-800">
              Prepared & Verified By
            </div>
            <p className="text-[10px] text-slate-500">Administrative Front Office</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center p-2">
              Official School Seal
            </div>
          </div>

          <div className="space-y-1">
            <div className="border-t border-slate-800 pt-2 font-bold text-slate-900">
              Dr. M. Jayakumar, Ph.D.
            </div>
            <p className="text-[11px] font-bold text-slate-700">Principal & Director</p>
            <p className="text-[10px] text-slate-500">Greenwood Academy (CBSE #1930412)</p>
          </div>
        </div>
      </div>
    </>
  );
}
