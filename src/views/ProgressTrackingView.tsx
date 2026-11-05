import React from 'react';
import { Activity, Download, Award, BookOpen, Terminal, Flag, Shield, CheckCircle2 } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { MODULES } from '../data/modulesData';
import { TOTAL_LESSONS_COUNT } from '../data/curriculum';
import { LABS } from '../data/labsData';
import { CTF_CHALLENGES } from '../data/ctfData';
import { MISSIONS } from '../data/missionsData';

export const ProgressTrackingView: React.FC = () => {
  const { progress, levelInfo, exportProgressJson } = useProgress();

  const handleExport = () => {
    const jsonStr = exportProgressJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybernexus-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Activity className="w-4 h-4" />
              <span>Learning Analytics & History</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Student Progress & Mastery Metrics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Track completion across all 15 curriculum modules, practical cyber labs, CTF arena points, and story missions.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export Progress JSON</span>
          </button>
        </div>
      </div>

      {/* 4 Pillars Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase">
            <span>Lessons</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {progress.completedLessons.length} <span className="text-xs text-slate-400 font-normal">/ {TOTAL_LESSONS_COUNT}</span>
          </div>
          <span className="text-[11px] text-slate-400">Completed across 15 modules</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
            <span>Cyber Labs</span>
            <Terminal className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {progress.completedLabs.length} <span className="text-xs text-slate-400 font-normal">/ {LABS.length}</span>
          </div>
          <span className="text-[11px] text-slate-400">Target simulations solved</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
            <span>CTF Flags</span>
            <Flag className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {progress.completedCtfs.length} <span className="text-xs text-slate-400 font-normal">/ {CTF_CHALLENGES.length}</span>
          </div>
          <span className="text-[11px] text-slate-400">Validated challenge proofs</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">
            <span>Missions</span>
            <Shield className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {progress.completedMissions.length} <span className="text-xs text-slate-400 font-normal">/ {MISSIONS.length}</span>
          </div>
          <span className="text-[11px] text-slate-400">Story-mode incidents closed</span>
        </div>
      </div>

      {/* Module Breakdown List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Module-by-Module Progress Breakdown (25 Lessons Each)
        </h3>

        <div className="space-y-4">
          {MODULES.map(m => {
            const completedCount = progress.completedLessons.filter(id => id.startsWith(`mod${m.number}-`)).length;
            const percent = Math.round((completedCount / 25) * 100);

            return (
              <div
                key={m.number}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="font-mono text-indigo-600 dark:text-cyan-400">Mod {m.number}</span>
                    <span>{m.title}</span>
                  </div>
                  <span className="font-mono text-slate-400 font-semibold">{completedCount} of 25 Lessons ({percent}%)</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
