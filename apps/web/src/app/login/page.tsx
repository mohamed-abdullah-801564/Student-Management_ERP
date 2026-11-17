'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Building2,
  Lock,
  Mail,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // Mode: 'staff' (Email + Password) | 'parent' (Mobile + PIN)
  const [authMode, setAuthMode] = useState<'staff' | 'parent'>('staff');

  // Form State
  const [email, setEmail] = useState('principal@greenwood.edu');
  const [password, setPassword] = useState('••••••••••');
  const [phone, setPhone] = useState('98402 71890');
  const [pin, setPin] = useState('2410');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (authMode === 'staff') {
        // 1. Check Demo / Role Routes
        const cleanEmail = email.trim().toLowerCase();

        if (cleanEmail.includes('admin') && cleanEmail.includes('platform')) {
          router.push('/platform-admin');
          return;
        }

        if (cleanEmail.includes('admissions') || cleanEmail.includes('admission')) {
          router.push('/office/admission');
          return;
        }

        if (cleanEmail.includes('teacher') || cleanEmail.includes('faculty')) {
          router.push('/staff');
          return;
        }

        // Default Principal or Coordinator
        router.push('/');
      } else {
        // Parent Mobile Sign-In -> Directs to Parent Mobile App Web Preview or Student 360
        router.push('/students/44444444-4444-4444-4444-000000000001');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoRole = (role: 'principal' | 'coordinator' | 'admission' | 'teacher' | 'parent' | 'superadmin') => {
    setErrorMsg(null);
    switch (role) {
      case 'principal':
        setAuthMode('staff');
        setEmail('principal@greenwood.edu');
        setPassword('Principal@2026');
        router.push('/');
        break;
      case 'coordinator':
        setAuthMode('staff');
        setEmail('coordinator@greenwood.edu');
        setPassword('Coord@2026');
        router.push('/');
        break;
      case 'admission':
        setAuthMode('staff');
        setEmail('admissions@greenwood.edu');
        setPassword('Admission@2026');
        router.push('/office/admission');
        break;
      case 'teacher':
        setAuthMode('staff');
        setEmail('faculty.science@greenwood.edu');
        setPassword('Teacher@2026');
        router.push('/staff');
        break;
      case 'parent':
        setAuthMode('parent');
        setPhone('98402 71890');
        setPin('2410');
        router.push('/students/44444444-4444-4444-4444-000000000001');
        break;
      case 'superadmin':
        setAuthMode('staff');
        setEmail('admin@greenwooderp.internal');
        setPassword('SuperAdmin@2026');
        router.push('/platform-admin');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 relative z-10 space-y-6">
        {/* INSTITUTIONAL HEADER & BRANDING */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Greenwood Academy
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              CBSE Affiliation #1930412 • ERP Portal
            </p>
          </div>
        </div>

        {/* ROLE MODE TOGGLE (Staff vs Parent) */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode('staff')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'staff'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Staff & Executive</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('parent')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'parent'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Parent & Student</span>
          </button>
        </div>

        {/* ERROR NOTIFICATION */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* AUTHENTICATION FORM */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          {authMode === 'staff' ? (
            <>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[10px]">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@greenwood.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Password
                  </label>
                  <a href="#" className="text-[11px] font-bold text-indigo-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[10px]">
                  Registered Parent Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-xs text-slate-600 font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98402 71890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    4-Digit Secret PIN / OTP
                  </label>
                  <a href="#" className="text-[11px] font-bold text-indigo-600 hover:underline">
                    Resend SMS PIN
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 font-mono font-bold tracking-widest text-center focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-CLICK DEMO ROLE SWITCHER (For Testing All Roles Immediately) */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
            Instant Test Logins (Role-Based Reroute)
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemoRole('principal')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80 text-left text-[11px] font-bold transition-colors"
            >
              👑 Executive Principal
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoRole('admission')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80 text-left text-[11px] font-bold transition-colors"
            >
              🏢 Admission Desk
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoRole('coordinator')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80 text-left text-[11px] font-bold transition-colors"
            >
              📋 Academic Coordinator
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoRole('teacher')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80 text-left text-[11px] font-bold transition-colors"
            >
              👨‍🏫 Class In-Charge
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoRole('parent')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80 text-left text-[11px] font-bold transition-colors"
            >
              👨‍👩‍👧 Parent Portal
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoRole('superadmin')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80 text-left text-[11px] font-bold transition-colors"
            >
              🛡️ Super Administrator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
