import React, { useEffect, useState } from 'react';
import {
  User as UserType,
  Question,
  DashboardStats,
} from '../types';
import { api } from '../services/api';
import {
  HelpCircle,
  PlusCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Tag,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  UserCircle,
} from 'lucide-react';

interface DashboardPageProps {
  user: UserType;
  onNavigate: (page: string) => void;
  onSelectQuestion?: (question: Question) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onNavigate,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Google Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={
              user.profile_picture ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80'
            }
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-sm"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user.name}</h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                Google Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">{user.email}</p>
            <p className="text-[11px] text-slate-400">
              Community Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action Buttons: "Ask a Question" and "View Profile" */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onNavigate('profile')}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2"
          >
            <UserCircle className="w-4 h-4 text-blue-600" />
            View Full Profile
          </button>
          <button
            onClick={() => onNavigate('ask')}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-sm transition flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Ask a Question
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Questions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Total Questions Submitted
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats ? stats.total_questions : '...'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Queries logged under your account</p>
        </div>

        {/* Pending Questions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-amber-600">
              Pending Guidance
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats ? stats.pending_questions : '...'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Under review by student helpdesk</p>
        </div>

        {/* Answered Questions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-emerald-600">
              Answered by Helpdesk
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats ? stats.answered_questions : '...'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Guidance available in My Questions</p>
        </div>
      </div>

      {/* Recent Questions Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Questions</h2>
            <p className="text-xs text-slate-500">
              Your latest cyber-safety submissions and their verification status
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Refresh questions"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => onNavigate('my-questions')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
            >
              View All Questions
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading recent questions...
          </div>
        ) : !stats || stats.recent_questions.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No questions submitted yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Have a doubt about a suspicious message, phone call, or OTP request? Click below to ask our team.
            </p>
            <button
              onClick={() => onNavigate('ask')}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Ask Your First Question
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.recent_questions.map((q) => {
              const isAnswered = q.status === 'Answered';
              return (
                <div
                  key={q.id}
                  className="py-4 first:pt-0 last:pb-0 hover:bg-slate-50/70 p-3 rounded-xl transition space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {q.id}
                      </span>
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        {q.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          isAnswered
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isAnswered ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Answered
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending
                          </>
                        )}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(q.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-800 font-medium line-clamp-2">
                    {q.question}
                  </p>

                  {isAnswered && q.response && (
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-lg text-xs text-slate-800">
                      <span className="font-semibold text-emerald-900 block mb-0.5">
                        Helpdesk Guidance:
                      </span>
                      <p className="line-clamp-2 text-slate-700">{q.response}</p>
                    </div>
                  )}

                  <div className="text-right">
                    <button
                      onClick={() => onNavigate('my-questions')}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View in My Questions &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Safety Awareness Quick Tip Box */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-base">National Cyber Fraud Helpline</h3>
          <p className="text-xs text-blue-100 max-w-xl">
            If you or a community neighbor has lost money in an online scam, immediately dial <strong className="text-white underline">1930</strong> to freeze fraudulent transactions in the banking network.
          </p>
        </div>
        <button
          onClick={() => onNavigate('safety-tips')}
          className="shrink-0 px-4 py-2 bg-white text-blue-700 font-semibold text-xs rounded-xl hover:bg-blue-50 transition"
        >
          View All Safety Tips
        </button>
      </div>
    </div>
  );
};
