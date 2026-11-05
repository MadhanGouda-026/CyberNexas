import React, { useState } from 'react';
import { Activity, ShieldAlert, Filter, Search, PlusCircle, CheckCircle2, AlertOctagon, Terminal, Play } from 'lucide-react';
import { INITIAL_SIEM_LOGS, SIEM_RULES, SIEMDetectionRule } from '../data/siemData';
import { SIEMLog } from '../types';
import { useProgress } from '../context/ProgressContext';

export const SiemDashboardView: React.FC = () => {
  const { unlockAchievement } = useProgress();
  const [logs, setLogs] = useState<SIEMLog[]>(INITIAL_SIEM_LOGS);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedAction, setSelectedAction] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLog, setActiveLog] = useState<SIEMLog | null>(INITIAL_SIEM_LOGS[1]);
  const [activeTab, setActiveTab] = useState<'stream' | 'rules' | 'timeline'>('stream');

  const filteredLogs = logs.filter(log => {
    if (selectedSeverity !== 'All' && log.severity !== selectedSeverity) return false;
    if (selectedAction !== 'All' && log.action !== selectedAction) return false;
    if (selectedCategory !== 'All' && log.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        log.sourceIp.includes(q) ||
        log.destIp.includes(q) ||
        log.signature.toLowerCase().includes(q) ||
        log.rawPayload.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleInjectSyntheticAttack = () => {
    const newLog: SIEMLog = {
      id: `log-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      sourceIp: '203.0.113.88',
      destIp: '10.0.1.80',
      port: 443,
      protocol: 'HTTPS',
      action: 'ALERT',
      severity: 'Critical',
      signature: 'SIEM Correlation Rule Trigger: Automated API Credential Scraping',
      category: 'Intrusion',
      rawPayload: 'POST /api/v1/auth/tokens HTTP/1.1 Rate: 480 requests/sec. User-Agent: python-requests/2.31'
    };
    setLogs(prev => [newLog, ...prev]);
    setActiveLog(newLog);
    unlockAchievement('siem-analyst');
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'High':
        return 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-800';
      case 'Medium':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* SIEM Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Activity className="w-4 h-4" />
              <span>Security Information & Event Management</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              SOC SIEM Telemetry & Detection Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Real-time enterprise event stream analyzer, rule correlation engine, and threat triage workbench modeled after Splunk, Elastic SIEM, and Microsoft Sentinel.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInjectSyntheticAttack}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simulate Threat Event</span>
            </button>
          </div>
        </div>

        {/* SIEM View Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('stream')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'stream'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-cyan-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Live Event Stream ({filteredLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'rules'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-cyan-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Correlation Rules ({SIEM_RULES.length})
          </button>
        </div>
      </div>

      {activeTab === 'stream' && (
        <div className="space-y-6">
          {/* Query & Filter Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search IP, signature, or payload (e.g. 198.51.100, SQL, PsExec)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <select
                value={selectedSeverity}
                onChange={e => setSelectedSeverity(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="All">All Severity</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                <option value="Informational">Informational</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <select
                value={selectedAction}
                onChange={e => setSelectedAction(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="All">All Actions</option>
                <option value="ALERT">ALERT</option>
                <option value="BLOCK">BLOCK</option>
                <option value="DROP">DROP</option>
                <option value="ALLOW">ALLOW</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="All">All Categories</option>
                <option value="Intrusion">Intrusion</option>
                <option value="Malware">Malware</option>
                <option value="Authentication">Authentication</option>
                <option value="Network Scan">Network Scan</option>
                <option value="Policy Violation">Policy Violation</option>
              </select>
            </div>
          </div>

          {/* Main Stream Grid & Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Log Stream List */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Timestamp / Event Signature</span>
                <span>Severity / Action</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto font-mono text-xs">
                {filteredLogs.map(log => {
                  const isSelected = activeLog?.id === log.id;
                  return (
                    <div
                      key={log.id}
                      onClick={() => setActiveLog(log)}
                      className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/40'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{log.timestamp}</span>
                          <span>·</span>
                          <span className="text-indigo-600 dark:text-cyan-400 font-semibold">{log.sourceIp} → {log.destIp}:{log.port}</span>
                        </div>
                        <div className="font-sans font-bold text-slate-900 dark:text-white truncate">
                          {log.signature}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(log.severity)}`}>
                          {log.severity}
                        </span>
                        <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {log.action}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Event Deep Inspector */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              {activeLog ? (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Event Record Details
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getSeverityBadge(activeLog.severity)}`}>
                      {activeLog.severity}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeLog.signature}
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block mb-0.5">Source Endpoint:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{activeLog.sourceIp}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block mb-0.5">Destination Target:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{activeLog.destIp}:{activeLog.port}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block mb-0.5">Protocol:</span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-cyan-400">{activeLog.protocol}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block mb-0.5">Firewall Action:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{activeLog.action}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Raw Ingested Syslog / Payload
                    </span>
                    <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 break-all leading-relaxed select-all">
                      {activeLog.rawPayload}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-indigo-900 dark:text-cyan-300 block mb-1">Recommended Triage Playbook:</span>
                    Correlate this source IP against external threat feeds. If verified unauthorized, deploy an immediate perimeter block rule on ingress gateway firewalls.
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-xs text-slate-400">
                  Select an event log on the left to inspect detailed telemetry.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SIEM_RULES.map(rule => (
            <div
              key={rule.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 dark:text-cyan-400 font-mono">
                  RULE: {rule.id.toUpperCase()}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getSeverityBadge(rule.severity)}`}>
                  {rule.severity}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {rule.name}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {rule.description}
              </p>

              <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-400 break-all">
                {rule.queryFilter}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>MITRE Technique: <strong className="text-slate-700 dark:text-slate-300">{rule.mitreTechnique}</strong></span>
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
