import React from 'react';
import { Award, Lock, CheckCircle2, Zap, BookOpen, Terminal, Flag, ShieldAlert, Activity, Binary, Box, GraduationCap } from 'lucide-react';
import { ALL_ACHIEVEMENTS } from '../data/achievementsData';
import { useProgress } from '../context/ProgressContext';

export const AchievementsView: React.FC = () => {
  const { progress } = useProgress();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return BookOpen;
      case 'Terminal': return Terminal;
      case 'Flag': return Flag;
      case 'ShieldAlert': return ShieldAlert;
      case 'Activity': return Activity;
      case 'Binary': return Binary;
      case 'Box': return Box;
      case 'GraduationCap': return GraduationCap;
      case 'Zap': return Zap;
      default: return Award;
    }
  };

  const unlockedCount = progress.unlockedAchievements.length;
  const totalCount = ALL_ACHIEVEMENTS.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Award className="w-4 h-4" />
              <span>Gamification & Accolades</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Badges & Cybersecurity Achievements
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Earn badges by completing lessons, solving terminal labs, capturing CTF flags, and triaging SIEM events.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-4 rounded-2xl text-center shrink-0">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">Badges Unlocked</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
              {unlockedCount} / {totalCount}
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_ACHIEVEMENTS.map(ach => {
          const isUnlocked = progress.unlockedAchievements.includes(ach.id);
          const Icon = getIcon(ach.icon);

          return (
            <div
              key={ach.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700/60 shadow-md ring-1 ring-amber-400/20'
                  : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/20'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">
                    +{ach.xp} XP
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {ach.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {ach.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                {isUnlocked ? (
                  <span className="text-emerald-500 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
