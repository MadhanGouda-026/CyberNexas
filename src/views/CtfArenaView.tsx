import React, { useState } from 'react';
import { Award, Flag, HelpCircle, CheckCircle2, ShieldAlert, Sparkles, Filter, Check } from 'lucide-react';
import { CTF_CHALLENGES } from '../data/ctfData';
import { CTFChallenge } from '../types';
import { useProgress } from '../context/ProgressContext';

export const CtfArenaView: React.FC = () => {
  const { progress, completeCtf } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeChallenge, setActiveChallenge] = useState<CTFChallenge | null>(null);
  const [flagInput, setFlagInput] = useState<string>('');
  const [flagStatus, setFlagStatus] = useState<'idle' | 'success' | 'incorrect'>('idle');
  const [revealedHints, setRevealedHints] = useState<Record<string, number[]>>({});

  const categories = [
    'All',
    'General Knowledge',
    'Web Security',
    'Cryptography',
    'Linux',
    'Digital Forensics',
    'Networking'
  ];

  const filteredChallenges = selectedCategory === 'All'
    ? CTF_CHALLENGES
    : CTF_CHALLENGES.filter(c => c.category === selectedCategory);

  const totalPoints = CTF_CHALLENGES.reduce((acc, c) => acc + c.points, 0);
  const userCtfPoints = CTF_CHALLENGES.filter(c => progress.completedCtfs.includes(c.id)).reduce((acc, c) => acc + c.points, 0);

  const handleOpenChallenge = (challenge: CTFChallenge) => {
    setActiveChallenge(challenge);
    setFlagInput('');
    setFlagStatus('idle');
  };

  const handleSubmitFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChallenge) return;

    if (flagInput.trim() === activeChallenge.flag) {
      setFlagStatus('success');
      completeCtf(activeChallenge.id, activeChallenge.points);
    } else {
      setFlagStatus('incorrect');
    }
  };

  const toggleHint = (challengeId: string, hintIdx: number) => {
    setRevealedHints(prev => {
      const current = prev[challengeId] || [];
      const updated = current.includes(hintIdx)
        ? current.filter(i => i !== hintIdx)
        : [...current, hintIdx];
      return { ...prev, [challengeId]: updated };
    });
  };

  return (
    <div className="space-y-8">
      {/* CTF Arena Hero */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs tracking-wider uppercase">
              <Award className="w-4 h-4" />
              <span>Capture The Flag Learning Arena</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              CTF Arena & Security Challenges
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Test your practical exploitation, forensic analysis, protocol mechanics, and cryptographic decryption skills. Capture flags formatted as <code className="text-indigo-600 dark:text-cyan-400 font-mono">CN&#123;...&#125;</code> to gain points.
            </p>
          </div>

          {/* Points score pill */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 text-center shrink-0">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your CTF Score</div>
            <div className="text-3xl font-black text-amber-500 tabular-nums mt-0.5">
              {userCtfPoints} <span className="text-xs text-slate-400 font-normal">/ {totalPoints} PTS</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {progress.completedCtfs.length} of {CTF_CHALLENGES.length} Flags Captured
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map(challenge => {
          const isSolved = progress.completedCtfs.includes(challenge.id);
          return (
            <div
              key={challenge.id}
              onClick={() => handleOpenChallenge(challenge)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                isSolved
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
                    {challenge.category}
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/40 px-2 py-0.5 rounded-md font-mono">
                    {challenge.points} PTS
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {challenge.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">{challenge.difficulty}</span>
                {isSolved ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Captured</span>
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                    <span>Inspect</span>
                    <Flag className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Challenge Modal Inspector */}
      {activeChallenge && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
                  <span>{activeChallenge.category}</span>
                  <span>·</span>
                  <span className="text-amber-500">{activeChallenge.points} Points</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {activeChallenge.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveChallenge(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm font-bold p-1"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {activeChallenge.description}
            </p>

            {/* Flag submission */}
            <form onSubmit={handleSubmitFlag} className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Flag Submission
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="CN{...}"
                  value={flagInput}
                  onChange={e => setFlagInput(e.target.value)}
                  className="flex-1 text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-xs transition-all"
                >
                  Submit Flag
                </button>
              </div>
            </form>

            {flagStatus === 'success' && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Correct Flag Captured! +{activeChallenge.points} PTS awarded to your score.</span>
              </div>
            )}

            {flagStatus === 'incorrect' && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Incorrect flag. Review the challenge prompt or unlock a hint.</span>
              </div>
            )}

            {/* Hints */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hints ({activeChallenge.hints.length})
              </div>
              <div className="space-y-1.5">
                {activeChallenge.hints.map((hint, idx) => {
                  const isRevealed = (revealedHints[activeChallenge.id] || []).includes(idx);
                  return (
                    <div key={idx} className="text-xs">
                      {isRevealed ? (
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
                          <span className="font-bold">Hint #{idx + 1}: </span>
                          <span>{hint}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleHint(activeChallenge.id, idx)}
                          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Unlock Hint #{idx + 1}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation writeup if solved */}
            {progress.completedCtfs.includes(activeChallenge.id) && (
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                <span className="font-bold text-indigo-900 dark:text-indigo-300 text-sm block">
                  Author Writeup & Educational Takeaway
                </span>
                <p className="leading-relaxed">{activeChallenge.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
