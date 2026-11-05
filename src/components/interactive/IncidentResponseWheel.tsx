import React, { useState } from 'react';
import { Shield, Search, Lock, Trash2, RotateCw, BookOpen, CheckCircle } from 'lucide-react';

interface IRPhase {
  id: number;
  name: string;
  icon: any;
  color: string;
  summary: string;
  actions: string[];
  artifacts: string[];
  pitfalls: string[];
}

const IR_PHASES: IRPhase[] = [
  {
    id: 1,
    name: 'Preparation',
    icon: Shield,
    color: 'from-blue-500 to-indigo-600',
    summary: 'Establishing and training an incident response team, drafting pre-approved containment playbooks, and deploying centralized logging agents across all endpoints.',
    actions: [
      'Maintain up-to-date call trees and external legal/forensic retainer contracts.',
      'Deploy EDR (Endpoint Detection & Response) and SIEM collectors with synchronized NTP.',
      'Conduct regular tabletop exercises simulating ransomware and credential theft.'
    ],
    artifacts: ['Incident Response Plan (IRP)', 'Hardware Asset Inventory', 'Pre-authorized Playbooks'],
    pitfalls: ['Lacking pre-approved authorization to disconnect critical production systems during an active attack.']
  },
  {
    id: 2,
    name: 'Detection & Analysis',
    icon: Search,
    color: 'from-cyan-500 to-blue-600',
    summary: 'Triaging SIEM alerts, validating false positives, establishing Patient Zero, and determining the scope of compromised hosts and adversary TTPs.',
    actions: [
      'Correlate suspicious authentications with unusual parent-child process executions.',
      'Acquire volatile memory (RAM) dumps and disk images prior to rebooting.',
      'Map Indicators of Compromise (IOCs) against threat intelligence feeds.'
    ],
    artifacts: ['Timeline Analysis Spreadsheet', 'RAM triage dump', 'Network PCAP logs'],
    pitfalls: ['Rebooting a compromised server prematurely, obliterating volatile memory evidence.']
  },
  {
    id: 3,
    name: 'Containment',
    icon: Lock,
    color: 'from-amber-500 to-orange-600',
    summary: 'Halting adversary lateral movement and data exfiltration through short-term network isolation and credential revocation while preserving evidence.',
    actions: [
      'Isolate affected endpoints at the switch/VLAN level or via EDR host isolation.',
      'Block malicious C2 IP addresses and domains at the egress firewall/proxy.',
      'Reset all compromised domain credentials, Kerberos Krbtgt keys, and active API tokens.'
    ],
    artifacts: ['Firewall blocklist update logs', 'Isolated host inventory', 'Session revocation receipts'],
    pitfalls: ['Alerting the adversary by taking uncoordinated partial actions before full scope is mapped.']
  },
  {
    id: 4,
    name: 'Eradication',
    icon: Trash2,
    color: 'from-rose-500 to-red-600',
    summary: 'Completely eliminating the root cause, neutralizing malware artifacts, closing unauthorized access backdoors, and remediating exploited vulnerabilities.',
    actions: [
      'Remove scheduled tasks, unauthorized services, and malicious registry run keys.',
      'Patch the initial exploitation vector (e.g. web vulnerability or exposed VPN).',
      'Rebuild compromised systems from known-clean golden images or verified backups.'
    ],
    artifacts: ['Malware removal verification scan', 'Vulnerability patch confirmation report'],
    pitfalls: ['Assuming removing a single executable eradicates the threat while secondary web shells remain.']
  },
  {
    id: 5,
    name: 'Recovery',
    icon: RotateCw,
    color: 'from-emerald-500 to-teal-600',
    summary: 'Safely restoring production systems to operational status, validating normal functionality, and maintaining heightened monitoring for adversary re-entry.',
    actions: [
      'Restore databases from clean pre-incident backups taken prior to breach timestamp.',
      'Gradually restore network connectivity under enhanced EDR/packet logging surveillance.',
      'Conduct post-recovery penetration tests and credential audits.'
    ],
    artifacts: ['System health validation checklists', 'Enhanced monitoring telemetry metrics'],
    pitfalls: ['Restoring from a recent backup that already contained the dormant malware payload.']
  },
  {
    id: 6,
    name: 'Lessons Learned',
    icon: BookOpen,
    color: 'from-violet-500 to-purple-600',
    summary: 'Holding a retrospective meeting within 2 weeks of incident closure to document what happened, identify control gaps, and harden the security posture.',
    actions: [
      'Draft a detailed Root Cause Analysis (RCA) and executive summary report.',
      'Update detection rules in SIEM/IDS to catch similar future attacks automatically.',
      'Allocate budget and engineering resources to address identified architectural gaps.'
    ],
    artifacts: ['Post-Incident Review Report', 'Updated Playbook v2.0', 'Corrective Action Plan'],
    pitfalls: ['Treating the retrospective as a blame exercise rather than an engineering enhancement cycle.']
  }
];

export const IncidentResponseWheel: React.FC = () => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(2);
  const activePhase = IR_PHASES.find(p => p.id === selectedPhaseId) || IR_PHASES[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Shield className="w-4 h-4" />
            <span>NIST SP 800-61 / SANS Standard</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Incident Response Lifecycle Architecture
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Click any phase in the continuous cycle to examine operational protocols, forensic evidence requirements, and pitfalls.
          </p>
        </div>
      </div>

      {/* Lifecycle Phase Buttons */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {IR_PHASES.map(phase => {
          const isSelected = phase.id === selectedPhaseId;
          const Icon = phase.icon;
          return (
            <button
              key={phase.id}
              onClick={() => setSelectedPhaseId(phase.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-slate-400">0{phase.id}</span>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white bg-gradient-to-br ${phase.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">
                {phase.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Deep Dive */}
      <div className="mt-6 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-700/60">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${activePhase.color} shadow-sm`}>
            {React.createElement(activePhase.icon, { className: 'w-5 h-5' })}
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white">
              Phase {activePhase.id}: {activePhase.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activePhase.summary}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Actions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-2">
              Required Tactical Actions
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {activePhase.actions.map((act, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Artifacts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mb-2">
              Key Artifacts & Evidence
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {activePhase.artifacts.map((art, i) => (
                <li key={i} className="flex items-start gap-1.5 font-mono">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span>{art}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pitfalls */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-2">
              Critical Pitfalls to Avoid
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {activePhase.pitfalls.map((pit, i) => (
                <li key={i} className="flex items-start gap-1.5 text-rose-700 dark:text-rose-300">
                  <span className="text-rose-500 font-bold">!</span>
                  <span>{pit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
