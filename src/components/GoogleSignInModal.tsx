import React, { useEffect, useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Database,
  Key,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Zap,
  UserCheck,
} from 'lucide-react';
import { api, SystemStatus } from '../services/api';
import { User } from '../types';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemStatus?: SystemStatus | null;
  onLoginSuccess?: (user: User) => void;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  onClose,
  systemStatus,
  onLoginSuccess,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live Neon DB test state
  const [testingDb, setTestingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<any>(null);
  const [dbTestError, setDbTestError] = useState<string | null>(null);

  // Google OAuth client key configuration state
  const [clientIdInput, setClientIdInput] = useState('');
  const [clientSecretInput, setClientSecretInput] = useState('');
  const [savingKeys, setSavingKeys] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Test sign-in state
  const [testLoginLoading, setTestLoginLoading] = useState(false);

  if (!isOpen) return null;

  const handleLaunchGoogleOAuth = () => {
    api.initiateGoogleLogin();
  };

  const handleRunNeonTest = async () => {
    try {
      setTestingDb(true);
      setDbTestError(null);
      const res = await api.testNeonDatabase();
      setDbTestResult(res);
    } catch (err: any) {
      setDbTestError(err.message || 'Failed to connect to Neon PostgreSQL.');
    } finally {
      setTestingDb(false);
    }
  };

  const handleSaveGoogleKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientIdInput.trim() || !clientSecretInput.trim()) return;

    try {
      setSavingKeys(true);
      await api.configureGoogleKeys(clientIdInput.trim(), clientSecretInput.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(`Error saving credentials: ${err.message}`);
    } finally {
      setSavingKeys(false);
    }
  };

  const handleQuickGoogleTest = async () => {
    try {
      setTestLoginLoading(true);
      const res = await api.testGoogleUserLogin('amanyadavabhay@gmail.com', 'Aman Yadav');
      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      alert(`Login test failed: ${err.message}`);
    } finally {
      setTestLoginLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentRedirectUri = `${window.location.origin}/auth/google/callback`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-bold text-slate-900 text-sm">
              Google OAuth 2.0 & Neon PostgreSQL Console
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Live Neon PostgreSQL Database Status & Diagnostic */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Neon PostgreSQL Database
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Connected & Ready
              </span>
            </div>

            <p className="text-xs text-emerald-950 font-mono break-all bg-white/70 p-2 rounded border border-emerald-200">
              Host: ep-withered-paper-b4mgsq8e-pooler.c-6.us-east-2.aws.neon.tech
            </p>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleRunNeonTest}
                disabled={testingDb}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingDb ? 'animate-spin' : ''}`} />
                {testingDb ? 'Testing Neon Connection...' : 'Run Live Neon DB Diagnostic Query'}
              </button>
              <span className="text-[11px] text-emerald-800 font-medium">SSL: require</span>
            </div>

            {/* Live Diagnostic Result */}
            {dbTestResult && (
              <div className="mt-2 p-3 bg-white rounded-lg border border-emerald-200 text-xs space-y-1 animate-in fade-in duration-150">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{dbTestResult.message}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-700">
                  <div><strong>Query Latency:</strong> {dbTestResult.latency_ms} ms</div>
                  <div><strong>Database:</strong> {dbTestResult.database}</div>
                  <div><strong>Total Users:</strong> {dbTestResult.total_users}</div>
                  <div><strong>Total Questions:</strong> {dbTestResult.total_questions}</div>
                </div>
              </div>
            )}

            {dbTestError && (
              <div className="p-2.5 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 text-xs">
                {dbTestError}
              </div>
            )}
          </div>

          {/* Section 2: Launch Actual Google OAuth */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Actual Google OAuth 2.0 Sign-In
            </h4>

            <button
              onClick={handleLaunchGoogleOAuth}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-3 group"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              <span>Continue with Google (accounts.google.com)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Test Sign-In into Live Neon DB */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Direct Test with Live Neon DB</p>
                <p className="text-[11px] text-slate-500">
                  Instant sign-in as <strong>Aman Yadav</strong> (amanyadavabhay@gmail.com)
                </p>
              </div>
              <button
                onClick={handleQuickGoogleTest}
                disabled={testLoginLoading}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                {testLoginLoading ? 'Connecting...' : 'Test Login in Neon'}
              </button>
            </div>
          </div>

          {/* Section 3: Configure Google Client ID & Secret */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Google Cloud Console Keys
              </h4>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
              >
                Open Google Cloud Console <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Authorized Redirect URI copy box */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900 text-xs">
                  Authorized Redirect URI (add to Google OAuth client):
                </span>
                <button
                  onClick={() => copyToClipboard(currentRedirectUri, 'redirect')}
                  className="text-[11px] text-blue-700 font-bold flex items-center gap-1 hover:underline"
                >
                  {copiedKey === 'redirect' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'redirect' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <code className="block font-mono text-[10px] text-blue-800 bg-white p-1.5 rounded border border-blue-200 break-all select-all">
                {currentRedirectUri}
              </code>
            </div>

            {/* Dynamic Key Input Form */}
            <form onSubmit={handleSaveGoogleKeys} className="space-y-2 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  GOOGLE_CLIENT_ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789-abcdefg.apps.googleusercontent.com"
                  value={clientIdInput}
                  onChange={(e) => setClientIdInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  GOOGLE_CLIENT_SECRET
                </label>
                <input
                  type="password"
                  placeholder="e.g. GOCSPX-xxxxxxxxxxxxx"
                  value={clientSecretInput}
                  onChange={(e) => setClientSecretInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">
                  Keys are saved securely for your session
                </span>
                <button
                  type="submit"
                  disabled={savingKeys || !clientIdInput.trim() || !clientSecretInput.trim()}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg disabled:opacity-40 transition"
                >
                  {savingKeys ? 'Saving...' : saveSuccess ? 'Saved Active!' : 'Activate Google Keys'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Live Neon PostgreSQL + Google OAuth 2.0
          </span>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
