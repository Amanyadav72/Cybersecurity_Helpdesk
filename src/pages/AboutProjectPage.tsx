import React from 'react';
import {
  ShieldCheck,
  GraduationCap,
  Users,
  Target,
  Workflow,
  Code2,
  Server,
  Database,
  Lock,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

export const AboutProjectPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
          <GraduationCap className="w-4 h-4" />
          B.Sc. IT Semester V Community Engagement Project
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About the Community Cyber Safety Helpdesk
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Bridging the digital literacy divide and empowering local community members to identify online threats, avoid financial frauds, and maintain everyday cyber hygiene.
        </p>
      </div>

      {/* Grid: 4 Core Explanations Required by Prompt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. What the project is */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">1. What the Project Is</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The <strong>Community Cyber Safety Helpdesk</strong> is a clean, accessible, beginner-friendly web portal developed for community engagement. It provides ordinary citizens an approachable, safe space to ask questions about suspicious messages, fake banking calls, and digital privacy concerns without fear of judgment.
          </p>
          <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-800 border border-blue-100">
            <strong>Key Distinction:</strong> This is purely an educational and awareness initiative — not a penetration testing or cybersecurity hacking tool.
          </div>
        </div>

        {/* 2. Why cyber-safety awareness is important */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">2. Why Awareness is Critical</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            With the rapid adoption of instant digital payments (UPI) and smartphone services, cyber criminals increasingly target common citizens through psychological manipulation, fear, and fake urgency rather than breaking complex cryptography.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Simple awareness — such as knowing that entering a UPI PIN always deducts money — can save a household’s hard-earned savings.
          </p>
        </div>

        {/* 3. Who the target community is */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">3. Target Community</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>Senior Citizens:</strong> Often targeted by fake pension verification and electricity disconnection scams.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>Students & Youth:</strong> Vulnerable to part-time job scams, Instagram fake profiles, and cyberbullying.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>Small Shopkeepers & Vendors:</strong> Handling daily UPI payments and vulnerable to fake payment screenshot tricks.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>Homemakers & Non-Technical Citizens:</strong> Navigating e-commerce and smartphone app permissions.</span>
            </li>
          </ul>
        </div>

        {/* 4. Community engagement objective */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">4. Community Engagement Objective</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            In B.Sc. IT Semester V, technical learning is paired with social responsibility. Rather than building theoretical software in isolation, this project addresses real societal friction.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            By acting as student cyber-safety ambassadors, we demystify technology, build trust in legitimate digital governance, and provide actionable cyber hygiene education.
          </p>
        </div>
      </div>

      {/* How the Helpdesk Works (Step-by-Step) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-8">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            <Workflow className="w-4 h-4" />
            Operational Workflow
          </div>
          <h2 className="text-2xl font-bold text-slate-900">How the Helpdesk Operates</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            A secure, closed-loop interaction between the community member and the student helpdesk volunteers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-blue-600 block">Step 1</span>
            <h3 className="font-bold text-slate-900 text-sm">Google OAuth Login</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The user logs in with their Google account. No custom passwords to store or remember.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-blue-600 block">Step 2</span>
            <h3 className="font-bold text-slate-900 text-sm">Submit Query</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The user picks a category (e.g. UPI Safety, Phishing) and describes what happened. A Reference ID is generated.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-blue-600 block">Step 3</span>
            <h3 className="font-bold text-slate-900 text-sm">Volunteer Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Student volunteers examine the submission, match it with known cyber threat patterns, and draft guidance.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-blue-600 block">Step 4</span>
            <h3 className="font-bold text-slate-900 text-sm">Verified Response</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The answer is published to the user’s private "My Questions" view, changing the status to "Answered".
            </p>
          </div>
        </div>
      </section>

      {/* Technical Architecture Summary */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Technical Architecture & Stack</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Engineered cleanly according to modern B.Sc. IT curriculum standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
              <Code2 className="w-4 h-4" />
              <span>Frontend</span>
            </div>
            <p className="text-xs text-slate-300">
              React 19, Vite, TypeScript, and Tailwind CSS. Responsive single-page application.
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Server className="w-4 h-4" />
              <span>Backend API</span>
            </div>
            <p className="text-xs text-slate-300">
              Python 3, FastAPI, Pydantic data schemas, and Uvicorn ASGI server.
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Database className="w-4 h-4" />
              <span>Database</span>
            </div>
            <p className="text-xs text-slate-300">
              SQLite relational database using SQLAlchemy ORM (Users & Questions tables).
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
              <Lock className="w-4 h-4" />
              <span>Authentication</span>
            </div>
            <p className="text-xs text-slate-300">
              Google OAuth 2.0 with JWT session tokens and strict per-user data isolation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
