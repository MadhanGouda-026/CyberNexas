import React, { useState } from 'react';
import { BookOpen, Search, Filter, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MODULES } from '../data/modulesData';
import { ModuleInfo } from '../types';
import { useProgress } from '../context/ProgressContext';

export const CoursesView: React.FC<{
  onSelectModule: (modNum: number) => void;
  onNavigate: (view: string) => void;
}> = ({ onSelectModule, onNavigate }) => {
  const { progress } = useProgress();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Fundamentals', 'Systems', 'Offensive', 'Defensive', 'Operations', 'Specialized'];

  const filteredModules = MODULES.filter(mod => {
    if (selectedCategory !== 'All' && mod.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        mod.title.toLowerCase().includes(q) ||
        mod.description.toLowerCase().includes(q) ||
        mod.tagline.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Layers className="w-4 h-4" />
              <span>Full Curriculum Directory</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              All 15 Cybersecurity Modules (375 Lessons)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Every single module contains exactly 25 detailed progressive lessons covering theory, attacks, defensive engineering, and hands-on validation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
            <span>Total Completed:</span>
            <span className="font-bold text-indigo-600 dark:text-cyan-400 font-mono">
              {progress.completedLessons.length} / 375 Lessons
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search module title or concepts (e.g. Linux, Cryptography, Cloud, Forensics)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c} Category</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map(mod => {
          const completedInMod = progress.completedLessons.filter(id => id.startsWith(`mod${mod.number}-`)).length;
          const percent = Math.round((completedInMod / 25) * 100);

          return (
            <div
              key={mod.number}
              onClick={() => {
                onSelectModule(mod.number);
                onNavigate('lessons');
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-sm">
                    {mod.number < 10 ? `0${mod.number}` : mod.number}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    {completedInMod}/25 Done
                  </span>
                </div>

                <div className="text-[10px] font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
                  {mod.category} · {mod.levelRange}
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                  {mod.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">{percent}% Complete</span>
                  <span className="font-semibold text-indigo-600 dark:text-cyan-400 flex items-center gap-1">
                    <span>Enter Lessons</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
