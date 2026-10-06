import React from 'react';
import { Shield, PhoneCall, Globe, AlertCircle, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Project Details */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span>Community Cyber Safety Helpdesk</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              A community-driven digital awareness and guidance platform created as part of the
              <strong className="text-slate-200"> B.Sc. IT Semester V Community Engagement Project</strong>.
              Helping ordinary citizens, senior members, and students safely report doubts and avoid online frauds.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-900/60 p-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>Academic Disclaimer:</strong> This is an educational and awareness platform, not a hacking or testing tool.
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-blue-400 transition"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('safety-tips')}
                  className="hover:text-blue-400 transition"
                >
                  Cyber Safety Tips
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ask')}
                  className="hover:text-blue-400 transition"
                >
                  Ask a Question
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-blue-400 transition"
                >
                  About the Project
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Official Emergency Helplines */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Official Cyber Helpline
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block text-sm">Dial 1930</span>
                  <span>National Cyber Crime Helpline (Toll-Free)</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">cybercrime.gov.in</span>
                  <span>National Cyber Crime Reporting Portal</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
                In case of immediate financial fraud, contact your bank within 2 hours ("Golden Hour").
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 Community Cyber Safety Helpdesk — B.Sc. IT Semester V Community Engagement</p>
          <div className="flex items-center gap-1">
            Built with modern web technologies: React, FastAPI & SQLite
          </div>
        </div>
      </div>
    </footer>
  );
};
