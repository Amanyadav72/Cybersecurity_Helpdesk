import React from 'react';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  KeyRound,
  ExternalLink,
  HelpCircle,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  Users,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';
import { User } from '../types';

interface HomePageProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onOpenSignIn: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ user, onNavigate, onOpenSignIn }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Text & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                B.Sc. IT Semester V Community Engagement Project
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Community Cyber Safety <span className="text-blue-600">Helpdesk</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                A simple, friendly portal where local residents, students, elders, and small shopkeepers
                can ask everyday questions about cyber frauds, verify suspicious links, and get clear,
                safe guidance from student volunteers.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {user ? (
                  <>
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
                    >
                      Go to My Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigate('ask')}
                      className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm rounded-xl transition flex items-center gap-2"
                    >
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      Ask a Cyber Question
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={onOpenSignIn}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-3"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      Sign in with Google
                    </button>
                    <button
                      onClick={() => onNavigate('safety-tips')}
                      className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm rounded-xl transition flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      Browse Safety Tips
                    </button>
                  </>
                )}
              </div>

              {/* Trust & Ethics Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-slate-200/60">
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  100% Free & Community Focused
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  No Technical Jargon
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Privacy Protected via Google OAuth
                </span>
              </div>
            </div>

            {/* Right Column: Visual Feature Showcase */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Live Helpdesk Desk
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Semester V Project
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span className="text-blue-700">Recent Community Query:</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                        Answered
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 italic">
                      "Someone sent me a QR code on WhatsApp asking to scan it for an electricity bill refund. What should I do?"
                    </p>
                    <div className="mt-2 text-[11px] bg-white p-2 rounded-lg border border-slate-200 text-slate-700">
                      <strong className="text-rose-600">Advice:</strong> Never scan QR codes to receive money. UPI PIN is only used for payments!
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="text-lg font-bold text-blue-900">100%</div>
                      <div className="text-[11px] text-blue-700 font-medium">Verified Guidance</div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="text-lg font-bold text-emerald-900">10+</div>
                      <div className="text-[11px] text-emerald-700 font-medium">Safety Categories</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Safe Online - Core Awareness Section (As explicitly requested in prompt) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Core Awareness Section
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Stay Safe Online
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Follow these essential rules to protect your money, identity, and personal privacy from common cyber scams.
          </p>
        </div>

        {/* 4 Essential Safety Tips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tip 1: Never share OTPs or passwords */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Never share OTPs or passwords
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No genuine bank officer, electricity board, or customer support agent will ever ask for your OTP, ATM PIN, or password over call or message.
            </p>
          </div>

          {/* Tip 2: Verify suspicious links */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ExternalLink className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Verify suspicious links before opening
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Avoid clicking shortened URLs or downloading APK files sent via WhatsApp or SMS. Always inspect the website domain carefully.
            </p>
          </div>

          {/* Tip 3: Strong and unique passwords */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Use strong and unique passwords
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Do not use birthdates or simple numbers. Use a mix of letters, numbers, and symbols, and never reuse the same password for banking.
            </p>
          </div>

          {/* Tip 4: Enable two-factor authentication */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Enable two-factor authentication
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Turn on 2-Step Verification for your Google, WhatsApp, and banking accounts to keep intruders out even if your password is stolen.
            </p>
          </div>
        </div>
      </section>

      {/* How the Helpdesk Works - 3 Step Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">How the Community Helpdesk Works</h2>
            <p className="text-sm text-slate-400 mt-2">
              A straightforward process designed specifically for community accessibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-white">Sign In with Google</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No passwords to remember. One-click Google sign-in securely connects your profile and isolates your questions.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-white">Submit Your Query</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose a category (UPI, Phishing, Social Media) and describe your issue. Receive an instant Reference ID.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500 text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-white">Read Verified Guidance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our student team reviews your question, checks for common fraud patterns, and posts simple instructions in your account.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            {user ? (
              <button
                onClick={() => onNavigate('ask')}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition inline-flex items-center gap-2"
              >
                Submit a Question Now
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenSignIn}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition inline-flex items-center gap-2"
              >
                Sign in to Ask a Question
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Community Engagement Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg font-bold text-blue-900">
              Community Engagement Objective
            </h3>
            <p className="text-xs text-blue-700 max-w-2xl leading-relaxed">
              As part of our B.Sc. IT Semester V curriculum, this project actively serves local community members by dismantling fear around digital transactions, countering cyber crime, and encouraging everyday cyber hygiene.
            </p>
          </div>
          <button
            onClick={() => onNavigate('about')}
            className="shrink-0 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg transition"
          >
            Learn More About Project
          </button>
        </div>
      </section>
    </div>
  );
};
