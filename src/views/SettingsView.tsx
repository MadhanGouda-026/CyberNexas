import React, { useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Laptop, Download, Upload, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';

export const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { exportProgressJson, importProgressJson, resetProgress } = useProgress();

  const [importText, setImportText] = useState<string>('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resetConfirm, setResetConfirm] = useState<boolean>(false);

  const handleExportJson = () => {
    const jsonStr = exportProgressJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybernexus-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    if (!importText.trim()) return;
    const success = importProgressJson(importText);
    setImportStatus(success ? 'success' : 'error');
    if (success) {
      setTimeout(() => setImportStatus('idle'), 3000);
      setImportText('');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>System & Preferences</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Platform Settings & Data Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Manage visual theme preferences, customize system controls, and export or restore your local learning progress.
        </p>
      </div>

      {/* Theme Preference */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Interface Theme Mode
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            By default, CyberNexus uses a vibrant, high-contrast light theme with electric blue and cyan accents. You can toggle dark or system preferences anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
              theme === 'light'
                ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-white ring-1 ring-indigo-500/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <div className="font-bold text-xs">Light Mode (Default)</div>
              <div className="text-[10px] text-slate-400">Vibrant & crisp</div>
            </div>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
              theme === 'dark'
                ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-white ring-1 ring-indigo-500/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Moon className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="font-bold text-xs">Dark Mode</div>
              <div className="text-[10px] text-slate-400">High contrast night</div>
            </div>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
              theme === 'system'
                ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-white ring-1 ring-indigo-500/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Laptop className="w-5 h-5 text-indigo-500 shrink-0" />
            <div>
              <div className="font-bold text-xs">System Synchronized</div>
              <div className="text-[10px] text-slate-400">Follows OS setting</div>
            </div>
          </button>
        </div>
      </div>

      {/* Progress Backup & Restore */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Progress Backup & Portability (Local-First)
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            All your completed modules, streak days, XP, and CTF flags are saved locally in your browser. You can back up your progress to a JSON file or transfer it to another computer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-all"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>Export Progress (.JSON)</span>
          </button>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Import Progress JSON Backup:
          </label>
          <textarea
            rows={3}
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder="Paste your exported progress JSON here..."
            className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          />

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleImportJson}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import & Restore</span>
            </button>

            {importStatus === 'success' && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Progress successfully restored!</span>
              </span>
            )}
            {importStatus === 'error' && (
              <span className="text-xs font-bold text-rose-500">
                Invalid JSON format. Check file content.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 sm:p-8 space-y-4">
        <div>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
            Danger Zone
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Reset Learning Progress
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Permanently clear all completed lessons, CTF solved flags, lab points, and streak counts back to clean state.
          </p>
        </div>

        {resetConfirm ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetProgress();
                setResetConfirm(false);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all"
            >
              Yes, Clear Everything
            </button>
            <button
              onClick={() => setResetConfirm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setResetConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-700 dark:text-rose-400 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-xl hover:bg-rose-50 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Local Progress</span>
          </button>
        )}
      </div>
    </div>
  );
};
