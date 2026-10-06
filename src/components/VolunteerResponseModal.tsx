import React, { useState } from 'react';
import { X, CheckCircle, ShieldAlert, Send, Sparkles } from 'lucide-react';
import { Question } from '../types';
import { api } from '../services/api';

interface VolunteerResponseModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedQuestion: Question) => void;
}

const QUICK_SAFETY_TEMPLATES = [
  {
    title: 'UPI QR Code / Refund Scam',
    text: '⚠️ NEVER enter your UPI PIN or scan a QR code to receive money. UPI PINs are only required to debit money from your account, never to receive refunds or cashback. Please block the sender number and report the incident immediately on the National Cyber Helpline (dial 1930) or cybercrime.gov.in.',
  },
  {
    title: 'Fake Electricity / APK Phishing',
    text: '⚠️ DO NOT click the link or install the .apk file. Power utility companies and banks never ask customers to download APK files via SMS. Fraudulent APKs contain spyware that hijacks your OTP messages. Delete the SMS and block the number immediately.',
  },
  {
    title: 'Compromised Social Media Account',
    text: '🔐 Immediately change your social media account password and select "Log out of all other devices". Enable Two-Factor Authentication (2FA) via an authenticator app (Google Authenticator) instead of SMS. Warn your friends not to send money if they receive messages from your profile.',
  },
  {
    title: 'Suspicious Job / Task Offer',
    text: '⚠️ This is a classic part-time review/task scam. Legitimate companies never demand registration deposits or ask you to pay money to withdraw earnings. Cease all communication, do not send any fees, and report the Telegram/WhatsApp group.',
  },
];

export const VolunteerResponseModal: React.FC<VolunteerResponseModalProps> = ({
  question,
  isOpen,
  onClose,
  onUpdated,
}) => {
  if (!isOpen || !question) return null;

  const [responseText, setResponseText] = useState(question.response || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim() || responseText.trim().length < 5) {
      setError('Please provide clear, actionable safety guidance (minimum 5 characters).');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const updated = await api.respondToQuestion(question.id, responseText.trim());
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const applyTemplate = (text: string) => {
    setResponseText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                Project Demonstration
              </span>
              <span className="text-xs font-semibold text-slate-500">{question.id}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Provide Helpdesk Guidance
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Question Summary */}
          <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
            <div className="flex items-center justify-between text-xs text-blue-800 font-semibold mb-1">
              <span>Category: {question.category}</span>
              <span className="text-slate-500 font-normal">
                Submitted on {new Date(question.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-slate-800 font-medium whitespace-pre-wrap">
              "{question.question}"
            </p>
          </div>

          {/* Quick Guidance Templates */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick Verified Guidance Templates (for Demo / Viva):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_SAFETY_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyTemplate(tmpl.text)}
                  className="text-left p-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-[11px] font-medium text-slate-700 transition line-clamp-1"
                >
                  ⚡ {tmpl.title}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Helpdesk Advice / Guidance for Community Member:
              </label>
              <textarea
                rows={4}
                required
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type beginner-friendly cyber safety advice and next steps..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-md border border-rose-200">
                {error}
              </p>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Saving Guidance...' : 'Publish Answer & Mark Resolved'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
