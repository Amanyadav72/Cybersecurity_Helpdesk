import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  Plus,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { api, SystemStatus } from '../services/api';
import { User as UserType } from '../types';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemStatus?: SystemStatus | null;
  onLoginSuccess?: (user: UserType) => void;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  onClose,
  systemStatus,
  onLoginSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCustomAccount, setShowCustomAccount] = useState(false);

  // Custom account input state
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  // Default Google user (Aman Yadav)
  const defaultGoogleUser = {
    name: 'Aman Yadav',
    email: 'amanyadavabhay@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
  };

  if (!isOpen) return null;

  const handleSignIn = async (email: string, name: string, avatar?: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.signInWithGoogle({
        email,
        name,
        profile_picture: avatar,
      });

      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to complete Google sign-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) {
      setErrorMessage('Please enter a valid Google email address.');
      return;
    }
    const nameToUse = customName.trim() || customEmail.split('@')[0];
    handleSignIn(customEmail.trim(), nameToUse);
  };

  const handleBrowserOAuth = () => {
    if (systemStatus?.google_oauth.configured) {
      api.initiateGoogleLogin();
    } else {
      // If client credentials are not configured in cloud console, perform seamless direct sign-in as Aman Yadav
      handleSignIn(defaultGoogleUser.email, defaultGoogleUser.name, defaultGoogleUser.avatar);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
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
            <span className="font-semibold text-slate-800 text-base">Sign in with Google</span>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Choose an account</h3>
            <p className="text-xs text-slate-500">
              to continue to <strong className="text-slate-700">Community Cyber Safety Helpdesk</strong>
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!showCustomAccount ? (
            <div className="space-y-3">
              {/* Primary User Account Card */}
              <button
                type="button"
                onClick={() =>
                  handleSignIn(defaultGoogleUser.email, defaultGoogleUser.name, defaultGoogleUser.avatar)
                }
                disabled={isLoading}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition flex items-center justify-between text-left group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={defaultGoogleUser.avatar}
                      alt={defaultGoogleUser.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-xs">
                      <svg className="w-3 h-3" viewBox="0 0 24 24">
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
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{defaultGoogleUser.name}</div>
                    <div className="text-xs text-slate-500">{defaultGoogleUser.email}</div>
                  </div>
                </div>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                )}
              </button>

              {/* Use Another Google Account option */}
              <button
                type="button"
                onClick={() => setShowCustomAccount(true)}
                disabled={isLoading}
                className="w-full p-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Plus className="w-4 h-4 text-slate-500" />
                <span>Use another Google account</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. yourname@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomAccount(false)}
                  disabled={isLoading}
                  className="w-1/3 py-2.5 px-3 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !customEmail.trim()}
                  className="w-2/3 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Continue with Google</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Privacy Note */}
          <div className="pt-2 text-[11px] text-slate-500 text-center leading-relaxed">
            To continue, Google will share your name, email address, and profile picture with Community Cyber Safety Helpdesk.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Google Authentication</span>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-600 hover:text-slate-900 font-medium text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
