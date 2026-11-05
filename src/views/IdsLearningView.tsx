import React, { useState } from 'react';
import { ShieldAlert, Play, CheckCircle2, AlertOctagon, Code, Eye } from 'lucide-react';

interface IdsRule {
  sid: number;
  protocol: string;
  source: string;
  destination: string;
  msg: string;
  content: string;
  category: string;
  enabled: boolean;
}

export const IdsLearningView: React.FC = () => {
  const [rules, setRules] = useState<IdsRule[]>([
    {
      sid: 1000001,
      protocol: 'tcp',
      source: '$EXTERNAL_NET any',
      destination: '$HTTP_SERVERS 80',
      msg: 'WEB-ATTACKS SQL Injection Attempt (UNION SELECT)',
      content: 'UNION SELECT',
      category: 'Web Exploit',
      enabled: true
    },
    {
      sid: 1000002,
      protocol: 'tcp',
      source: '$EXTERNAL_NET any',
      destination: '$HOME_NET 22',
      msg: 'SCAN Nmap Scripting Engine User-Agent detected',
      content: 'Nmap Scripting Engine',
      category: 'Reconnaissance',
      enabled: true
    },
    {
      sid: 1000003,
      protocol: 'udp',
      source: '$HOME_NET any',
      destination: '$EXTERNAL_NET 53',
      msg: 'MALWARE-CNC Suspicious Long DNS Query (Potential Tunneling)',
      content: 'tunnel.attacker-c2.net',
      category: 'C2 Exfiltration',
      enabled: true
    }
  ]);

  const [testPayload, setTestPayload] = useState<string>('GET /products.php?id=1 UNION SELECT username,password FROM users HTTP/1.1');
  const [detectionResult, setDetectionResult] = useState<{
    triggered: boolean;
    rule: IdsRule | null;
  } | null>(null);

  const testIdsDetection = () => {
    for (const rule of rules) {
      if (rule.enabled && testPayload.toLowerCase().includes(rule.content.toLowerCase())) {
        setDetectionResult({ triggered: true, rule });
        return;
      }
    }
    setDetectionResult({ triggered: false, rule: null });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Intrusion Detection Systems</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Suricata & Snort IDS Signature Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Understand deep packet inspection rules, signature matching syntax (Header, Action, Options, Content modifiers, SIDs), and alert generation mechanics.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Inspector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Active Suricata IDS Signatures</span>
          <span className="text-xs font-mono text-slate-400">Rules Loaded: {rules.length}</span>
        </h3>

        <div className="space-y-3 font-mono text-xs">
          {rules.map(r => (
            <div
              key={r.sid}
              className="p-4 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 space-y-2 select-all"
            >
              <div className="flex items-center justify-between text-cyan-400 pb-1.5 border-b border-slate-800/80">
                <span>SID: {r.sid} ({r.category})</span>
                <span className="text-emerald-400 text-[11px] font-bold">STATE: ACTIVE</span>
              </div>
              <div className="text-emerald-400 leading-relaxed break-all">
                alert {r.protocol} {r.source} -&gt; {r.destination} (msg:&quot;{r.msg}&quot;; content:&quot;{r.content}&quot;; nocase; sid:{r.sid}; rev:1;)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Packet Stream Tester */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Simulate Inbound Network Payload Test
        </h3>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Payload Buffer (HTTP/DNS/TCP Stream)
          </label>
          <textarea
            rows={3}
            value={testPayload}
            onChange={e => setTestPayload(e.target.value)}
            className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          />
        </div>

        <button
          onClick={testIdsDetection}
          className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Inspect Payload Against IDS Signatures</span>
        </button>

        {detectionResult && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              detectionResult.triggered
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            {detectionResult.triggered ? (
              <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <div className="text-xs">
              {detectionResult.triggered ? (
                <>
                  <span className="font-bold block text-sm">ALERT TRIGGERED (SID {detectionResult.rule?.sid})</span>
                  <span>{detectionResult.rule?.msg} matched pattern: &quot;{detectionResult.rule?.content}&quot;</span>
                </>
              ) : (
                <>
                  <span className="font-bold block text-sm">NO ANOMALIES DETECTED</span>
                  <span>Payload passed through deep packet inspection with zero signature matches.</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
