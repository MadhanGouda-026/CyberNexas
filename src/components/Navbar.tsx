import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Laptop, ShieldCheck, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { theme, setTheme } = useTheme();
  const { levelInfo } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState<boolean>(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'lessons', label: 'Curriculum (375)' },
    { id: 'labs', label: 'Cyber Labs' },
    { id: 'ctf', label: 'CTF Arena' },
    { id: 'siem', label: 'SIEM' }
  ];

  const secondaryTools = [
    { id: 'missions', label: 'Missions (Story Mode)' },
    { id: 'redteam', label: 'Red Team Ops' },
    { id: 'blueteam', label: 'Blue Team Defense' },
    { id: 'ids', label: 'IDS Learning' },
    { id: 'network', label: 'Network Analyzer' },
    { id: 'packet', label: 'Packet Analyzer' },
    { id: 'forensics', label: 'Digital Forensics' },
    { id: 'threatintel', label: 'Threat Intelligence' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'courses', label: '15 Modules Catalog' },
    { id: 'paths', label: 'Learning Paths' },
    { id: 'progress', label: 'Progress Tracking' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'profile', label: 'Profile' },
    { id: 'settings', label: 'Settings' },
    { id: 'about', label: 'About CyberNexus' },
    { id: 'help', label: 'Help & Docs' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-white dark:via-cyan-100 dark:to-white bg-clip-text text-transparent whitespace-nowrap">
                CyberNexus
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {navLinks.map(link => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative py-1 whitespace-nowrap transition-colors hover:text-indigo-600 dark:hover:text-cyan-400 ${
                    isActive ? 'text-indigo-600 dark:text-cyan-400 font-bold' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-cyan-400 rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="flex items-center gap-1 py-1 hover:text-indigo-600 dark:hover:text-cyan-400 whitespace-nowrap"
              >
                <span>Modules & Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xl grid grid-cols-1 gap-0.5 z-50 max-h-96 overflow-y-auto"
                  onClick={() => setMoreDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    All Platform Sections (22)
                  </div>
                  {secondaryTools.map(t => (
                    <button
                      key={t.id}
                      onClick={() => onNavigate(t.id)}
                      className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Actions (ZIP Download, Theme Toggle, Rank XP, Mobile Toggle) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Rank Level Pill */}
            <button
              onClick={() => onNavigate('profile')}
              className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              title={`Level ${levelInfo.level}: ${levelInfo.rankTitle}`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>Lv.{levelInfo.level}</span>
              <span className="text-slate-400 font-mono">({levelInfo.currentXp} XP)</span>
            </button>


            {/* Theme Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setTheme('light')}
                className={`p-1 rounded-lg text-xs transition-colors ${
                  theme === 'light' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Light Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1 rounded-lg text-xs transition-colors ${
                  theme === 'dark' ? 'bg-slate-700 text-cyan-300 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Dark Theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-1 rounded-lg text-xs transition-colors ${
                  theme === 'system' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-300 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="System Theme"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 max-h-[80vh] overflow-y-auto space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Primary Navigation</div>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                  currentView === link.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-cyan-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 pt-2">All 22 Platform Hubs</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {secondaryTools.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  onNavigate(t.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${
                  currentView === t.id
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-cyan-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-500">Current Rank: {levelInfo.rankTitle}</span>
            <span className="font-mono text-cyan-500 font-bold">Lv.{levelInfo.level} ({levelInfo.currentXp} XP)</span>
          </div>
        </div>
      )}
    </header>
  );
};
