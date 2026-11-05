import React from 'react';
import { Compass, Shield, Terminal, Globe, Cloud, CheckCircle2, ArrowRight } from 'lucide-react';

export const LearningPathsView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const paths = [
    {
      id: 'foundations',
      title: 'Cybersecurity Fundamentals & Bedrock',
      role: 'Junior Security Practitioner',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500',
      description: 'Ideal starting path. Master the CIA Triad, OSI 7-layer networking stack, essential Linux terminal operations, and Python automation.',
      modulesIncluded: [1, 2, 3, 5],
      totalLessons: 100,
      estimatedWeeks: '4 Weeks'
    },
    {
      id: 'soc-analyst',
      title: 'Security Operations & SOC Defense Analyst',
      role: 'Tier 1 / Tier 2 SOC Analyst',
      icon: Shield,
      color: 'from-indigo-500 to-blue-600',
      description: 'Master SIEM event correlation, Windows Event IDs, Suricata IDS signature authoring, memory forensics, and containment playbooks.',
      modulesIncluded: [4, 10, 11, 12],
      totalLessons: 100,
      estimatedWeeks: '5 Weeks'
    },
    {
      id: 'web-pentester',
      title: 'Web Application Penetration Tester',
      role: 'Ethical Hacker & AppSec Specialist',
      icon: Globe,
      color: 'from-amber-500 to-rose-500',
      description: 'Dissect the OWASP Top 10: SQL injection, Cross-Site Scripting (XSS), CSRF, API security testing, and professional vulnerability reporting.',
      modulesIncluded: [6, 7, 8, 9],
      totalLessons: 100,
      estimatedWeeks: '5 Weeks'
    },
    {
      id: 'architect',
      title: 'Cloud Security & Advanced Threat Architect',
      role: 'Senior Security Architect / Lead',
      icon: Cloud,
      color: 'from-purple-500 to-indigo-600',
      description: 'Master AWS/Kubernetes container security, malware reverse engineering, MITRE ATT&CK adversary mapping, and Zero Trust architectures.',
      modulesIncluded: [13, 14, 15],
      totalLessons: 75,
      estimatedWeeks: '4 Weeks'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-semibold text-xs tracking-wider uppercase">
            <Compass className="w-4 h-4" />
            <span>Structured Career Roadmaps</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Cybersecurity Learning Paths
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Follow structured, role-specific tracks curated to take you from foundational understanding to enterprise-ready offensive and defensive specializations.
          </p>
        </div>
      </div>

      {/* Path Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paths.map(path => {
          const Icon = path.icon;
          return (
            <div
              key={path.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${path.color} shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {path.estimatedWeeks} · {path.totalLessons} Lessons
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider block mb-1">
                    Target Role: {path.role}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {path.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {path.description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Curriculum Modules Included:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {path.modulesIncluded.map(num => (
                      <span
                        key={num}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300"
                      >
                        Module {num}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('lessons')}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline"
                >
                  <span>Start This Learning Path</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
