import React, { useEffect, useState } from 'react';
import {
  Question,
  User as UserType,
} from '../types';
import { api } from '../services/api';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Tag,
  AlertCircle,
  PlusCircle,
  Search,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { VolunteerResponseModal } from '../components/VolunteerResponseModal';

interface MyQuestionsPageProps {
  user: UserType | null;
  onNavigate: (page: string) => void;
  onOpenSignIn: () => void;
}

export const MyQuestionsPage: React.FC<MyQuestionsPageProps> = ({
  user,
  onNavigate,
  onOpenSignIn,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Answered'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Demonstration reply modal
  const [respondingQuestion, setRespondingQuestion] = useState<Question | null>(null);

  const fetchQuestions = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMyQuestions();
      setQuestions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch your questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Sign in to View Your Questions</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Each community member's questions are strictly isolated and private to their Google account.
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

  // Filter and search questions
  const filteredQuestions = questions.filter((q) => {
    const matchesFilter = filterStatus === 'All' || q.status === filterStatus;
    const matchesSearch =
      q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.response && q.response.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleQuestionUpdated = (updated: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            Your Community Records
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Submitted Questions
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Displaying only queries submitted under your Google account ({user.email}).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchQuestions}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            title="Refresh questions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => onNavigate('ask')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Ask Another Question
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['All', 'Pending', 'Answered'] as const).map((status) => {
            const count =
              status === 'All'
                ? questions.length
                : questions.filter((q) => q.status === status).length;
            const isActive = filterStatus === status;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {status}
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, category, keyword..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Questions List */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">
          Loading your cyber-safety questions...
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No questions found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? 'Try a different search keyword or clear your filter.'
                : 'You have not submitted any questions under this filter.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('ask')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Submit a New Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isAnswered = q.status === 'Answered';
            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-slate-300 transition"
              >
                {/* Question Header: ID, Category, Status, Date */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      ID: {q.id}
                    </span>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-blue-600" />
                      {q.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                        isAnswered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {isAnswered ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Answered
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Pending Guidance
                        </>
                      )}
                    </span>

                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(q.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* User's Question Text */}
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Your Question:
                  </span>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                    {q.question}
                  </p>
                </div>

                {/* Official Response Section (if available) */}
                {isAnswered && q.response ? (
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/90 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Community Helpdesk Guidance & Advice
                      </span>
                      {q.updated_at && (
                        <span className="text-[11px] font-normal text-emerald-700">
                          Updated on {new Date(q.updated_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                      {q.response}
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-800 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      Our student helpdesk team is analyzing your question. Verified guidance will appear right here.
                    </span>
                  </div>
                )}

                {/* Demo Action: Volunteer Responder Toggle for presentation */}
                <div className="pt-2 flex items-center justify-end border-t border-slate-100">
                  <button
                    onClick={() => setRespondingQuestion(q)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition"
                    title="Demonstrate the helpdesk answering mechanism"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {isAnswered ? 'Edit Helpdesk Answer (Demo)' : 'Answer as Helpdesk Volunteer (Demo)'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Volunteer Answer Modal */}
      <VolunteerResponseModal
        question={respondingQuestion}
        isOpen={!!respondingQuestion}
        onClose={() => setRespondingQuestion(null)}
        onUpdated={handleQuestionUpdated}
      />
    </div>
  );
};
