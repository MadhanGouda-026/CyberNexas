import React, { useState } from 'react';
import { Globe2, Server, Database, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';

export const DnsResolverInteractive: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [domain] = useState<string>('defense.cybernexus.org');

  const steps = [
    {
      title: 'Local Client Cache Check',
      actor: 'Client Workstation',
      desc: 'The operating system checks its local DNS resolver cache (and /etc/hosts). If found, returns immediately. If missing (cache miss), dispatches recursive query to configured ISP/Enterprise resolver.',
      icon: Globe2,
      result: 'Cache Miss → Forwarding query to Recursive Resolver (10.0.0.2)'
    },
    {
      title: 'Recursive Resolver Query',
      actor: 'Recursive Resolver (10.0.0.2)',
      desc: 'The recursive DNS resolver receives the query for "defense.cybernexus.org" and initiates iterative queries through the global DNS hierarchical tree starting at the Root.',
      icon: Server,
      result: 'Iterating: Asking Root Nameserver (".")'
    },
    {
      title: 'Root Nameserver Query (".")',
      actor: 'Root Server [a.root-servers.net]',
      desc: 'The Root server does not know the specific IP for "defense.cybernexus.org", but directs the resolver to the authoritative Top-Level Domain (TLD) servers for ".org".',
      icon: Database,
      result: 'Referral: Go to .org TLD Nameserver (199.19.56.1)'
    },
    {
      title: 'TLD Nameserver Query (".org")',
      actor: '.org TLD Server [b0.org.afilias-nst.org]',
      desc: 'The .org TLD server parses the domain "cybernexus.org" and returns the authoritative nameservers delegated for the cybernexus.org zone.',
      icon: Database,
      result: 'Referral: Go to Authoritative NS [ns1.cybernexus.org]'
    },
    {
      title: 'Authoritative Nameserver Query',
      actor: 'Authoritative Server [ns1.cybernexus.org]',
      desc: 'The authoritative nameserver holds the master DNS zone record for "defense.cybernexus.org" and returns the final A record IP address.',
      icon: Server,
      result: 'Answer: defense.cybernexus.org A 104.21.88.92 (TTL=300)'
    },
    {
      title: 'Resolution Complete & Cached',
      actor: 'Client Workstation',
      desc: 'The recursive resolver saves the record in cache for 300 seconds (TTL) and delivers the destination IP (104.21.88.92) to the browser to begin the TCP/TLS connection.',
      icon: CheckCircle2,
      result: 'Resolved: Ready to connect to 104.21.88.92:443'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Globe2 className="w-4 h-4" />
            <span>Interactive DNS Resolution Chain</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Hierarchical Domain Name Resolution Pipeline
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Trace how a human-readable domain name resolves across Root, TLD, and Authoritative nameservers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStep >= steps.length - 1}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:pointer-events-none rounded-lg shadow-sm transition-all"
          >
            Next Query Step →
          </button>
          <button
            onClick={() => setCurrentStep(0)}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
            title="Reset simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Domain Display */}
      <div className="mt-6 flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs">
        <span className="font-semibold text-slate-500">Target Lookup:</span>
        <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">{domain}</span>
        <span className="text-slate-400">Step {currentStep + 1} of {steps.length}</span>
      </div>

      {/* Step Visualizer */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((s, idx) => {
          const isActive = idx === currentStep;
          const isPassed = idx < currentStep;
          return (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 ring-1 ring-teal-500/30'
                  : isPassed
                  ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60'
              }`}
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Step 0{idx + 1}
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                {s.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep Inspector */}
      <div className="mt-6 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold shadow-sm">
            {React.createElement(steps[currentStep].icon, { className: 'w-5 h-5' })}
          </div>
          <div>
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              {steps[currentStep].title}
            </h4>
            <div className="text-xs font-mono text-teal-600 dark:text-teal-400">
              Entity: {steps[currentStep].actor}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {steps[currentStep].desc}
        </p>

        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2 text-xs font-mono">
          <ArrowRight className="w-4 h-4 text-teal-500 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300">{steps[currentStep].result}</span>
        </div>
      </div>
    </div>
  );
};
