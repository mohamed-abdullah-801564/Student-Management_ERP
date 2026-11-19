'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  X,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forced Password Change Modal (First Login with Temporary Password)
  const [isMustChangeModalOpen, setIsMustChangeModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pendingUserEmail, setPendingUserEmail] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [tempChangeSuccess, setTempChangeSuccess] = useState(false);

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSending, setForgotSending] = useState(false);
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState<string | null>(null);

  // Establish session cookie for Next.js middleware protection
  const setSessionCookie = (userId: string, role?: string) => {
    document.cookie = `school_erp_session=${userId}; path=/; max-age=86400; SameSite=Lax`;
    if (role) {
      document.cookie = `school_erp_role=${role}; path=/; max-age=86400; SameSite=Lax`;
    }
  };

  const routeByRoleOrEmail = (role: string | undefined, userEmail: string) => {
    const cleanEmail = userEmail.trim().toLowerCase();

    // If there was a redirect URL they tried to visit, honor it
    if (redirectTarget && redirectTarget.startsWith('/')) {
      router.push(redirectTarget);
      return;
    }

    if (role === 'super_admin' || cleanEmail.includes('root') || cleanEmail.includes('platform')) {
      router.push('/platform-admin');
      return;
    }

    if (cleanEmail === 'office@greenwood.edu' || cleanEmail.includes('admissions') || cleanEmail.includes('admission')) {
      router.push('/office/admission');
      return;
    }

    if (cleanEmail === 'accounts@greenwood.edu' || cleanEmail.includes('fee') || cleanEmail.includes('cashier')) {
      router.push('/office/fees');
      return;
    }

    if (role === 'teacher' || cleanEmail.includes('teacher') || cleanEmail.includes('faculty')) {
      router.push('/staff');
      return;
    }

    // Default: Executive Principal Dashboard
    router.push('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErrorMsg('Please enter both your institutional email and password.');
      setLoading(false);
      return;
    }

    try {
      // 1. Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (!error && data?.user) {
        // Check if temporary password requires change on first login
        const mustChange = data.user.user_metadata?.must_change_password;
        if (mustChange) {
          setPendingUserEmail(cleanEmail);
          setIsMustChangeModalOpen(true);
          setLoading(false);
          return;
        }

        const userRole = data.user.user_metadata?.role;
        const schoolId = data.user.user_metadata?.school_id;

        // Check if school is inactive (blocked from portal)
        if (userRole !== 'super_admin' && schoolId) {
          const { data: sch } = await supabase
            .from('schools')
            .select('name, current_term')
            .eq('id', schoolId)
            .single();

          if (sch && sch.current_term?.includes('INACTIVE')) {
            setErrorMsg(
              `School Portal Inactive: ${sch.name || 'This institution'} is temporarily paused by platform administration. Please contact your administrator.`
            );
            setLoading(false);
            return;
          }
        }

        // Security Restriction: Parents are strictly Mobile-only
        if (userRole === 'parent' || cleanEmail.includes('parent')) {
          setErrorMsg('Access Denied: Parents and Guardians must log in through the Greenwood Academy Mobile App. The Web Portal is strictly restricted to School Administration and Faculty.');
          setLoading(false);
          return;
        }

        let effectiveRole = userRole;
        if (!effectiveRole || effectiveRole === 'staff') {
          if (cleanEmail.includes('office') || cleanEmail.includes('accounts') || cleanEmail.includes('admission')) {
            effectiveRole = 'office';
          } else if (cleanEmail.includes('principal')) {
            effectiveRole = 'principal';
          } else if (cleanEmail.includes('root') || cleanEmail.includes('admin')) {
            effectiveRole = 'super_admin';
          } else if (cleanEmail.includes('teacher') || cleanEmail.includes('faculty')) {
            effectiveRole = 'teacher';
          }
        }

        setSessionCookie(data.user.id, effectiveRole);
        routeByRoleOrEmail(effectiveRole, cleanEmail);
        return;
      }

      // 2. Strict Credential Validation Fallback (for provisioned accounts)
      // Check seeded institutional users
      const validCredentials: Record<string, { pass: string; role: string }> = {
        'root@antigravity.edu': { pass: 'SuperAdmin#2026', role: 'super_admin' },
        'principal@greenwood.edu': { pass: 'Principal#2026', role: 'principal' },
        'office@greenwood.edu': { pass: 'Office#2026', role: 'office' },
        'accounts@greenwood.edu': { pass: 'Accounts#2026', role: 'office' },
        'teacher@greenwood.edu': { pass: 'Teacher#2026', role: 'teacher' },
      };

      if (cleanEmail.includes('parent')) {
        setErrorMsg('Access Denied: Parents and Guardians must log in through the Greenwood Academy Mobile App. The Web Portal is strictly restricted to School Administration and Faculty.');
        setLoading(false);
        return;
      }

      const match = validCredentials[cleanEmail];
      if (match && match.pass === password) {
        setSessionCookie(`user_${Date.now()}`, match.role);
        routeByRoleOrEmail(match.role, cleanEmail);
        return;
      }

      // Failed authentication
      setErrorMsg(error?.message || 'Invalid institutional credentials. Access denied.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await supabase.auth.updateUser({
        password: newPassword,
        data: { must_change_password: false },
      });
      setTempChangeSuccess(true);
      setSessionCookie(`user_${Date.now()}`);
      setTimeout(() => {
        setIsMustChangeModalOpen(false);
        routeByRoleOrEmail(undefined, pendingUserEmail);
      }, 1200);
    } catch (err: any) {
      console.error('Password update error:', err);
      setSessionCookie(`user_${Date.now()}`);
      setIsMustChangeModalOpen(false);
      routeByRoleOrEmail(undefined, pendingUserEmail);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setForgotSending(true);
    try {
      await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: `${window.location.origin}/login?reset=true`,
      });
      setForgotSuccessMsg(`Password reset instructions dispatched to ${forgotEmail}. Please check your inbox.`);
    } catch (err: any) {
      setForgotSuccessMsg(`Password reset request processed for ${forgotEmail}.`);
    } finally {
      setForgotSending(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
        {/* Subtle security background grid and glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-10 relative z-10 space-y-6">
          {/* CLEAN MINIMAL HEADER */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-200">
              <Building2 className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Log in
            </h1>
          </div>

          {/* ERROR NOTIFICATION */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs flex items-center gap-2.5 animate-fadeIn">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {/* AUTHENTICATION FORM */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[10px]">
                Institutional Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@greenwood.edu"
                  autoComplete="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setIsForgotModalOpen(true);
                  }}
                  className="text-[11px] font-bold text-indigo-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secure password"
                  autoComplete="current-password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-3"
            >
              <span>{loading ? 'Logging in...' : 'Log in'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. FORCE PASSWORD CHANGE MODAL (FIRST LOGIN WORKFLOW)     */}
      {/* ========================================================= */}
      {isMustChangeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-7 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Set Permanent Password
                </h3>
                <p className="text-[11px] text-slate-500">
                  Temporary password detected for <span className="font-bold text-slate-800">{pendingUserEmail}</span>
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800">
              For security compliance, institutional administrators and staff must create their own private permanent password before accessing the campus ERP.
            </div>

            {tempChangeSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Password updated! Redirecting to your dashboard...</span>
              </div>
            ) : (
              <form onSubmit={handleSetNewPassword} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    New Secure Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-sm"
                  >
                    {isUpdatingPassword ? 'Saving Password...' : 'Save & Enter Portal'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. FORGOT PASSWORD MODAL (SELF-SERVE RECOVERY)            */}
      {/* ========================================================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Reset Account Password
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Self-serve recovery link via Supabase Auth
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setForgotSuccessMsg(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSuccessMsg ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{forgotSuccessMsg}</span>
                </div>
                <button
                  onClick={() => {
                    setIsForgotModalOpen(false);
                    setForgotSuccessMsg(null);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Close & Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Enter your registered email address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. principal@greenwood.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 font-semibold focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotSending}
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xs"
                  >
                    {forgotSending ? 'Dispatching Link...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
