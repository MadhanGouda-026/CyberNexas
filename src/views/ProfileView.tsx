import React, { useState } from 'react';
import { User, Shield, Award, Edit3, Save, Printer, CheckCircle2 } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export const ProfileView: React.FC = () => {
  const { progress, updateProfile, levelInfo } = useProgress();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>(progress.userProfile.username);
  const [bioInput, setBioInput] = useState<string>(progress.userProfile.bio);
  const [specInput, setSpecInput] = useState<string>(progress.userProfile.specialization);

  const handleSave = () => {
    updateProfile({
      username: usernameInput,
      bio: bioInput,
      specialization: specInput
    });
    setIsEditing(false);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-md">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {progress.userProfile.username}
              </h1>
              <div className="text-xs text-indigo-600 dark:text-cyan-400 font-semibold mt-0.5">
                {levelInfo.rankTitle} · Level {levelInfo.level} ({levelInfo.currentXp} XP)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-500 uppercase tracking-wider block">Codename / Username</label>
            {isEditing ? (
              <input
                type="text"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            ) : (
              <div className="font-semibold text-slate-800 dark:text-slate-200 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                {progress.userProfile.username}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-500 uppercase tracking-wider block">Specialization Track</label>
            {isEditing ? (
              <input
                type="text"
                value={specInput}
                onChange={e => setSpecInput(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            ) : (
              <div className="font-semibold text-slate-800 dark:text-slate-200 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                {progress.userProfile.specialization}
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="font-bold text-slate-500 uppercase tracking-wider block">Cyber Operative Bio</label>
            {isEditing ? (
              <textarea
                rows={2}
                value={bioInput}
                onChange={e => setBioInput(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none"
              />
            ) : (
              <div className="text-slate-700 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                {progress.userProfile.bio}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Printable Certificate of Completion */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider block">
              Official CyberNexus Credential
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Certificate of Cybersecurity Training
            </h3>
          </div>
          <button
            onClick={handlePrintCertificate}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>

        {/* Certificate Parchment */}
        <div className="p-8 sm:p-12 border-4 border-double border-indigo-200 dark:border-indigo-900/60 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-white to-cyan-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <div className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 dark:text-cyan-400">
              CyberNexus International Academy
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Certificate of Achievement
            </h2>
          </div>

          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            This credential is duly presented to acknowledge verified practical cybersecurity proficiency, ethical testing methodology, and defensive excellence:
          </p>

          <div className="text-2xl sm:text-3xl font-serif font-bold text-indigo-950 dark:text-cyan-200 underline decoration-indigo-400/50 underline-offset-8">
            {progress.userProfile.username}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            For dedicated completion of hands-on cyber defense labs, progressive curriculum modules, and verified incident investigation missions.
          </p>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono gap-3">
            <span>ISSUED: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="text-indigo-600 dark:text-cyan-400 font-bold">VERIFICATION: CN-CERT-8849-AUTH</span>
            <span>RANK: {levelInfo.rankTitle.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
