import React, { useState } from 'react';
import {
  KeyRound,
  Fish,
  CreditCard,
  Share2,
  Shield,
  ShoppingBag,
  Wifi,
  AlertOctagon,
  CheckCircle,
  XCircle,
  PhoneCall,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface SafetyTipItem {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  summary: string;
  dos: string[];
  donts: string[];
}

const SAFETY_TIPS: SafetyTipItem[] = [
  {
    id: 'password-security',
    title: 'Password Security',
    icon: KeyRound,
    color: 'blue',
    summary: 'Passwords are the primary keys to your digital identity and finances. Keep them complex and unique.',
    dos: [
      'Create passwords with at least 12 characters including numbers and symbols.',
      'Use a passphrase like "Mango#Sky$48Train" which is easy to remember but hard to guess.',
      'Turn on Two-Factor Authentication (2FA) wherever available.',
    ],
    donts: [
      'Never reuse the same password for banking, email, and social media.',
      'Never use obvious details like your birth date, phone number, or "123456".',
      'Never write down passwords on paper near your computer or phone.',
    ],
  },
  {
    id: 'phishing-awareness',
    title: 'Phishing Awareness',
    icon: Fish,
    color: 'rose',
    summary: 'Phishing tricks you into clicking fake links or sharing passwords via fake messages pretending to be your bank or employer.',
    dos: [
      'Inspect the sender’s full email address and website URL before clicking.',
      'Contact the institution directly using their official website or customer care number.',
      'Look for official security padlocks and correct spellings in the domain name.',
    ],
    donts: [
      'Never click on links in SMS claiming your bank account or electricity is suspended.',
      'Never download unknown .apk files or attachments sent by unverified contacts.',
      'Never rush into actions driven by panic messages like "Account blocked in 1 hour".',
    ],
  },
  {
    id: 'upi-safety',
    title: 'UPI Safety',
    icon: CreditCard,
    color: 'emerald',
    summary: 'Unified Payments Interface (UPI) is instant and convenient, but fraudsters exploit misunderstandings about how PINs work.',
    dos: [
      'Remember: UPI PIN is ONLY entered to SEND or PAY money, never to RECEIVE money.',
      'Always verify the recipient display name on the screen before confirming any payment.',
      'Set daily transaction limits on your bank app to minimize risk.',
    ],
    donts: [
      'Never scan a QR code sent by a buyer or stranger on OLX, WhatsApp, or Facebook.',
      'Never accept incoming "Collect" requests from unknown individuals.',
      'Never share your UPI PIN or banking OTP with anyone over a voice call.',
    ],
  },
  {
    id: 'social-media-safety',
    title: 'Social Media Safety',
    icon: Share2,
    color: 'purple',
    summary: 'Keep your personal relationships and reputation protected from account takeovers and impersonation.',
    dos: [
      'Set your social media profiles (Instagram, Facebook) to Private mode.',
      'Verify with your friend over a phone call if their account suddenly asks for emergency money.',
      'Review and remove third-party apps connected to your social accounts.',
    ],
    donts: [
      'Never post photos of your boarding passes, house keys, ID cards, or credit cards.',
      'Never accept friend requests from strangers or clone profiles of people you know.',
      'Never log into social accounts on public computers without logging out afterwards.',
    ],
  },
  {
    id: 'privacy-protection',
    title: 'Privacy Protection',
    icon: Shield,
    color: 'teal',
    summary: 'Control what personal data applications, trackers, and strangers can collect about your daily life.',
    dos: [
      'Review smartphone app permissions (Camera, Location, Microphone, Contacts).',
      'Turn off location access for apps that do not genuinely need it (calculators, games).',
      'Read app permissions carefully before installing new apps from Play Store.',
    ],
    donts: [
      'Never grant "SMS" or "Accessibility" permissions to flashlights or casual games.',
      'Never install apps from unofficial third-party websites outside Google Play Store.',
      'Never share OTPs received during app registrations with other people.',
    ],
  },
  {
    id: 'online-shopping-safety',
    title: 'Online Shopping Safety',
    icon: ShoppingBag,
    color: 'amber',
    summary: 'Shop only on trustworthy, reputed platforms and avoid unrealistically cheap offers.',
    dos: [
      'Shop only on reputed platforms with HTTPS encryption and clear refund policies.',
      'Use virtual cards or Cash on Delivery (COD) when shopping on a newly discovered site.',
      'Check customer reviews and physical address details of unknown online stores.',
    ],
    donts: [
      'Never trust sponsored ads on Instagram selling branded shoes or phones at 90% discount.',
      'Never pay in advance through direct UPI to unknown sellers found on Instagram pages.',
      'Never share card CVV or expiry date on non-secure web forms.',
    ],
  },
  {
    id: 'public-wifi-safety',
    title: 'Public Wi-Fi Safety',
    icon: Wifi,
    color: 'indigo',
    summary: 'Free Wi-Fi at railway stations, cafes, and airports can be intercepted by hackers.',
    dos: [
      'Use cellular mobile data (4G/5G) for banking or confidential work whenever possible.',
      'Use a trusted VPN if you must connect to public networks.',
      'Forget open Wi-Fi networks in your phone settings after you finish using them.',
    ],
    donts: [
      'Never log into your bank account or make UPI payments while on open public Wi-Fi.',
      'Never ignore browser SSL warning messages like "Your connection is not private".',
      'Never leave device discovery and AirDrop/QuickShare enabled on public networks.',
    ],
  },
  {
    id: 'scam-awareness',
    title: 'Scam Awareness',
    icon: AlertOctagon,
    color: 'red',
    summary: 'Scammers exploit emotions like fear, greed, or curiosity. Learn the most common scam patterns.',
    dos: [
      'Stay skeptical of unexpected lottery winnings, customs package seizures, or job tasks.',
      'Verify job offers directly on the official company careers page.',
      'Dial 1930 immediately if you suspect you transferred money to a scammer.',
    ],
    donts: [
      'Never pay "processing fees" or "security deposits" to receive an online job or lottery.',
      'Never install screen-sharing software (AnyDesk, TeamViewer, RustDesk) at anyone\'s request.',
      'Never believe callers pretending to be police officers threatening "digital arrest" via video call.',
    ],
  },
];

export const SafetyTipsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTips =
    selectedCategory === 'all'
      ? SAFETY_TIPS
      : SAFETY_TIPS.filter((t) => t.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
          <BookOpen className="w-3.5 h-3.5" />
          Community Education & Awareness
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Cyber Safety Tips for Everyday Citizens
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Simple, easy-to-understand rules for protecting your family, money, and personal accounts from common online scams.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Topics ({SAFETY_TIPS.length})
        </button>
        {SAFETY_TIPS.map((tip) => (
          <button
            key={tip.id}
            onClick={() => setSelectedCategory(tip.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition ${
              selectedCategory === tip.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tip.title}
          </button>
        ))}
      </div>

      {/* 8 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition space-y-5"
            >
              {/* Card Title & Icon */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{tip.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {tip.summary}
                  </p>
                </div>
              </div>

              {/* Do's and Don'ts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                {/* Do's */}
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Do's
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {tip.dos.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-emerald-500 font-bold shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Don'ts */}
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                    <XCircle className="w-3 h-3 text-rose-600" />
                    Don'ts
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {tip.donts.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-rose-500 font-bold shrink-0">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Guidance Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">What to do if you have been scammed?</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Don't feel ashamed or panicked. Cyber criminals use sophisticated social engineering techniques. Act quickly within the first 2 hours ("Golden Period"):
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm">
            <PhoneCall className="w-4 h-4" />
            Call 1930 Helpline
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="font-bold text-white block">1. Contact Your Bank</span>
            <span className="text-slate-400">
              Immediately call your bank’s 24/7 hotline to freeze debit cards, UPI IDs, and net banking access.
            </span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="font-bold text-white block">2. Dial 1930 / cybercrime.gov.in</span>
            <span className="text-slate-400">
              Register an incident on the National Cybercrime Portal to stop fraud money transfers before they are cashed out.
            </span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="font-bold text-white block">3. Preserve Evidence</span>
            <span className="text-slate-400">
              Take screenshots of SMS messages, WhatsApp chats, call logs, and payment transaction IDs.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
