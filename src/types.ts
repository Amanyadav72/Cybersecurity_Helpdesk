export type QuestionCategory =
  | 'Phishing'
  | 'Online Banking'
  | 'UPI & Payment Safety'
  | 'Social Media Safety'
  | 'Password Security'
  | 'Privacy'
  | 'Online Scams'
  | 'Cyberbullying'
  | 'Suspicious Links'
  | 'Other';

export interface User {
  id: number;
  google_id: string;
  name: string;
  email: string;
  profile_picture?: string;
  created_at: string;
}

export interface Question {
  id: string;
  user_id: number;
  category: QuestionCategory;
  question: string;
  status: 'Pending' | 'Answered';
  response: string | null;
  created_at: string;
  updated_at?: string;
}

export interface DashboardStats {
  user: User;
  total_questions: number;
  pending_questions: number;
  answered_questions: number;
  recent_questions: Question[];
}

export const CATEGORIES: { label: QuestionCategory; icon: string; description: string }[] = [
  { label: 'Phishing', icon: '🎣', description: 'Fake emails, messages, or websites pretending to be banks/authorities.' },
  { label: 'Online Banking', icon: '🏦', description: 'Net banking, credit/debit card safety, and unauthorized bank debits.' },
  { label: 'UPI & Payment Safety', icon: '💳', description: 'Google Pay, PhonePe, Paytm QR code safety, and refund scams.' },
  { label: 'Social Media Safety', icon: '📱', description: 'Instagram, WhatsApp, Facebook account hacking, fake profiles.' },
  { label: 'Password Security', icon: '🔒', description: 'Creating strong passwords, 2-factor authentication, and password leaks.' },
  { label: 'Privacy', icon: '🛡️', description: 'App permissions, camera/microphone spying, and personal data protection.' },
  { label: 'Online Scams', icon: '⚠️', description: 'Job offers, lottery/prize scams, part-time task scams, and courier fraud.' },
  { label: 'Cyberbullying', icon: '🚫', description: 'Harassment, offensive comments, blackmail, and unauthorized photo sharing.' },
  { label: 'Suspicious Links', icon: '🔗', description: 'Shortened URLs, APK downloads, electricity bill disconnect links.' },
  { label: 'Other', icon: '❓', description: 'Any other digital device, internet, or cyber security question.' },
];
