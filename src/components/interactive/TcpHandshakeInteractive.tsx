import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Play, CheckCircle2, AlertOctagon, ShieldCheck } from 'lucide-react';

export const TcpHandshakeInteractive: React.FC = () => {
  const [step, setStep] = useState<number>(0); // 0: Idle, 1: SYN, 2: SYN-ACK, 3: ACK (Established)
  const [synFloodMode, setSynFloodMode] = useState<boolean>(false);
  const [synCookieEnabled, setSynCookieEnabled] = useState<boolean>(false);

  const clientSeq = 1337;
  const serverSeq = 9001;

  const nextStep = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    }
  };

  const reset = () => {
    setStep(0);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <span>Transport Layer State Machine</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            TCP 3-Way Handshake & SYN Flood Simulation
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Step through synchronization flags, sequence math, state transitions, and defensive SYN cookies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSynFloodMode(!synFloodMode);
              setStep(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              synFloodMode
                ? 'bg-red-500 text-white border-red-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            {synFloodMode ? 'Disable Attack Sim' : 'Simulate SYN Flood DDoS'}
          </button>

          {synFloodMode && (
            <button
              onClick={() => setSynCookieEnabled(!synCookieEnabled)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                synCookieEnabled
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
              }`}
            >
              {synCookieEnabled ? 'SYN Cookies: ON' : 'Enable SYN Cookies'}
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="mt-8 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Client Node */}
          <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 flex items-center justify-center font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-3">
              CLI
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Client Host</h4>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">192.168.1.50:49210</div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">TCP Connection State:</span>
              <span className={`inline-block font-mono text-xs font-bold px-2.5 py-1 rounded-md ${
                step === 0 ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' :
                step === 1 ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' :
                step === 2 ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' :
                'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
              }`}>
                {step === 0 ? 'CLOSED' : step === 1 ? 'SYN_SENT' : step === 2 ? 'SYN_SENT' : 'ESTABLISHED'}
              </span>
            </div>
          </div>

          {/* Packet In Flight Pipeline */}
          <div className="md:col-span-4 flex flex-col items-center justify-center space-y-4 px-2">
            {step === 0 && (
              <div className="text-center text-xs text-slate-400">
                Click &quot;Step Next&quot; or &quot;Play&quot; to initiate 3-way synchronization.
              </div>
            )}

            {step === 1 && (
              <div className="w-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-300 dark:border-cyan-800 rounded-xl p-3 shadow-sm animate-pulse text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-700 dark:text-cyan-300 mb-1">
                  <span>Packet #1: [SYN]</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  Seq = {clientSeq}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="w-full bg-violet-50 dark:bg-violet-950/40 border border-violet-300 dark:border-violet-800 rounded-xl p-3 shadow-sm animate-pulse text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-violet-700 dark:text-violet-300 mb-1">
                  <span>Packet #2: [SYN, ACK]</span>
                  <span className="rotate-180 inline-block"><ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
                <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  Seq = {serverSeq} · Ack = {clientSeq + 1}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="w-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl p-3 shadow-sm text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Packet #3: [ACK]</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  Seq = {clientSeq + 1} · Ack = {serverSeq + 1}
                </div>
              </div>
            )}

            {/* Stepper controls */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={nextStep}
                disabled={step >= 3}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none rounded-lg shadow-sm transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{step === 0 ? 'Start Handshake' : step < 3 ? 'Step Next' : 'Connected'}</span>
              </button>
              <button
                onClick={reset}
                className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
                title="Reset Handshake"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Server Node */}
          <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 flex items-center justify-center font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-3">
              SRV
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">HTTPS Web Server</h4>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">10.0.0.1:443</div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">TCP Connection State:</span>
              <span className={`inline-block font-mono text-xs font-bold px-2.5 py-1 rounded-md ${
                step === 0 ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' :
                step === 1 ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' :
                step === 2 ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' :
                'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
              }`}>
                {step === 0 ? 'LISTEN' : step === 1 ? 'LISTEN' : step === 2 ? 'SYN_RCVD' : 'ESTABLISHED'}
              </span>
            </div>
          </div>
        </div>

        {/* Attack Scenario Callout */}
        {synFloodMode && (
          <div className="mt-6 p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/70 dark:bg-red-950/20 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400 mb-1.5 text-sm">
              <AlertOctagon className="w-4 h-4" />
              <span>Simulating SYN Flood Attack Active</span>
            </div>
            <p className="leading-relaxed">
              In a SYN Flood DDoS, an adversary transmits thousands of SYN packets with spoofed source IPs without ever responding with the final ACK. The server creates Transmission Control Blocks (TCBs) in memory for each half-open connection until the SYN backlog queue exhausts memory.
            </p>
            {synCookieEnabled ? (
              <div className="mt-3 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-100 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>SYN Cookies Active: The server does not allocate memory for half-open sockets. Instead, connection parameters are cryptographically encoded directly into the initial sequence number (ISN). Legitimate connections complete when the client returns the ACK with ISN+1!</span>
              </div>
            ) : (
              <div className="mt-3 text-red-600 dark:text-red-400 font-semibold">
                Backlog Queue: 100% Full (1024/1024 half-open sockets). New legitimate connection requests will be dropped! Click &quot;Enable SYN Cookies&quot; to defend the server.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
