import React from 'react';
import {
  ShieldCheck,
  Terminal,
  Award,
  Activity,
  ArrowRight,
  BookOpen,
  Layers,
  Sparkles,
  CheckCircle2,
  Lock,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import { MODULES } from '../data/modulesData';
import { TOTAL_LESSONS_COUNT } from '../data/curriculum';
import { LABS } from '../data/labsData';
import { CTF_CHALLENGES } from '../data/ctfData';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onSelectLesson?: (lessonId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onSelectLesson }) => {

  const stats = [
    { label: 'Curriculum Modules', value: '15 Modules', icon: Layers, color: 'text-indigo-600 dark:text-cyan-400' },
    { label: 'Detailed Lessons', value: `${TOTAL_LESSONS_COUNT} Lessons`, icon: BookOpen, color: 'text-cyan-600 dark:text-teal-400' },
    { label: 'Hands-On Labs', value: `${LABS.length} Live Labs`, icon: Terminal, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'CTF Challenges', value: `${CTF_CHALLENGES.length} Flags`, icon: Award, color: 'text-amber-600 dark:text-amber-400' }
  ];

  const featuredModules = MODULES.slice(0, 4);

  const faqs = [
    {
      q: 'Do I need prior cybersecurity experience to begin?',
      a: 'Not at all. CyberNexus is designed with a strict pedagogical progression. Module 1 starts from zero with foundational principles, the CIA Triad, and threat landscapes before progressing systematically to advanced concepts.'
    },
    {
      q: 'Is CyberNexus completely free?',
      a: 'Yes. All 15 modules, 375 detailed lessons, interactive diagrams, cyber labs, CTF arena, and SIEM tools are 100% free with no paywalls or mandatory paid subscriptions.'
    },
    {
      q: 'How does progress tracking work without an account?',
      a: 'CyberNexus utilizes local-first browser persistence. Your completed lessons, labs, CTF flags, XP, and streak are saved directly on your device. You can export or import your progress as JSON at any time from the Settings page.'
    },
    {
      q: 'Can I practice hands-on with real containerized labs?',
      a: 'Yes! CyberNexus includes practical Cyber Labs integrating real Docker Engine containers with dedicated Linux, Python, Networking, and Web Security challenges, resource caps, and auto-cleanup.'
    }
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-950/60 dark:to-cyan-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Complete Curriculum: 15 Modules · 375 Lessons</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Explore. Learn. Defend.{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Master Cybersecurity.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              An international-grade cybersecurity learning and practical training platform. From zero foundations to advanced offensive reconnaissance, defensive SIEM triage, packet analysis, digital forensics, and CTF arenas.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('lessons')}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('labs')}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs active:scale-95 transition-all"
              >
                <Terminal className="w-4 h-4 text-cyan-500" />
                <span>Explore Cyber Labs</span>
              </button>

              <button
                onClick={() => onNavigate('ctf')}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-indigo-600 dark:text-cyan-400 bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100 rounded-xl border border-indigo-200 dark:border-indigo-900 transition-all"
              >
                <Award className="w-4 h-4" />
                <span>CTF Arena</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="flex items-center gap-6 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>375 Progressive Lessons</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                <span>Zero Installation Required</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span>100% Free & Legal</span>
              </span>
            </div>
          </div>

          {/* Right Hero Visual Artwork */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950 group">
              <img
                src="/src/assets/images/cybernexus_hero_network_1793808860458.jpg"
                alt="CyberNexus High-Tech Cyber Command Center"
                className="w-full h-auto aspect-16/10 object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>DEFENSE GRID SIMULATOR</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">ALL SYSTEMS NOMINAL</span>
                </div>
                <p className="text-xs text-slate-300">
                  Global telemetry, interactive packet inspectors, and live SIEM defense active.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Real Platform Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                      {stat.value}
                    </div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Learning Modules Preview */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
              Curriculum Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              15 Comprehensive Learning Modules
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Every single module contains exactly 25 progressive textbook-quality lessons, taking you from fundamentals to advanced operations.
            </p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline shrink-0"
          >
            <span>View All 15 Modules (375 Lessons)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredModules.map(mod => (
            <div
              key={mod.number}
              onClick={() => onNavigate('lessons')}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-sm">
                    0{mod.number}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    25 Lessons
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">{mod.levelRange}</span>
                <span className="font-semibold text-indigo-600 dark:text-cyan-400 flex items-center gap-1">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cyber Labs & Red vs Blue Showcase */}
      <section className="bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Offensive vs Defensive Operations
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Red Team Infiltration · Blue Team Aegis
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              CyberNexus gives you two complementary viewpoints: learn how adversaries perform reconnaissance and exploit vulnerabilities, while simultaneously learning how SOC analysts monitor event streams, correlate alerts, and engineer resilient defenses.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => onNavigate('redteam')}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 hover:border-rose-400 text-left transition-all"
              >
                <div className="font-bold text-sm text-rose-600 dark:text-rose-400 mb-1 flex items-center justify-between">
                  <span>Red Team Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reconnaissance, Nmap port scanning, SUID privilege escalation, and web exploit labs.
                </p>
              </button>

              <button
                onClick={() => onNavigate('blueteam')}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 hover:border-blue-400 text-left transition-all"
              >
                <div className="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1 flex items-center justify-between">
                  <span>Blue Team Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  SIEM log correlation, Suricata IDS rule matching, and incident containment playbooks.
                </p>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950">
              <img
                src="/src/assets/images/red_blue_operations_1793808862264.jpg"
                alt="Red Team and Blue Team Cybersecurity Operations"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Practical Tools Spotlight */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
            Hands-On Interactive Tooling
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Built-In Cybersecurity Simulators
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No virtual machines or heavy hypervisors to download. Explore full-fidelity browser simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => onNavigate('siem')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400">
              Enterprise SIEM Dashboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Triage real security events, write custom detection filters, investigate severity timelines, and execute correlation rules.
            </p>
          </div>

          <div
            onClick={() => onNavigate('packet')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400">
              Wireshark Packet Dissector
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Dissect live network packet streams, analyze Ethernet frames, TCP sequence numbers, DNS payloads, and raw hexadecimal dumps.
            </p>
          </div>

          <div
            onClick={() => onNavigate('ctf')}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400">
              CTF Arena
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Solve original cybersecurity challenges across web, cryptography, forensics, and Linux to capture flags and earn XP.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
            Clear Answers
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {faq.q}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <h2 className="text-3xl font-black tracking-tight">
            Ready to Begin Your Cybersecurity Mastery?
          </h2>
          <p className="text-sm text-indigo-100 leading-relaxed">
            Jump into Module 1, Lesson 1 right now. Track your streak, earn XP, and unlock international-grade cybersecurity capabilities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('lessons')}
            className="px-6 py-3.5 text-xs font-bold text-indigo-900 bg-white hover:bg-slate-100 rounded-xl shadow-md transition-all active:scale-95"
          >
            Launch Lesson 1 →
          </button>
          <button
            onClick={() => onNavigate('labs')}
            className="px-5 py-3.5 text-xs font-bold text-white bg-indigo-950/60 hover:bg-indigo-950 border border-indigo-400/40 rounded-xl transition-all flex items-center gap-2"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Open Cyber Labs</span>
          </button>
        </div>
      </section>
    </div>
  );
};
