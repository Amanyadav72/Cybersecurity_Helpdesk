import React, { useEffect, useState } from 'react';
import { User } from './types';
import { api, getStoredUser, setStoredAuth } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GoogleSignInModal } from './components/GoogleSignInModal';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { AskQuestionPage } from './pages/AskQuestionPage';
import { MyQuestionsPage } from './pages/MyQuestionsPage';
import { SafetyTipsPage } from './pages/SafetyTipsPage';
import { AboutProjectPage } from './pages/AboutProjectPage';
import { AlertCircle, CheckCircle2, ShieldCheck, Sparkles, X } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Check initial authentication and URL params on load
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    const authError = searchParams.get('auth_error');

    if (authError) {
      setNotification({ message: decodeURIComponent(authError), type: 'error' });
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (token) {
      // Returned from Google OAuth callback
      try {
        const decoded = JSON.parse(atob(token));
        const dummyUser: User = {
          id: decoded.sub || 1,
          google_id: 'google-oauth-' + (decoded.sub || 'user'),
          name: decoded.name || 'Community Member',
          email: decoded.email || 'user@gmail.com',
          profile_picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
          created_at: new Date().toISOString(),
        };
        setStoredAuth(token, dummyUser);
        setUser(dummyUser);
        setCurrentPage('dashboard');
        setNotification({ message: `Welcome back, ${dummyUser.name}! Signed in via Google.`, type: 'success' });
      } catch {
        // Fallback
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Verify session with backend
    api.checkAuth().then((authenticatedUser) => {
      if (authenticatedUser) {
        setUser(authenticatedUser);
      }
    });
  }, []);

  const handleNavigate = (page: string) => {
    // If attempting to access authenticated pages without user, open sign in modal
    if ((page === 'dashboard' || page === 'my-questions' || page === 'ask') && !user) {
      setIsSignInOpen(true);
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignInSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setCurrentPage('dashboard');
    setNotification({
      message: `Signed in successfully as ${authenticatedUser.name}!`,
      type: 'success',
    });
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setCurrentPage('home');
    setNotification({ message: 'You have been logged out safely.', type: 'info' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* College Project Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-white">
              B.Sc. IT Semester V Community Engagement Project
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">
              Community Helpdesk for Cyber Safety Queries
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-sm">
              Helpline: 1930
            </span>
            {!user && (
              <button
                onClick={() => setIsSignInOpen(true)}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
              >
                Sign in with Google &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <Navbar
        user={user}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSignIn={() => setIsSignInOpen(true)}
        onLogout={handleLogout}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="max-w-md mx-auto fixed top-20 right-4 z-50 animate-in slide-in-from-top-4 duration-200">
          <div
            className={`p-3.5 rounded-xl shadow-lg border flex items-center justify-between gap-3 text-xs font-semibold ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : notification.type === 'error'
                ? 'bg-rose-50 text-rose-900 border-rose-200'
                : 'bg-blue-50 text-blue-900 border-blue-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 hover:bg-black/5 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            user={user}
            onNavigate={handleNavigate}
            onOpenSignIn={() => setIsSignInOpen(true)}
          />
        )}
        {currentPage === 'dashboard' && user && (
          <DashboardPage user={user} onNavigate={handleNavigate} />
        )}
        {currentPage === 'ask' && (
          <AskQuestionPage
            user={user}
            onNavigate={handleNavigate}
            onOpenSignIn={() => setIsSignInOpen(true)}
          />
        )}
        {currentPage === 'my-questions' && (
          <MyQuestionsPage
            user={user}
            onNavigate={handleNavigate}
            onOpenSignIn={() => setIsSignInOpen(true)}
          />
        )}
        {currentPage === 'safety-tips' && <SafetyTipsPage />}
        {currentPage === 'about' && <AboutProjectPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Google Sign In Modal */}
      <GoogleSignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSuccess={handleSignInSuccess}
      />
    </div>
  );
}
