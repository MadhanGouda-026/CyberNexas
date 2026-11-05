import React from 'react';
import { ShieldCheck, Terminal, Shield, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Ethos */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                CyberNexus
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Explore. Learn. Defend. Master Cybersecurity. Production-grade educational curriculum with 375 progressive lessons, interactive labs, and realistic defense simulations.
            </p>

          </div>

          {/* Col 2: Curriculum Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Curriculum & Academy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('lessons')} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
                  Curriculum Explorer (375 Lessons)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
                  15 Learning Modules
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('paths')} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
                  Structured Learning Paths
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('progress')} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
                  Progress & Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Practical Cyber Labs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Hands-On Practice
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('labs')} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Browser Terminal Labs</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ctf')} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>CTF Challenge Arena</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('missions')} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-rose-500" />
                  <span>Story Mode Cyber Missions</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('siem')} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
                  SIEM & Event Log Viewer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('packet')} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
                  Wireshark Packet Dissector
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Operations & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Governance & Ethics
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
                  About CyberNexus & Pedagogy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('help')} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
                  Help Center & Cheat Sheets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('settings')} className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">
                  Data Backup & Preferences
                </button>
              </li>
              <li>
                <span className="text-[11px] text-slate-400 block pt-1 leading-relaxed">
                  Strictly authorized learning. All security exercises are conducted in browser-isolated educational sandboxes.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 CyberNexus Platform. Safe & Authorized Cybersecurity Learning.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-900 dark:hover:text-white">
              Rules of Engagement
            </button>
            <button onClick={() => onNavigate('help')} className="hover:text-slate-900 dark:hover:text-white">
              Documentation
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
