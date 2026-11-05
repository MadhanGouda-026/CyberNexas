import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Play, CheckCircle2, XCircle } from 'lucide-react';

interface Rule {
  id: number;
  action: 'ALLOW' | 'DROP';
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ANY';
  srcIp: string;
  dstPort: string;
  description: string;
}

export const FirewallSimulator: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, action: 'DROP', protocol: 'TCP', srcIp: 'ANY', dstPort: '23', description: 'Block insecure Telnet protocol' },
    { id: 2, action: 'ALLOW', protocol: 'TCP', srcIp: 'ANY', dstPort: '443', description: 'Allow public HTTPS web traffic' },
    { id: 3, action: 'ALLOW', protocol: 'TCP', srcIp: '10.0.0.0/24', dstPort: '22', description: 'Allow SSH from management subnet only' },
    { id: 4, action: 'DROP', protocol: 'ICMP', srcIp: 'ANY', dstPort: 'ANY', description: 'Drop ICMP echo ping probes' },
    { id: 5, action: 'DROP', protocol: 'ANY', srcIp: 'ANY', dstPort: 'ANY', description: 'Implicit Default Deny' }
  ]);

  const [testSrcIp, setTestSrcIp] = useState<string>('198.51.100.4');
  const [testDstPort, setTestDstPort] = useState<string>('443');
  const [testProtocol, setTestProtocol] = useState<'TCP' | 'UDP' | 'ICMP'>('TCP');

  const [evalResult, setEvalResult] = useState<{
    matchedRule: Rule | null;
    decision: 'ALLOW' | 'DROP';
    reason: string;
  } | null>(null);

  const evaluatePacket = () => {
    for (const rule of rules) {
      const protoMatch = rule.protocol === 'ANY' || rule.protocol === testProtocol;
      const portMatch = rule.dstPort === 'ANY' || rule.dstPort === testDstPort;
      const srcMatch = rule.srcIp === 'ANY' || (rule.srcIp === '10.0.0.0/24' && testSrcIp.startsWith('10.0.0.'));

      if (protoMatch && portMatch && srcMatch) {
        setEvalResult({
          matchedRule: rule,
          decision: rule.action,
          reason: `Matched Rule #${rule.id} (${rule.description}). Action: ${rule.action}`
        });
        return;
      }
    }

    // Default fallback
    setEvalResult({
      matchedRule: rules[rules.length - 1],
      decision: 'DROP',
      reason: 'No rules matched. Implicit default deny applied.'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Stateful Packet Filtering Engine</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Firewall Rule Evaluation & Inspection Sandbox
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Inspect rule ordering, first-match semantics, and test synthetic network traffic against active security policies.
          </p>
        </div>
      </div>

      {/* Rules Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3 rounded-l-lg">Rule #</th>
              <th className="py-2.5 px-3">Action</th>
              <th className="py-2.5 px-3">Protocol</th>
              <th className="py-2.5 px-3">Source IP</th>
              <th className="py-2.5 px-3">Dest Port</th>
              <th className="py-2.5 px-3 rounded-r-lg">Rule Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
            {rules.map(r => {
              const isMatched = evalResult?.matchedRule?.id === r.id;
              return (
                <tr
                  key={r.id}
                  className={`transition-colors ${
                    isMatched
                      ? r.action === 'ALLOW'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 font-bold'
                        : 'bg-rose-50 dark:bg-rose-950/40 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-500">#{r.id}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        r.action === 'ALLOW'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {r.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{r.protocol}</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{r.srcIp}</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{r.dstPort}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-400">{r.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Packet Test Generator */}
      <div className="mt-6 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
          Simulate Test Inbound Packet
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Source IP Address</label>
            <input
              type="text"
              value={testSrcIp}
              onChange={e => setTestSrcIp(e.target.value)}
              className="w-full text-xs font-mono p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Protocol</label>
            <select
              value={testProtocol}
              onChange={e => setTestProtocol(e.target.value as any)}
              className="w-full text-xs font-mono p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="TCP">TCP</option>
              <option value="UDP">UDP</option>
              <option value="ICMP">ICMP</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Destination Port</label>
            <input
              type="text"
              value={testDstPort}
              onChange={e => setTestDstPort(e.target.value)}
              className="w-full text-xs font-mono p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <button
            onClick={evaluatePacket}
            className="flex items-center justify-center gap-1.5 p-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Evaluate Packet</span>
          </button>
        </div>

        {/* Evaluation Output */}
        {evalResult && (
          <div
            className={`mt-4 p-3.5 rounded-xl border flex items-center gap-3 ${
              evalResult.decision === 'ALLOW'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300'
            }`}
          >
            {evalResult.decision === 'ALLOW' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <div className="text-xs">
              <span className="font-bold text-sm uppercase mr-2">{evalResult.decision}</span>
              <span>{evalResult.reason}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
