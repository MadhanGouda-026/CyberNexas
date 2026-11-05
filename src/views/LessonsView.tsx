import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  Search,
  Clock,
  Award,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Terminal
} from 'lucide-react';
import { MODULES } from '../data/modulesData';
import { ALL_LESSONS } from '../data/curriculum';
import { Lesson } from '../types';
import { useProgress } from '../context/ProgressContext';
import { OsiModelInteractive } from '../components/interactive/OsiModelInteractive';
import { TcpHandshakeInteractive } from '../components/interactive/TcpHandshakeInteractive';
import { DnsResolverInteractive } from '../components/interactive/DnsResolverInteractive';
import { CryptoPlaygroundInteractive } from '../components/interactive/CryptoPlaygroundInteractive';
import { FirewallSimulator } from '../components/interactive/FirewallSimulator';
import { IncidentResponseWheel } from '../components/interactive/IncidentResponseWheel';
import { InteractiveTerminal } from '../components/Terminal/InteractiveTerminal';

interface LessonsViewProps {
  initialLessonId?: string;
  onNavigate?: (view: string) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({ initialLessonId = 'mod1-les1', onNavigate }) => {
  const { progress, completeLesson, toggleBookmark } = useProgress();

  const [activeModuleNum, setActiveModuleNum] = useState<number>(1);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(initialLessonId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Quiz state for current lesson
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Practical verification answer
  const [practicalInput, setPracticalInput] = useState<string>('');
  const [practicalVerified, setPracticalVerified] = useState<boolean | null>(null);

  // Active lesson
  const activeLesson: Lesson = useMemo(() => {
    const found = ALL_LESSONS.find(l => l.id === selectedLessonId);
    if (found) return found;
    return ALL_LESSONS[0];
  }, [selectedLessonId]);

  // Lessons in active module
  const moduleLessons = useMemo(() => {
    return ALL_LESSONS.filter(l => l.moduleNumber === activeModuleNum);
  }, [activeModuleNum]);

  // Filtered lessons across active module or search
  const filteredLessons = useMemo(() => {
    let list = moduleLessons;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = ALL_LESSONS.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q)
      );
    }
    if (selectedDifficulty !== 'All') {
      list = list.filter(l => l.difficulty === selectedDifficulty);
    }
    return list;
  }, [moduleLessons, searchQuery, selectedDifficulty]);

  const activeModuleInfo = MODULES.find(m => m.number === activeModuleNum) || MODULES[0];

  const isCompleted = progress.completedLessons.includes(activeLesson.id);
  const isBookmarked = progress.bookmarkedLessons.includes(activeLesson.id);

  // Switch to next or previous lesson
  const currentIndexInAll = ALL_LESSONS.findIndex(l => l.id === activeLesson.id);
  const prevLesson = currentIndexInAll > 0 ? ALL_LESSONS[currentIndexInAll - 1] : null;
  const nextLesson = currentIndexInAll < ALL_LESSONS.length - 1 ? ALL_LESSONS[currentIndexInAll + 1] : null;

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLessonId(lesson.id);
    setActiveModuleNum(lesson.moduleNumber);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setPracticalInput('');
    setPracticalVerified(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerifyPractical = () => {
    if (!activeLesson.practicalExercise.verificationAnswer) return;
    const isCorrect = practicalInput.trim().toLowerCase() === activeLesson.practicalExercise.verificationAnswer.toLowerCase();
    setPracticalVerified(isCorrect);
    if (isCorrect && !isCompleted) {
      completeLesson(activeLesson.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Selector & Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Full Curriculum Explorer · 375 Detailed Lessons</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Module {activeModuleInfo.number}: {activeModuleInfo.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {activeModuleInfo.tagline}
            </p>
          </div>

          {/* Module Selector dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Select Module:
            </label>
            <select
              value={activeModuleNum}
              onChange={e => {
                const modNum = parseInt(e.target.value, 10);
                setActiveModuleNum(modNum);
                const firstLessonInMod = ALL_LESSONS.find(l => l.moduleNumber === modNum);
                if (firstLessonInMod) handleSelectLesson(firstLessonInMod);
              }}
              className="text-xs font-semibold p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {MODULES.map(m => (
                <option key={m.number} value={m.number}>
                  Module {m.number}: {m.title} (25 Lessons)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-4">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search across all 375 lessons (e.g. DNS, SQLi, Buffer, AES, Firewall)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Difficulty Tiers</option>
              <option value="Beginner">Beginner (1-5)</option>
              <option value="Elementary">Elementary (6-10)</option>
              <option value="Intermediate">Intermediate (11-17)</option>
              <option value="Upper Intermediate">Upper Intermediate (18-22)</option>
              <option value="Advanced">Advanced (23-25)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Lesson Directory (25 Lessons) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm lg:sticky lg:top-20 max-h-[85vh] overflow-y-auto space-y-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 px-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {searchQuery ? `Search Results (${filteredLessons.length})` : `Lessons in Module ${activeModuleNum} (25)`}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {progress.completedLessons.filter(id => id.startsWith(`mod${activeModuleNum}-`)).length} / 25 Done
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {filteredLessons.map(lesson => {
              const isCurrent = lesson.id === activeLesson.id;
              const isDone = progress.completedLessons.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between group ${
                    isCurrent
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-white ring-1 ring-indigo-500/30'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isDone ? '✓' : lesson.lessonNumber}
                    </span>
                    <span className="text-xs font-semibold truncate leading-tight">
                      {lesson.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {lesson.difficulty.substring(0, 3)}
                  </span>
                </button>
              );
            })}

            {filteredLessons.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                No lessons matched your search query.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Full Textbook Lesson Viewer */}
        <div className="lg:col-span-8 space-y-8">
          {/* Lesson Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-400">
                <span>Module {activeLesson.moduleNumber}</span>
                <span>/</span>
                <span className="text-indigo-600 dark:text-cyan-400 font-bold">Lesson {activeLesson.lessonNumber} of 25</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeLesson.estimatedMinutes} min read</span>
                </span>
                <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-cyan-300 rounded-lg text-xs font-semibold">
                  {activeLesson.difficulty}
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {activeLesson.title}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {activeLesson.introduction}
            </p>

            {/* Action Bar (Mark Complete, Bookmark, Nav Buttons) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => completeLesson(activeLesson.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompleted ? 'Completed (+40 XP)' : 'Mark as Complete'}</span>
                </button>

                <button
                  onClick={() => toggleBookmark(activeLesson.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isBookmarked
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-300 dark:border-amber-700'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Bookmark Lesson"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {prevLesson && (
                  <button
                    onClick={() => handleSelectLesson(prevLesson)}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>
                )}
                {nextLesson && (
                  <button
                    onClick={() => handleSelectLesson(nextLesson)}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Learning Objectives Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Core Learning Objectives</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {activeLesson.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-cyan-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    {i + 1}
                  </span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deep Detailed Technical Explanation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              In-Depth Technical Analysis
            </h3>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-4 font-sans">
              {activeLesson.detailedExplanation}
            </div>

            {/* Key Concepts Terminology */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Key Technical Concepts & Definitions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeLesson.keyConcepts.map((kc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs"
                  >
                    <span className="font-bold text-indigo-600 dark:text-cyan-400 block mb-1">
                      {kc.term}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {kc.definition}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Embedded Interactive Diagram Hook */}
          {activeLesson.interactiveTool && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Play className="w-4 h-4" />
                <span>Interactive Visual Simulation Lab</span>
              </div>
              {activeLesson.interactiveTool === 'osi' && <OsiModelInteractive />}
              {activeLesson.interactiveTool === 'tcp' && <TcpHandshakeInteractive />}
              {activeLesson.interactiveTool === 'dns' && <DnsResolverInteractive />}
              {activeLesson.interactiveTool === 'crypto' && <CryptoPlaygroundInteractive />}
              {activeLesson.interactiveTool === 'firewall' && <FirewallSimulator />}
              {activeLesson.interactiveTool === 'ir' && <IncidentResponseWheel />}
              {activeLesson.interactiveTool === 'terminal' && <InteractiveTerminal />}
            </div>
          )}

          {/* Real-World Case Study */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Real-World Industry Case Study
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeLesson.realWorldExample}
            </p>
          </div>

          {/* Common Mistakes & Best Practices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-5 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Common Pitfalls</span>
              </div>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                {activeLesson.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-5 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Defensive Best Practices</span>
              </div>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                {activeLesson.bestPractices.map((bp, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Knowledge Check Quiz */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Knowledge-Check Assessment
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {activeLesson.quiz.length} Questions
              </span>
            </div>

            <div className="space-y-6">
              {activeLesson.quiz.map((q, qIdx) => {
                const selectedOption = quizAnswers[q.id];
                return (
                  <div key={q.id} className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {qIdx + 1}. {q.question}
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = selectedOption === oIdx;
                        const isCorrect = q.correctIndex === oIdx;
                        let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300';
                        if (quizSubmitted) {
                          if (isCorrect) btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                          else if (isChosen) btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200';
                        } else if (isChosen) {
                          btnStyle = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-semibold';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setQuizAnswers(prev => ({ ...prev, [q.id]: oIdx }));
                              }
                            }}
                            className={`w-full text-left p-3 text-xs rounded-xl border transition-all ${btnStyle}`}
                          >
                            <span className="font-mono mr-2 font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="text-xs p-3 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200">
                        <span className="font-bold">Explanation: </span>
                        <span>{q.explanation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setQuizSubmitted(true)}
                disabled={quizSubmitted || Object.keys(quizAnswers).length < activeLesson.quiz.length}
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-xl transition-all"
              >
                Submit Answers
              </button>

              {quizSubmitted && (
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
              )}
            </div>
          </div>

          {/* Hands-On Practical Exercise */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>Practical Exercise Lab</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {activeLesson.practicalExercise.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {activeLesson.practicalExercise.scenario}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Execution Steps:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
                {activeLesson.practicalExercise.steps.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ol>
            </div>

            {/* Verification Form */}
            {activeLesson.practicalExercise.verificationQuestion && (
              <div className="pt-2 space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Verification Question: {activeLesson.practicalExercise.verificationQuestion}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={practicalInput}
                    onChange={e => setPracticalInput(e.target.value)}
                    placeholder="Enter verification answer..."
                    className="flex-1 text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    onClick={handleVerifyPractical}
                    className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all"
                  >
                    Verify
                  </button>
                </div>

                {practicalVerified === true && (
                  <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Correct! Lesson requirement fulfilled. (+40 XP awarded)</span>
                  </div>
                )}
                {practicalVerified === false && (
                  <div className="text-xs font-bold text-rose-500 pt-1">
                    Incorrect answer. Hint: {activeLesson.practicalExercise.hint}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
