import React from 'react';
import { ShieldCheck, Target, Heart, Award, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export const AboutView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 font-mono text-xs font-bold text-indigo-700 dark:text-cyan-300">
          EXPLORE · LEARN · DEFEND · MASTER
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          About CyberNexus
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          CyberNexus is a comprehensive, production-grade cybersecurity education and practical training ecosystem. Built from first principles to bridge the critical gap between academic theory and high-stakes operational defense.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Pedagogical Rigor
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All 15 modules follow a non-negotiable 25-lesson sequence, transitioning from beginner concepts (1–5) to advanced enterprise architectures (23–25).
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Dual-Force Synergy
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Offensive Red Team skills and defensive Blue Team engineering are treated as two halves of one unified discipline: you cannot effectively defend what you do not know how to break.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            100% Free & Legal
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No paid APIs or paywalled modules. Complete browser-isolated practice environments designed to teach legal and authorized security testing.
          </p>
        </div>
      </div>

      {/* Authorized Learning & Ethics Pledge */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
          <Lock className="w-4 h-4" />
          <span>Legal & Ethical Learning Pledge</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Commitment to Responsible Cybersecurity
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          CyberNexus exercises must strictly be executed within our authorized virtual lab sandboxes. We teach offensive methodologies exclusively to empower students, engineers, and SOC analysts to detect vulnerabilities, patch infrastructure, and defend humanity&apos;s digital fabric from unauthorized exploitation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Never scan or test unauthorized third-party hosts.</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Report newly discovered flaws via Responsible Disclosure.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
