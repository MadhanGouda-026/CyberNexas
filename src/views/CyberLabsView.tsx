import React, { useState, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  CheckCircle2,
  Award,
  Flag,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Play,
  Square,
  Clock,
  Cpu,
  Layers,
  AlertTriangle,
  RefreshCw,
  Server,
  Lock,
  Box
} from 'lucide-react';
import { LABS } from '../data/labsData';
import { Lab, DockerEngineStatus, DockerSessionInfo } from '../types';
import { useProgress } from '../context/ProgressContext';
import { InteractiveTerminal } from '../components/Terminal/InteractiveTerminal';

export const CyberLabsView: React.FC = () => {
  const { progress, completeLab, unlockAchievement } = useProgress();
  const [selectedLabId, setSelectedLabId] = useState<string>(LABS[0].id);
  const [flagInput, setFlagInput] = useState<string>('');
  const [flagStatus, setFlagStatus] = useState<'idle' | 'success' | 'incorrect'>('idle');
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Docker State Management
  const [dockerStatus, setDockerStatus] = useState<DockerEngineStatus | null>(null);
  const [isCheckingDocker, setIsCheckingDocker] = useState<boolean>(false);
  const [activeSession, setActiveSession] = useState<DockerSessionInfo | null>(null);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isStopping, setIsStopping] = useState<boolean>(false);
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  const activeLab: Lab = LABS.find(l => l.id === selectedLabId) || LABS[0];
  const isCompleted = progress.completedLabs.includes(activeLab.id);

  const categories = ['All', 'Linux', 'Python', 'Networking', 'Web Security', 'Ethical Hacking', 'Cryptography', 'Digital Forensics'];

  const filteredLabs = categoryFilter === 'All'
    ? LABS
    : LABS.filter(l => l.category === categoryFilter);

  // Poll / Query Docker Engine Status
  const refreshDockerStatus = async () => {
    setIsCheckingDocker(true);
    try {
      const res = await fetch('/api/docker/status');
      const data = await res.json();
      setDockerStatus(data);
    } catch {
      setDockerStatus({
        available: false,
        error: 'Backend Docker service is unreachable or server is offline.'
      });
    } finally {
      setIsCheckingDocker(false);
    }
  };

  // Sync Docker Status & Session on Mount & Lab Change
  useEffect(() => {
    refreshDockerStatus();

    fetch(`/api/docker/session/${selectedLabId}`)
      .then(res => res.json())
      .then(data => {
        if (data.active) {
          setActiveSession(data);
          setTimerSeconds(data.remainingSeconds || 900);
        } else {
          setActiveSession(null);
          setTimerSeconds(0);
        }
      })
      .catch(() => {
        setActiveSession(null);
      });
  }, [selectedLabId]);

  // Session countdown timer
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'running' || timerSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleStopLab();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, timerSeconds]);

  // Launch Docker Container
  const handleLaunchLab = async () => {
    setLaunchError(null);
    setIsStarting(true);
    try {
      const res = await fetch('/api/docker/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId: activeLab.id })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to start Docker container. Ensure Docker Desktop is running.');
      }

      setActiveSession(data.session);
      setTimerSeconds(data.session.remainingSeconds || 900);
      unlockAchievement('docker-lab-operator');
      refreshDockerStatus();
    } catch (err: any) {
      setLaunchError(err.message || 'Docker Engine is unavailable. Please verify Docker Desktop is started.');
    } finally {
      setIsStarting(false);
    }
  };

  // Stop Docker Container
  const handleStopLab = async () => {
    setIsStopping(true);
    try {
      await fetch('/api/docker/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId: activeLab.id })
      });
      setActiveSession(null);
      setTimerSeconds(0);
      refreshDockerStatus();
    } catch (err: any) {
      console.error('Failed to stop lab:', err);
    } finally {
      setIsStopping(false);
    }
  };

  // Execute terminal command inside real Docker container
  const handleDockerExec = async (cmd: string): Promise<{ stdout: string; stderr: string; exitCode: number }> => {
    if (!activeSession || activeSession.status !== 'running') {
      throw new Error('Docker container is not running. Click "Launch Lab" first.');
    }

    const res = await fetch('/api/docker/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        labId: activeLab.id,
        command: cmd
      })
    });

    const data = await res.json();
    if (!res.ok && !data.stdout && !data.stderr) {
      throw new Error(data.error || 'Failed to execute command inside Docker container.');
    }

    return {
      stdout: data.stdout || '',
      stderr: data.stderr || '',
      exitCode: data.exitCode || 0
    };
  };

  const handleSubmitFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (flagInput.trim() === activeLab.flag) {
      setFlagStatus('success');
      completeLab(activeLab.id, activeLab.xpReward);
    } else {
      setFlagStatus('incorrect');
    }
  };

  const toggleHint = (idx: number) => {
    setRevealedHints(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isContainerRunning = activeSession && activeSession.status === 'running';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Box className="w-4 h-4" />
              <span>Real Docker Practical Labs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Containerized Cyber Labs & Security Sandboxes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Launch and control isolated Docker containers directly from your browser. Practice Linux privilege escalation, Python security flaws, network diagnostics, and web injection with enforced CPU and memory limits.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  categoryFilter === cat
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Global Docker Engine Status Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            dockerStatus?.available
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
          }`}>
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Docker Engine Status:</span>
              {dockerStatus === null ? (
                <span className="text-xs text-slate-500">Probing Docker socket...</span>
              ) : dockerStatus.available ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {dockerStatus.version || 'Connected'} · {dockerStatus.os || 'Host OS'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Docker Unavailable (Daemon Not Detected)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {dockerStatus?.available
                ? `Ready to spin up containers with 0.5 vCPU and 256MB RAM limits.`
                : `To run live container labs locally, ensure Docker Desktop is started.`}
            </p>
          </div>
        </div>

        <button
          onClick={refreshDockerStatus}
          disabled={isCheckingDocker}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDocker ? 'animate-spin' : ''}`} />
          <span>Check Engine</span>
        </button>
      </div>

      {/* Main Lab Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lab Selector Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Available Labs ({filteredLabs.length})
          </div>

          <div className="space-y-2.5">
            {filteredLabs.map(lab => {
              const isSelected = lab.id === activeLab.id;
              const isDone = progress.completedLabs.includes(lab.id);

              return (
                <button
                  key={lab.id}
                  onClick={() => {
                    setSelectedLabId(lab.id);
                    setFlagInput('');
                    setFlagStatus('idle');
                    setRevealedHints([]);
                    setLaunchError(null);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
                        {lab.category}
                      </span>
                      {lab.dockerSupported && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                          DOCKER
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>+{lab.xpReward} XP</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                    {lab.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>{lab.difficulty} · {lab.durationMinutes}m</span>
                    {isDone ? (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Solved</span>
                      </span>
                    ) : (
                      <span className="text-indigo-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
                        <span>Select</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Lab Sandbox Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {/* Lab Header & Scenario */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-cyan-300 font-semibold">
                  {activeLab.category} · {activeLab.difficulty}
                </span>
                {activeLab.dockerSupported && (
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-mono font-semibold flex items-center gap-1">
                    <Box className="w-3 h-3" />
                    <span>Image: {activeLab.dockerImage || 'alpine:3.19'}</span>
                  </span>
                )}
              </div>
              <span className="font-mono text-slate-400">
                Reward: <strong className="text-amber-500 font-bold">+{activeLab.xpReward} XP</strong>
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {activeLab.title}
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeLab.scenario}
            </p>

            {/* Container Sandbox Isolation Specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                  <span>CPU Limit</span>
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                  0.5 vCPU Core
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                  <Layers className="w-3.5 h-3.5 text-cyan-500" />
                  <span>RAM Limit</span>
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                  256 MB Max
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Isolation</span>
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                  CapDrop ALL
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Auto Cleanup</span>
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                  15 Min Expiry
                </div>
              </div>
            </div>

            {/* Instructions box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Lab Instructions & Commands:
              </span>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 font-mono">
                {activeLab.instructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Docker Container Control Deck */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Status and Timer */}
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl border flex items-center justify-center ${
                  isContainerRunning
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-600'
                    : isStarting
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-600'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}>
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Container State:</span>
                    {isStarting ? (
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Starting Container...</span>
                      </span>
                    ) : isStopping ? (
                      <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Stopping Container...</span>
                      </span>
                    ) : isContainerRunning ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>RUNNING ({activeSession.containerName})</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">
                        OFFLINE / STOPPED
                      </span>
                    )}
                  </div>

                  {/* Session Timer */}
                  {isContainerRunning && (
                    <div className="flex items-center gap-2 mt-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Session Remaining: {formatTimer(timerSeconds)}</span>
                      <span className="text-slate-400 font-normal">· Auto-cleanup on zero</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Launch Lab & Stop Lab */}
              <div className="flex items-center gap-2.5">
                {!isContainerRunning ? (
                  <button
                    onClick={handleLaunchLab}
                    disabled={isStarting}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isStarting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Launching...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Launch Lab</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleStopLab}
                    disabled={isStopping}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isStopping ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Stopping...</span>
                      </>
                    ) : (
                      <>
                        <Square className="w-4 h-4 fill-white" />
                        <span>Stop Lab</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Error Message when Docker is Unavailable */}
            {launchError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Docker Engine Unavailable</span>
                </div>
                <p className="leading-relaxed">
                  {launchError}
                </p>
                <div className="pt-1 text-[11px] text-rose-700 dark:text-rose-300/80 font-mono">
                  Tip: Start Docker Desktop on Windows/macOS, or run <code className="bg-rose-100 dark:bg-rose-900/60 px-1 py-0.5 rounded">sudo systemctl start docker</code> on Linux, then click Launch Lab again.
                </div>
              </div>
            )}
          </div>

          {/* Real Browser-Based Terminal connected to Docker container */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              <span className="flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span>Docker Sandbox Terminal</span>
              </span>
              {isContainerRunning ? (
                <span className="font-mono text-emerald-500 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  CONNECTED TO DOCKER CONTAINER ({activeSession.hostname})
                </span>
              ) : (
                <span className="font-mono text-slate-400">
                  OFFLINE (CLICK &quot;LAUNCH LAB&quot; TO ACTIVATE)
                </span>
              )}
            </div>

            {isContainerRunning ? (
              <InteractiveTerminal
                key={`docker-${activeSession.sessionId}`}
                hostname={activeSession.hostname}
                username={activeSession.username}
                isConnectedToContainer={true}
                containerName={activeSession.containerName}
                onExecuteCommand={handleDockerExec}
                initialBanner={`=== CyberNexus Docker Sandbox Container Active ===\nContainer ID: ${activeSession.containerId} | Image: ${activeSession.image}\nSecurity: ${activeSession.isolation} | Limits: ${activeSession.cpuLimit}, ${activeSession.memoryLimit}\nSession Timer: 15:00 minutes\nType standard Linux commands (ls, cat, whoami, id, ps, python3, etc.) directly into this container:\n`}
                heightClass="h-96"
              />
            ) : (
              <div className="bg-slate-950 text-slate-400 rounded-xl border border-slate-800 p-8 text-center flex flex-col items-center justify-center space-y-3 font-mono h-96">
                <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-500">
                  <Box className="w-8 h-8" />
                </div>
                <div className="text-sm font-bold text-slate-200">
                  Container Session Not Running
                </div>
                <p className="text-xs text-slate-400 max-w-md text-center leading-relaxed font-sans">
                  Click the <strong className="text-indigo-400">Launch Lab</strong> button above to start an isolated, resource-constrained Docker container with pre-configured attack and audit vectors.
                </p>
                <button
                  onClick={handleLaunchLab}
                  disabled={isStarting}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch {activeLab.category} Container</span>
                </button>
              </div>
            )}
          </div>

          {/* Flag Submission & Hints */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Flag className="w-4 h-4" />
              <span>Submit Proof Flag (CN&#123;...&#125;)</span>
            </div>

            <form onSubmit={handleSubmitFlag} className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="CN{...}"
                value={flagInput}
                onChange={e => setFlagInput(e.target.value)}
                className="w-full sm:flex-1 text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm"
              >
                Submit Flag
              </button>
            </form>

            {flagStatus === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Flag Accepted! Lab Solved (+{activeLab.xpReward} XP awarded to your profile).</span>
              </div>
            )}

            {flagStatus === 'incorrect' && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Incorrect flag. Inspect the terminal output or reveal a hint below.</span>
              </div>
            )}

            {/* Hints dropdown */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hints ({activeLab.hints.length})
              </div>
              <div className="space-y-1.5">
                {activeLab.hints.map((hint, idx) => {
                  const isRevealed = revealedHints.includes(idx);
                  return (
                    <div key={idx} className="text-xs">
                      {isRevealed ? (
                        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
                          <span className="font-bold">Hint #{idx + 1}: </span>
                          <span>{hint}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleHint(idx)}
                          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white font-medium"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Reveal Hint #{idx + 1}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation box after solving */}
            {isCompleted && (
              <div className="mt-4 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                <span className="font-bold text-indigo-900 dark:text-indigo-300 text-sm block">
                  Debriefing & Technical Explanation
                </span>
                <p className="leading-relaxed">{activeLab.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
