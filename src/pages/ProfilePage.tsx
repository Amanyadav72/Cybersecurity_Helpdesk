import React, { useEffect, useState } from 'react';
import { User as UserType, DashboardStats } from '../types';
import { api } from '../services/api';
import {
  ShieldCheck,
  Mail,
  UserCheck,
  Calendar,
  Key,
  Database,
  RefreshCw,
  LogOut,
  HelpCircle,
  PlusCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ProfilePageProps {
  user: UserType;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUserRefresh?: (updatedUser: UserType) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onNavigate,
  onLogout,
  onUserRefresh,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const handleRefreshProfile = async () => {
    setIsRefreshing(true);
    setRefreshMessage(null);
    try {
      const refreshed = await api.checkAuth();
      if (refreshed) {
        if (onUserRefresh) onUserRefresh(refreshed);
        setRefreshMessage('User data successfully re-synchronized from database.');
      } else {
        setRefreshMessage('Profile synced.');
      }
      await fetchStats();
    } catch {
      setRefreshMessage('Could not connect to server.');
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setRefreshMessage(null), 3000);
    }
  };

  const formattedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Active Member';

  const avatarUrl =
    user.profile_picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&size=200`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button
            onClick={() => onNavigate('dashboard')}
            className="hover:text-blue-600 transition"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="text-slate-800 font-semibold">User Profile & Account</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshProfile}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-2xs disabled:opacity-60"
            title="Refresh user data from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-2xs"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {refreshMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{refreshMessage}</span>
        </div>
      )}

      {/* Primary Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/80 via-indigo-50/30 to-transparent pointer-events-none rounded-full blur-2xl -mr-20 -mt-20"></div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            <div className="relative">
              <img
                src={avatarUrl}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-blue-500 shadow-md bg-slate-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&size=200`;
                }}
              />
              <div
                className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 border-2 border-white w-6 h-6 rounded-full flex items-center justify-center shadow-xs"
                title="Verified Active Account"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Google Verified Member
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {user.email}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Joined {formattedDate}
                </span>
              </div>

              <p className="text-xs text-slate-400 pt-1">
                Account ID:{' '}
                <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md text-[11px]">
                  {user.google_id || `CSH-USR-${user.id}`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => onNavigate('ask')}
              className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs hover:shadow-sm transition flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Ask Question
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 text-rose-600 hover:bg-rose-50 border border-rose-200 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Detailed User Information Grid */}
        <div className="pt-8">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Retrieved Google Profile Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Full Display Name
              </span>
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <span className="text-[10px] text-slate-400 block">Retrieved via Google OAuth</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Verified Google Email
              </span>
              <p className="text-sm font-bold text-slate-900 truncate" title={user.email}>
                {user.email}
              </p>
              <span className="text-[10px] text-emerald-600 font-medium block">
                Primary contact for advice notifications
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Database Sync Identifier
              </span>
              <p className="text-sm font-bold text-slate-900 font-mono">
                #{user.id} ({user.google_id ? user.google_id.slice(0, 16) + '...' : 'Local ID'})
              </p>
              <span className="text-[10px] text-blue-600 font-medium block">
                Neon PostgreSQL / Synced DB
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Session Encryption
              </span>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-600" />
                Active Bearer JWT
              </p>
              <span className="text-[10px] text-slate-400 block">
                Encrypted with 7-day secure validity
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Account Security Status
              </span>
              <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Authenticated & Secure
              </p>
              <span className="text-[10px] text-slate-400 block">
                Role: Community Citizen
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Registration Date
              </span>
              <p className="text-sm font-bold text-slate-900">{formattedDate}</p>
              <span className="text-[10px] text-slate-400 block">
                College Helpdesk Project Member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Overview & Questions Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Total Queries Submitted
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {stats ? stats.total_questions : 0}
          </p>
          <p className="text-xs text-slate-500">
            Questions asked by your Google account
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 uppercase">
              Under Volunteer Review
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-600">
            {stats ? stats.pending_questions : 0}
          </p>
          <p className="text-xs text-slate-500">
            Being evaluated for cyber safety advice
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase">
              Answered & Resolved
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">
            {stats ? stats.answered_questions : 0}
          </p>
          <p className="text-xs text-slate-500">
            Guidance verified and provided
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('my-questions')}
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition flex items-center justify-between group shadow-2xs"
        >
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              View My Submitted Questions
            </h3>
            <p className="text-xs text-slate-500">
              Check volunteer responses, feedback, and reference IDs
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => onNavigate('safety-tips')}
          className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition flex items-center justify-between group shadow-2xs"
        >
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Browse Cyber Safety Guidelines
            </h3>
            <p className="text-xs text-slate-500">
              Practical guides on UPI safety, phishing avoidance, and strong passwords
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* Project Academic Context Box */}
      <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-semibold text-blue-950 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            B.Sc. IT Semester V Community Engagement Project
          </p>
          <p className="text-slate-600">
            Your user identity is verified through Google OAuth 2.0 to ensure safe community inquiries. No sensitive passwords or financial credentials are ever stored.
          </p>
        </div>
        <button
          onClick={() => onNavigate('about')}
          className="text-xs text-blue-600 hover:text-blue-800 font-bold underline shrink-0"
        >
          About Helpdesk &rarr;
        </button>
      </div>
    </div>
  );
};
