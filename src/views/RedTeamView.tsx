import React, { useState } from 'react';
import { Crosshair, Terminal, Shield, ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { InteractiveTerminal } from '../components/Terminal/InteractiveTerminal';

export const RedTeamView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  const phases = [
    {
      id: 1,
      title: 'Reconnaissance & OSINT',
      description: 'Passive information gathering via Certificate Transparency logs (crt.sh), DNS enumeration, WHOIS registries, and Shodan asset profiling.',
      keyTools: ['sublist3r', 'amass', 'crt.sh', 'whois', 'dig'],
      commandExample: 'dig +nocmd cybernexus.org any +multiline +noall +answer'
    },
    {
      id: 2,
      title: 'Active Scanning & Enumeration',
      description: 'Direct probing of authorized target IP ranges to detect listening daemons, unauthenticated services, and software version banners.',
      keyTools: ['nmap', 'masscan', 'gobuster', 'enum4linux'],
      commandExample: 'nmap -sS -sV -p 1-1000 192.168.10.15 -T4'
    },
    {
      id: 3,
      title: 'Vulnerability Analysis',
      description: 'Correlating discovered service banners against the National Vulnerability Database (NVD) and public CVE repositories for known exploits.',
      keyTools: ['searchsploit', 'vulners', 'nikto'],
      commandExample: 'searchsploit "vsftpd 2.3.4"'
    },
    {
      id: 4,
      title: 'Exploitation & Proof-of-Concept',
      description: 'Validating vulnerabilities using controlled proofs of concept in authorized testing labs to confirm business impact.',
      keyTools: ['metasploit', 'sqlmap', 'custom-python-scripts'],
      commandExample: 'python3 exploit_sqli_poc.py --target http://portal.local'
    },
    {
      id: 5,
      title: 'Executive Reporting & Remediation',
      description: 'Documenting findings with CVSS 3.1 scoring, step-by-step reproduction instructions, and clear defensive remediation steps.',
      keyTools: ['markdown-reports', 'CVSS-calculator', 'Jira-integrations'],
      commandExample: 'Generate Remediation Roadmap: Update vsftpd to version 3.0.5+'
    }
  ];

  const currentPhase = phases.find(p => p.id === selectedPhase) || phases[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Crosshair className="w-4 h-4" />
              <span>Offensive Security Operations</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Red Team Assessment Methodology
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Master the ethical hacking phases used by professional penetration testers. All testing techniques must adhere strictly to written Rules of Engagement (RoE).
            </p>
          </div>

          <button
            onClick={() => onNavigate('labs')}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all shrink-0"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch Offensive Cyber Labs</span>
          </button>
        </div>
      </div>

      {/* 5-Phase Methodology Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {phases.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPhase(p.id)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedPhase === p.id
                ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 ring-1 ring-rose-500/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 uppercase block mb-1">
              Phase 0{p.id}
            </span>
            <div className="font-bold text-xs text-slate-900 dark:text-white">
              {p.title}
            </div>
          </button>
        ))}
      </div>

      {/* Active Phase Deep Dive */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            Operational Phase 0{currentPhase.id} Breakdown
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {currentPhase.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {currentPhase.description}
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Standard Industry Tooling:
          </span>
          <div className="flex flex-wrap gap-2">
            {currentPhase.keyTools.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-semibold text-rose-600 dark:text-rose-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Command Line Invocation Example:
          </span>
          <div className="p-3.5 bg-slate-950 font-mono text-xs text-emerald-400 rounded-xl border border-slate-800 select-all">
            $ {currentPhase.commandExample}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-slate-700 dark:text-slate-300">
          <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">
            Rules of Engagement Mandatory Notice:
          </span>
          Testing offensive techniques against third-party systems without documented, signed authorization is illegal under the Computer Fraud and Abuse Act (CFAA) and international statutes. CyberNexus exercises must only be practiced within authorized lab containers.
        </div>
      </div>
    </div>
  );
};
