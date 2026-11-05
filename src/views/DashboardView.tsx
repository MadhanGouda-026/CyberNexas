import React from 'react';
import { ShieldCheck, Zap, Award, BookOpen, Terminal, ArrowRight, CheckCircle2, Clock, Flame } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { ALL_LESSONS } from '../data/curriculum';
import { LABS } from '../data/labsData';
import { CTF_CHALLENGES } from '../data/ctfData';

export const DashboardView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { progress, levelInfo } = useProgress();

  // Find next uncompleted lesson to recommend
  const nextLesson = ALL_LESSONS.find(l => !progress.completedLessons.includes(l.id)) || ALL_LESSONS[0];

  return (
    <div className="space-y-8">
      {/* Top Banner with XP, Streak & Level */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>CyberNexus Student Command Center</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight">
              Welcome back, {progress.userProfile.username}
            </h1>

            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
              Current Rank: <strong className="text-white font-bold">{levelInfo.rankTitle} (Level {levelInfo.level})</strong>. You have completed {progress.completedLessons.length} lessons and solved {progress.completedLabs.length} cyber labs.
            </p>

            {/* Level progress bar */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex items-center justify-between text-xs text-indigo-200 font-mono">
                <span>{levelInfo.currentXp} XP</span>
                <span>{levelInfo.nextLevelXp} XP (Next Rank)</span>
              </div>
              <div className="w-full bg-indigo-950/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-row md:flex-col justify-around md:justify-center items-center md:items-end gap-4 text-right">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
              <div className="w-10 h-10 rounded-xl bg-amber-500/80 flex items-center justify-center text-white">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div className="text-left">
                <div className="text-xl font-black tabular-nums">{progress.streakDays} Days</div>
                <div className="text-[11px] text-indigo-200 font-semibold">Active Streak</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/80 flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="text-left">
                <div className="text-xl font-black tabular-nums">{progress.xp} XP</div>
                <div className="text-[11px] text-indigo-200 font-semibold">Total Points</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Resume & Recommended Next Step */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Next Lesson Box */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Recommended Next Lesson</span>
            <span className="font-mono text-indigo-600 dark:text-cyan-400">Module {nextLesson.moduleNumber}</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Lesson {nextLesson.lessonNumber}: {nextLesson.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {nextLesson.summary}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{nextLesson.estimatedMinutes} min read</span>
            </span>

            <button
              onClick={() => onNavigate('lessons')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all"
            >
              <span>Resume Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Quick Training Access
          </div>

          <button
            onClick={() => onNavigate('labs')}
            className="w-full text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Hands-On Cyber Labs</h3>
                <span className="text-xs text-slate-400">Launch terminal target simulator</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" />
          </button>

          <button
            onClick={() => onNavigate('ctf')}
            className="w-full text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">CTF Arena Challenges</h3>
                <span className="text-xs text-slate-400">Submit flags and climb leaderboard</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
          </button>

          <button
            onClick={() => onNavigate('siem')}
            className="w-full text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Enterprise SIEM Console</h3>
                <span className="text-xs text-slate-400">Triage live security events</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};
