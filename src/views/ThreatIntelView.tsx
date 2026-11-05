import React, { useState } from 'react';
import { Shield, Search, Globe, Users, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MITRE_TECHNIQUES, THREAT_ACTORS, IOC_DATABASE, IOCEntry } from '../data/threatIntelData';

export const ThreatIntelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'actors' | 'ioc'>('matrix');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [iocSearch, setIocSearch] = useState<string>('');
  const [selectedActorId, setSelectedActorId] = useState<string>('apt29');

  const filteredTechniques = MITRE_TECHNIQUES.filter(tech =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.tactic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeActor = THREAT_ACTORS.find(a => a.id === selectedActorId) || THREAT_ACTORS[0];

  const filteredIocs = IOC_DATABASE.filter(ioc =>
    !iocSearch.trim() ||
    ioc.value.toLowerCase().includes(iocSearch.toLowerCase()) ||
    ioc.threatActor.toLowerCase().includes(iocSearch.toLowerCase()) ||
    ioc.malwareFamily.toLowerCase().includes(iocSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header with Visual Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-semibold text-xs tracking-wider uppercase">
              <Globe className="w-4 h-4" />
              <span>Global Threat Intelligence & Adversary TTPs</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Threat Intelligence & MITRE ATT&CK Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              Track adversary Tactics, Techniques, and Procedures (TTPs). Deconstruct nation-state threat actor playbooks and search active Indicators of Compromise (IOCs).
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'matrix'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                MITRE ATT&CK Matrix
              </button>
              <button
                onClick={() => setActiveTab('actors')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'actors'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Nation-State Threat Actors
              </button>
              <button
                onClick={() => setActiveTab('ioc')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'ioc'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                IOC Lookup Engine
              </button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-950">
              <img
                src="/src/assets/images/threat_intelligence_map_1793808861886.jpg"
                alt="Cyber Threat Intelligence Telemetry Map"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter MITRE Techniques (e.g. Phishing, PowerShell, T1078)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTechniques.map(tech => (
              <div
                key={tech.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                    {tech.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Tactic: <strong className="text-slate-700 dark:text-slate-300">{tech.tactic}</strong>
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {tech.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {tech.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Detection Strategy:</span>
                    <span className="text-slate-500 dark:text-slate-400 leading-relaxed">{tech.detection}</span>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">Mitigation:</span>
                    <span className="text-slate-500 dark:text-slate-400 leading-relaxed">{tech.mitigation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'actors' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Adversary Profiles (3)
            </div>

            {THREAT_ACTORS.map(actor => (
              <button
                key={actor.id}
                onClick={() => setSelectedActorId(actor.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedActorId === actor.id
                    ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">{actor.name}</div>
                <div className="text-xs text-slate-400">{actor.origin}</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{activeActor.name}</h3>
                <span className="text-xs text-slate-400">Aliases: {activeActor.aliases.join(', ')}</span>
              </div>
              <span className="text-xs font-mono font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900">
                {activeActor.origin}
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeActor.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1.5">Primary Target Sectors:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeActor.targetSectors.map((sec, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {sec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1.5">Signature Malware & Tools:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeActor.signatureTools.map((tool, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-cyan-600 dark:text-cyan-400">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ioc' && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Query IP, domain, hash, or CVE..."
              value={iocSearch}
              onChange={e => setIocSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Observable Value</th>
                  <th className="py-2.5 px-3">Threat Actor / Family</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {filteredIocs.map((ioc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-slate-400">{ioc.type}</td>
                    <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-cyan-400 truncate max-w-xs">{ioc.value}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300">{ioc.threatActor} ({ioc.malwareFamily})</td>
                    <td className="py-2.5 px-3 text-emerald-500 font-bold">{ioc.confidence}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-500">{ioc.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
