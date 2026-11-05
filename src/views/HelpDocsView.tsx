import React from 'react';
import { HelpCircle, Terminal, BookOpen, KeyRound, ExternalLink } from 'lucide-react';

export const HelpDocsView: React.FC = () => {
  const cheatSheet = [
    { cmd: 'whoami', desc: 'Display effective username in active shell' },
    { cmd: 'id', desc: 'Display UID, GID, and supplemental groups' },
    { cmd: 'ls -la', desc: 'List all files including hidden dotfiles with POSIX permissions' },
    { cmd: 'cat <file>', desc: 'Concatenate and print file contents to standard output' },
    { cmd: 'find / -perm -4000', desc: 'Search entire root filesystem for SUID binaries' },
    { cmd: 'nmap -sS -p- <target>', desc: 'Execute TCP SYN stealth scan across all 65,535 ports' },
    { cmd: 'curl -I <url>', desc: 'Fetch HTTP response headers only (inspect Server/CSP)' },
    { cmd: 'base64 -d', desc: 'Decode base64 encoded payload to standard ASCII/raw bytes' },
    { cmd: 'grep -rn "pattern" .', desc: 'Search recursively through files with line numbers' },
    { cmd: 'clear', desc: 'Clear the virtual terminal buffer' }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Platform Documentation & Reference</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Help Center & Command Cheat Sheet
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Essential bash commands, lab troubleshooting tips, CTF flag formats, and offline deployment guides.
            </p>
          </div>
        </div>
      </div>

      {/* Linux Terminal Cheat Sheet */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          <span>Cyber Lab Terminal Quick-Reference</span>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4 w-1/3">Command Syntax</th>
                <th className="py-2.5 px-4 font-sans">Operational Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {cheatSheet.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 font-bold text-indigo-600 dark:text-cyan-400 select-all">{item.cmd}</td>
                  <td className="py-2.5 px-4 font-sans text-slate-700 dark:text-slate-300">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTF Flag Format */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          CTF Flag Submission Standard
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          All challenge flags across CyberNexus follow the standardized format:
        </p>
        <div className="p-3 bg-slate-950 font-mono text-xs text-amber-400 rounded-xl border border-slate-800 select-all">
          CN&#123;flag_string_here&#125;
        </div>
        <p className="text-xs text-slate-500">
          Be sure to include the exact prefix <code className="font-mono text-indigo-500">CN&#123;</code> and closing bracket <code className="font-mono text-indigo-500">&#125;</code> when validating flags in the CTF Arena and Cyber Labs.
        </p>
      </div>
    </div>
  );
};
