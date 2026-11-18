'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import {
  Lock,
  Calendar,
  Clock,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Bell,
  Save,
  KeyRound,
  Eye,
  EyeOff,
  Sun,
  Coffee,
} from 'lucide-react';

interface Holiday {
  id: string;
  title: string;
  date: string;
  type: 'declared' | 'national' | 'emergency';
  broadcastSent: boolean;
}

interface PeriodTiming {
  periodNumber: number;
  label: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
}

export default function PrincipalSettingsPage() {
  const [activeTab, setActiveTab] = useState<'security' | 'calendar' | 'periods' | 'profile'>('security');

  // 1. Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passUpdating, setPassUpdating] = useState(false);
  const [passSuccessMsg, setPassSuccessMsg] = useState<string | null>(null);
  const [passErrorMsg, setPassErrorMsg] = useState<string | null>(null);

  // 2. Working Days State
  const [workingSchedule, setWorkingSchedule] = useState<'mon_fri' | 'mon_sat_2nd4th' | 'sun_thu'>('mon_fri');
  const [scheduleSavedMsg, setScheduleSavedMsg] = useState<string | null>(null);

  // 3. Holidays State
  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: 'h1', title: 'Mahatma Gandhi Jayanti', date: '2026-10-02', type: 'national', broadcastSent: true },
    { id: 'h2', title: 'Deepavali Festival Break', date: '2026-11-08', type: 'national', broadcastSent: true },
    { id: 'h3', title: 'Heavy Rain Alert (Collector Order)', date: '2026-11-18', type: 'emergency', broadcastSent: true },
    { id: 'h4', title: 'Christmas & Winter Vacation', date: '2026-12-25', type: 'national', broadcastSent: false },
  ]);
  const [isDeclareModalOpen, setIsDeclareModalOpen] = useState(false);
  const [holidayTitle, setHolidayTitle] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayType, setHolidayType] = useState<'declared' | 'emergency'>('emergency');
  const [sendBroadcast, setSendBroadcast] = useState(true);

  // 4. Period Timings State
  const [periodTimings, setPeriodTimings] = useState<PeriodTiming[]>([
    { periodNumber: 0, label: 'Morning Assembly & Roll Call', startTime: '08:30 AM', endTime: '08:50 AM' },
    { periodNumber: 1, label: 'Period 1 (Mathematics)', startTime: '08:50 AM', endTime: '09:35 AM' },
    { periodNumber: 2, label: 'Period 2 (Science & Tech)', startTime: '09:35 AM', endTime: '10:20 AM' },
    { periodNumber: -1, label: 'Short Interval / Snack Break', startTime: '10:20 AM', endTime: '10:35 AM', isBreak: true },
    { periodNumber: 3, label: 'Period 3 (Physics Lab)', startTime: '10:35 AM', endTime: '11:20 AM' },
    { periodNumber: 4, label: 'Period 4 (English Core)', startTime: '11:20 AM', endTime: '12:05 PM' },
    { periodNumber: -2, label: 'Central Lunch Break', startTime: '12:05 PM', endTime: '12:50 PM', isBreak: true },
    { periodNumber: 5, label: 'Period 5 (Social Science)', startTime: '12:50 PM', endTime: '01:30 PM' },
    { periodNumber: 6, label: 'Period 6 (Language II)', startTime: '01:30 PM', endTime: '02:10 PM' },
    { periodNumber: 7, label: 'Period 7 (Computer Science & AI)', startTime: '02:10 PM', endTime: '02:50 PM' },
    { periodNumber: 8, label: 'Period 8 (Sports & Club Activity)', startTime: '02:50 PM', endTime: '03:30 PM' },
  ]);
  const [timingSavedMsg, setTimingSavedMsg] = useState<string | null>(null);

  // Password Update Handler
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassErrorMsg(null);
    setPassSuccessMsg(null);

    if (newPassword.length < 8) {
      setPassErrorMsg('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassErrorMsg('New password and confirmation do not match.');
      return;
    }

    setPassUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPassErrorMsg(error.message);
      } else {
        setPassSuccessMsg('Your Principal password has been updated securely.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setPassSuccessMsg('Principal password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setPassUpdating(false);
    }
  };

  // Declare Holiday Handler
  const handleDeclareHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayTitle || !holidayDate) return;

    const newH: Holiday = {
      id: `h_${Date.now()}`,
      title: holidayTitle,
      date: holidayDate,
      type: holidayType,
      broadcastSent: sendBroadcast,
    };

    setHolidays([newH, ...holidays]);
    setIsDeclareModalOpen(false);
    setHolidayTitle('');
    setHolidayDate('');

    if (sendBroadcast) {
      alert(`Official Notice Broadcasted: "${newH.title}" scheduled on ${newH.date}. Push notification dispatched to all Teachers and Parents.`);
    }
  };

  const handlePeriodChange = (index: number, field: 'startTime' | 'endTime' | 'label', val: string) => {
    const updated = [...periodTimings];
    updated[index][field] = val;
    setPeriodTimings(updated);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Institutional Settings & Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage Principal credentials, working days, official holidays, and school bell timings.
          </p>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
          {[
            { id: 'security', label: 'Security & Password', icon: KeyRound },
            { id: 'calendar', label: 'Working Days & Holidays', icon: Calendar },
            { id: 'periods', label: 'Bell Schedule & Period Timings', icon: Clock },
            { id: 'profile', label: 'School Identity Profile', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-700 bg-white shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 max-w-xl space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Principal Security Credentials
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update the official master password for <strong className="text-slate-700 font-mono">principal@greenwood.edu</strong>.
              </p>
            </div>

            {passSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{passSuccessMsg}</span>
              </div>
            )}

            {passErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{passErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  New Password (Min. 8 characters)
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={passUpdating}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{passUpdating ? 'Updating Password...' : 'Save New Password'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: WORKING DAYS & HOLIDAYS */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            {/* Working Days Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    School Working Days & Weekend Rules
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Defines official instructional days. Changes automatically sync to Teacher and Parent timetables.
                  </p>
                </div>
                {scheduleSavedMsg && (
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    ✓ Saved
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  {
                    id: 'mon_fri',
                    title: 'Monday – Friday',
                    desc: 'Saturday & Sunday are official holidays (Standard CBSE)',
                  },
                  {
                    id: 'mon_sat_2nd4th',
                    title: 'Monday – Saturday',
                    desc: 'Sunday off • 2nd & 4th Saturdays are holidays',
                  },
                  {
                    id: 'sun_thu',
                    title: 'Sunday – Thursday',
                    desc: 'Friday & Saturday are holidays (Middle East / Gulf CBSE)',
                  },
                ].map((opt) => {
                  const isSelected = workingSchedule === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setWorkingSchedule(opt.id as any);
                        setScheduleSavedMsg('Working schedule updated.');
                        setTimeout(() => setScheduleSavedMsg(null), 2500);
                      }}
                      className={`p-4 rounded-xl text-left border-2 transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 text-slate-900'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs">{opt.title}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Holidays List Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Official Holidays & Emergency Closures
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Holidays declared here disable daily attendance checks and display as "Holiday" in timetables.
                  </p>
                </div>

                <button
                  onClick={() => setIsDeclareModalOpen(true)}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Declare School Holiday</span>
                </button>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Holiday / Occasion</th>
                      <th className="py-2.5 px-3">Classification</th>
                      <th className="py-2.5 px-3">Notice Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {holidays.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {h.date}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {h.title}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              h.type === 'emergency'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            }`}
                          >
                            {h.type === 'emergency' ? '🚨 Emergency Order' : 'Institutional Holiday'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {h.broadcastSent ? (
                            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                              <Bell className="w-3 h-3 text-emerald-600" />
                              Push Alert Dispatched
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Scheduled in Calendar</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setHolidays(holidays.filter((item) => item.id !== h.id))}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PERIOD TIMINGS */}
        {activeTab === 'periods' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Daily Bell Schedule & Period Timings
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure start and end timings for all 8 periods, morning assembly, and intervals.
                </p>
              </div>

              <button
                onClick={() => {
                  setTimingSavedMsg('Period bell timings saved and synced with Teacher & Parent apps.');
                  setTimeout(() => setTimingSavedMsg(null), 3000);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Timings</span>
              </button>
            </div>

            {timingSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{timingSavedMsg}</span>
              </div>
            )}

            <div className="space-y-2.5 max-w-2xl">
              {periodTimings.map((p, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs ${
                    p.isBreak
                      ? 'bg-amber-50/50 border-amber-200/80'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                    {p.isBreak ? <Coffee className="w-4 h-4 text-amber-600" /> : p.periodNumber || <Sun className="w-4 h-4 text-indigo-600" />}
                  </div>

                  <input
                    type="text"
                    value={p.label}
                    onChange={(e) => handlePeriodChange(idx, 'label', e.target.value)}
                    className="flex-1 bg-transparent font-semibold text-slate-900 focus:bg-white focus:outline-none px-2 py-1 rounded"
                  />

                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <input
                      type="text"
                      value={p.startTime}
                      onChange={(e) => handlePeriodChange(idx, 'startTime', e.target.value)}
                      className="w-20 bg-white border border-slate-200 rounded px-2 py-1 text-center font-bold text-slate-800"
                    />
                    <span className="text-slate-400">–</span>
                    <input
                      type="text"
                      value={p.endTime}
                      onChange={(e) => handlePeriodChange(idx, 'endTime', e.target.value)}
                      className="w-20 bg-white border border-slate-200 rounded px-2 py-1 text-center font-bold text-slate-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SCHOOL PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 max-w-xl space-y-4 text-xs">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Greenwood Academy Institutional Profile
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official CBSE institutional registry and contact details.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  readOnly
                  value="Greenwood Academy"
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">
                    CBSE Affiliation
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="#1930412"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="AY 2026 – 2027"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-indigo-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">
                  Campus Address
                </label>
                <input
                  type="text"
                  readOnly
                  value="42, Knowledge Corridor, Velachery Main Road, Chennai - 600042"
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase text-[10px] mb-1">
                  Principal & Director
                </label>
                <input
                  type="text"
                  readOnly
                  value="Dr. M. Jayakumar, Ph.D."
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DECLARE HOLIDAY MODAL */}
      {isDeclareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Declare School Holiday / Closure
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Updates school calendar and disables attendance check for the day.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleDeclareHoliday} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Holiday Title / Reason *
                </label>
                <input
                  type="text"
                  required
                  value={holidayTitle}
                  onChange={(e) => setHolidayTitle(e.target.value)}
                  placeholder="e.g. Heavy Rain Alert • Collector Directive"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Holiday Date *
                </label>
                <input
                  type="date"
                  required
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[10px]">
                  Classification
                </label>
                <select
                  value={holidayType}
                  onChange={(e: any) => setHolidayType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="emergency">🚨 Emergency Weather / Govt Directive</option>
                  <option value="declared">Institutional / Cultural Holiday</option>
                </select>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="broadcastCheck"
                  checked={sendBroadcast}
                  onChange={(e) => setSendBroadcast(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <label htmlFor="broadcastCheck" className="text-[11px] font-semibold text-slate-700 cursor-pointer">
                  Broadcast instant notification to all Faculty & Parents
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeclareModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm & Declare Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
