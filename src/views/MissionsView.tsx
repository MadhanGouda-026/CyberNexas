import React, { useState } from 'react';
import { Shield, FileText, CheckCircle2, AlertTriangle, ArrowRight, Award, Lock, Sparkles } from 'lucide-react';
import { MISSIONS } from '../data/missionsData';
import { Mission } from '../types';
import { useProgress } from '../context/ProgressContext';

export const MissionsView: React.FC = () => {
  const { progress, completeMission } = useProgress();
  const [selectedMissionId, setSelectedMissionId] = useState<string>(MISSIONS[0].id);
  const [taskInputs, setTaskInputs] = useState<Record<string, string>>({});
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [taskErrors, setTaskErrors] = useState<Record<string, boolean>>({});

  const activeMission: Mission = MISSIONS.find(m => m.id === selectedMissionId) || MISSIONS[0];
  const isMissionDone = progress.completedMissions.includes(activeMission.id);

  const handleVerifyTask = (taskId: string, expected: string, xpReward: number) => {
    const input = (taskInputs[taskId] || '').trim().toLowerCase();
    if (input === expected.toLowerCase()) {
      setTaskErrors(prev => ({ ...prev, [taskId]: false }));
      if (!completedTaskIds.includes(taskId)) {
        const nextDone = [...completedTaskIds, taskId];
        setCompletedTaskIds(nextDone);

        // If all tasks for active mission are done, complete mission!
        if (nextDone.length >= activeMission.tasks.length && !isMissionDone) {
          completeMission(activeMission.id, activeMission.xpRewards);
        }
      }
    } else {
      setTaskErrors(prev => ({ ...prev, [taskId]: true }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Shield className="w-4 h-4" />
              <span>Cybersecurity Story Mode & Realistic Scenarios</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Incident Response Missions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Step into the shoes of a lead incident commander. Dissect realistic attacker footprints, review raw forensic evidence, solve forensic investigation tasks, and remediate the incident.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Missions Completed: {progress.completedMissions.length} / {MISSIONS.length}</span>
          </div>
        </div>
      </div>

      {/* Mission Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MISSIONS.map(m => {
          const isSelected = m.id === activeMission.id;
          const isDone = progress.completedMissions.includes(m.id);

          return (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMissionId(m.id);
                setTaskErrors({});
              }}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-cyan-400">
                    {m.codename}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.threatLevel === 'Critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                    m.threatLevel === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {m.threatLevel} Threat
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {m.title}
                </h3>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">{m.tier} · +{m.xpRewards} XP</span>
                {isDone ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Solved</span>
                  </span>
                ) : (
                  <span className="text-indigo-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
                    <span>Investigate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Mission Workspace */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        {/* Story Briefing */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 font-mono text-xs font-bold text-indigo-700 dark:text-cyan-300">
              MISSION BRIEFING: {activeMission.codename}
            </span>
            <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>+{activeMission.xpRewards} XP Bounty</span>
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {activeMission.title}
          </h2>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            <strong>Initial Situation: </strong>
            {activeMission.story}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {activeMission.scenario}
          </p>
        </div>

        {/* Evidence Vault */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Forensic Evidence Vault ({activeMission.evidence.length} Exhibits)</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {activeMission.evidence.map((ev, i) => (
              <div
                key={i}
                className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-2 font-mono text-xs overflow-hidden"
              >
                <div className="flex items-center justify-between text-cyan-400 pb-2 border-b border-slate-800 font-bold">
                  <span>EXHIBIT #{i + 1}: {ev.label}</span>
                  <span className="text-[10px] text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded">
                    TYPE: {ev.type}
                  </span>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed text-[11px] sm:text-xs text-slate-300 overflow-x-auto select-all">
                  {ev.details}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Forensic Tasks & Investigation Verification */}
        <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Investigation Tasks & Verification</span>
            <span className="text-xs font-normal text-slate-400">
              ({completedTaskIds.length} of {activeMission.tasks.length} Resolved)
            </span>
          </h3>

          <div className="space-y-4">
            {activeMission.tasks.map((task, tIdx) => {
              const isTaskDone = completedTaskIds.includes(task.id);
              const hasError = taskErrors[task.id];

              return (
                <div
                  key={task.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isTaskDone
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Task {tIdx + 1}: {task.description}
                    </span>
                    <span className="text-xs font-bold text-amber-500 font-mono">
                      +{task.xp} XP
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      disabled={isTaskDone}
                      placeholder="Type evidence finding here..."
                      value={taskInputs[task.id] || ''}
                      onChange={e =>
                        setTaskInputs(prev => ({ ...prev, [task.id]: e.target.value }))
                      }
                      className="w-full sm:flex-1 text-xs font-mono p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white disabled:opacity-60"
                    />
                    <button
                      disabled={isTaskDone}
                      onClick={() => handleVerifyTask(task.id, task.expectedInput, task.xp)}
                      className={`w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                        isTaskDone
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isTaskDone ? 'Resolved ✓' : 'Verify Finding'}
                    </button>
                  </div>

                  {hasError && (
                    <div className="text-xs text-rose-500 font-medium mt-2">
                      Finding does not match evidence. Inspect raw logs closely!
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Full Mission Debrief if completed */}
          {isMissionDone && (
            <div className="p-6 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-indigo-900 dark:text-cyan-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Mission Accomplished: {activeMission.codename} Complete!</span>
              </div>
              <p className="leading-relaxed">{activeMission.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
