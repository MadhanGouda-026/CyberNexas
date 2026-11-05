import React, { useState } from 'react';
import { Shield, Activity, Search, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { SIEM_RULES } from '../data/siemData';

export const BlueTeamView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<string>('bruteforce');

  const playbooks = [
    {
      id: 'bruteforce',
      title: 'Playbook: Credential Stuffing & Brute Force Triage',
      category: 'Authentication Incident',
      steps: [
        'Filter SIEM logs for failed logon EventID 4625 within the last 15 minutes.',
        'Extract distinct attacking IP addresses and cross-reference with MaxMind GeoIP and AbuseIPDB.',
        'Determine if any single account transitioned from repeated failures to EventID 4624 (Logon Success).',
        'If compromised, trigger an immediate session token invalidation and force password reset.',
        'Apply an IP rate-limit rule on the reverse proxy to limit authentications to 5 per minute per IP.'
      ],
      mitre: 'T1110 (Brute Force)'
    },
    {
      id: 'ransomware',
      title: 'Playbook: Ransomware Outbreak Containment',
      category: 'Malware Outbreak',
      steps: [
        'Immediately issue an API network isolation command to the affected endpoint via EDR.',
        'Block internal SMB ports (TCP 445/139) between workstation VLANs to halt lateral spread.',
        'Capture volatile memory (RAM) dump prior to rebooting or powering down the machine.',
        'Check Active Directory for rogue service creations (EventID 7045) or unauthorized GPO deployments.',
        'Verify integrity of offline immutable backups before planning staging restoration.'
      ],
      mitre: 'T1486 (Data Encrypted for Impact)'
    },
    {
      id: 'phishing',
      title: 'Playbook: Weaponized Spearphishing Triage',
      category: 'Initial Access',
      steps: [
        'Obtain original .eml or .msg format email with full RFC 822 headers.',
        'Verify SPF, DKIM, and DMARC alignment to determine whether sender domain was spoofed.',
        'Extract attachment hash (SHA-256) and query sandbox telemetry for C2 domain beacons.',
        'Search email gateway for all corporate recipients who received the same Subject line or Message-ID.',
        'Purge the malicious email globally from all employee inboxes via Microsoft Graph / Google Workspace API.'
      ],
      mitre: 'T1566 (Phishing)'
    }
  ];

  const activePlaybook = playbooks.find(p => p.id === selectedPlaybook) || playbooks[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Shield className="w-4 h-4" />
              <span>Blue Team Defense & SOC Playbooks</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Defensive Operations & Incident Response Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              SOC analyst playbooks, real-time threat hunting hypotheses, log correlation workflows, and automated containment directives.
            </p>
          </div>

          <button
            onClick={() => onNavigate('siem')}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all shrink-0"
          >
            <Activity className="w-4 h-4" />
            <span>Launch Live SIEM Console</span>
          </button>
        </div>
      </div>

      {/* Playbook Selector & Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Playbook Menu */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Standard Operating Playbooks (3)
          </div>

          <div className="space-y-2">
            {playbooks.map(pb => (
              <button
                key={pb.id}
                onClick={() => setSelectedPlaybook(pb.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedPlaybook === pb.id
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-1 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase block mb-1">
                  {pb.category}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {pb.title}
                </h3>
              </button>
            ))}
          </div>
        </div>

        {/* Active Playbook Steps */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Active Containment Protocol
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {activePlaybook.title}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
              MITRE: {activePlaybook.mitre}
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Step-by-Step Incident Response Procedures:
            </span>
            <div className="space-y-2.5">
              {activePlaybook.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 text-xs leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>All actions in this playbook align with NIST SP 800-61 computer security incident handling standards.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
