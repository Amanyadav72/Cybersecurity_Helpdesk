import React, { useState } from 'react';
import {
  CATEGORIES,
  QuestionCategory,
  Question,
  User as UserType,
} from '../types';
import { api } from '../services/api';
import {
  HelpCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface AskQuestionPageProps {
  user: UserType | null;
  onNavigate: (page: string) => void;
  onOpenSignIn: () => void;
}

const EXAMPLE_QUERIES = [
  {
    category: 'UPI & Payment Safety' as QuestionCategory,
    text: 'A buyer on OLX asked me to scan a QR code on Google Pay to receive payment for my old sofa. Is this genuine?',
  },
  {
    category: 'Phishing' as QuestionCategory,
    text: 'I received an SMS claiming my electricity bill is overdue and connection will be cut tonight unless I download an APK file.',
  },
  {
    category: 'Social Media Safety' as QuestionCategory,
    text: 'A stranger on Instagram is claiming they can double my money in 24 hours through crypto mining. Should I trust this?',
  },
  {
    category: 'Online Banking' as QuestionCategory,
    text: 'A caller claiming to be from SBI asked for my card expiration date and CVV to update my KYC. Should I give it?',
  },
];

export const AskQuestionPage: React.FC<AskQuestionPageProps> = ({
  user,
  onNavigate,
  onOpenSignIn,
}) => {
  const [category, setCategory] = useState<QuestionCategory>('Phishing');
  const [questionText, setQuestionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedQuestion, setSubmittedQuestion] = useState<Question | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Sign in to Ask a Question</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Please sign in using your Google account so you can track your questions and receive verified answers from our community helpdesk.
          </p>
        </div>
        <button
          onClick={onOpenSignIn}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition inline-flex items-center gap-2"
        >
          Sign in with Google
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || questionText.trim().length < 10) {
      setError('Please provide at least 10 characters describing your question or situation.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await api.submitQuestion(category, questionText.trim());
      setSubmittedQuestion(res);
      setQuestionText('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit question. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (!submittedQuestion) return;
    navigator.clipboard.writeText(submittedQuestion.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const applyExample = (ex: typeof EXAMPLE_QUERIES[0]) => {
    setCategory(ex.category);
    setQuestionText(ex.text);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          Community Helpdesk Query Form
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Ask a Cyber Safety Question
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Describe the message, call, or suspicious internet situation you encountered. Our student helpdesk will provide beginner-friendly guidance.
        </p>
      </div>

      {/* Success State */}
      {submittedQuestion ? (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-sm text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Question submitted successfully.
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Your cyber safety query has been assigned a unique reference ID. You can check back anytime in <strong>My Questions</strong> to see the response.
            </p>
          </div>

          {/* Reference ID card */}
          <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-3 rounded-xl">
            <div className="text-left">
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                Reference ID
              </span>
              <span className="font-mono text-lg font-extrabold text-blue-700">
                {submittedQuestion.id}
              </span>
            </div>
            <button
              onClick={handleCopyId}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition"
              title="Copy Reference ID"
            >
              <Copy className="w-4 h-4" />
            </button>
            {copiedId && (
              <span className="text-xs text-emerald-600 font-semibold">Copied!</span>
            )}
          </div>

          {/* Details summary */}
          <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 text-left text-xs text-slate-700 space-y-1.5 border border-slate-200">
            <div>
              <span className="font-semibold text-slate-900">Category:</span>{' '}
              {submittedQuestion.category}
            </div>
            <div>
              <span className="font-semibold text-slate-900">Status:</span>{' '}
              <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[10px]">
                Pending Helpdesk Verification
              </span>
            </div>
            <div className="pt-1 text-slate-600 italic">
              "{submittedQuestion.question}"
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('my-questions')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              View in My Questions
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSubmittedQuestion(null)}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              Ask Another Question
            </button>
          </div>
        </div>
      ) : (
        /* Form State */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Dropdown */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-slate-900 mb-1"
              >
                1. Select Query Category <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Choose the category that best matches your situation.
              </p>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as QuestionCategory)}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-800"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.icon} {c.label} — {c.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Textarea */}
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-semibold text-slate-900 mb-1"
              >
                2. Describe Your Question / Suspicious Incident <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Explain clearly. Do not share your real passwords, OTPs, or full bank account numbers in the text.
              </p>
              <textarea
                id="question"
                rows={5}
                required
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Example: I received a message saying my electricity bill is unpaid. They asked me to download 'ElectricityBill.apk' from an unfamiliar link. Is this dangerous?"
                className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder:text-slate-400"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>Minimum 10 characters required</span>
                <span>{questionText.length} characters</span>
              </div>
            </div>

            {/* Example Queries Helper */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Need an idea? Click a common community question:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {EXAMPLE_QUERIES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyExample(ex)}
                    className="text-left p-2.5 bg-white border border-slate-200 hover:border-blue-400 rounded-lg text-xs text-slate-700 transition hover:bg-blue-50/50"
                  >
                    <span className="font-semibold text-blue-700 block text-[11px] mb-0.5">
                      {ex.category}
                    </span>
                    <span className="line-clamp-2">{ex.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting Question...' : 'Submit Question'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
