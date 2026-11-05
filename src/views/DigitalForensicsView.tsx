import React, { useState } from 'react';
import { Search, Hash, FileText, CheckCircle2, ShieldCheck, Camera, FileCode, Clock } from 'lucide-react';

export const DigitalForensicsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'artifacts' | 'hashcalc' | 'chain'>('artifacts');

  // Artifact inspector
  const [selectedArtifact, setSelectedArtifact] = useState<string>('invoice');

  // Hash calculator input
  const [hashInput, setHashInput] = useState<string>('Confidential Corporate Payload 2026');

  const artifacts = [
    {
      id: 'invoice',
      name: 'Invoice_Q3_9942.docm',
      fileType: 'Microsoft Word Macro-Enabled Document',
      fileSize: '48,210 Bytes',
      sha256: '7b8f9e12a4c03d15e98214fa3369b720448100acb92ef114a80271189c4d5192',
      md5: 'e1d2c3b4a59081726354433221100ff9',
      metadata: [
        { key: 'Author', value: 'billing-admin' },
        { key: 'Template', value: 'Normal.dotm' },
        { key: 'Macro Project', value: 'VBA_Project (AutoOpen execution string)' },
        { key: 'Creation Date', value: '2026-11-04 08:35:10 UTC' },
        { key: 'Last Modified By', value: 'external-mailer' }
      ],
      findings: 'Embedded VBA macro contains downloader script targeting 185.220.101.45 to fetch secondary payload into %TEMP% directory.'
    },
    {
      id: 'photo',
      name: 'classified_blueprint.jpg',
      fileType: 'JPEG Image File',
      fileSize: '1,420,110 Bytes',
      sha256: '4f2109ba87654321fedcba09876543211234567890abcdef1234567890abcdef',
      md5: 'a94f83b276c19de0f3b41299e12089aa',
      metadata: [
        { key: 'Camera Model', value: 'Sony Alpha A7 IV' },
        { key: 'Software', value: 'Adobe Photoshop 2026' },
        { key: 'GPS Latitude', value: '37° 46\' 29.8" N' },
        { key: 'GPS Longitude', value: '122° 25\' 09.4" W' },
        { key: 'User Comment', value: 'Q057ZXhpZl9tM3RhZDR0YV9sMzRrXzIwMjZ9 (Base64 Secret)' }
      ],
      findings: 'EXIF metadata retains precise GPS geolocation coordinates and a hidden base64 string in the user comment field.'
    }
  ];

  const activeArt = artifacts.find(a => a.id === selectedArtifact) || artifacts[0];

  // Fast educational hash
  const computeHash = (input: string, algo: 'sha256' | 'md5') => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return algo === 'md5'
      ? (hex + hex + hex + hex).substring(0, 32)
      : (hex + hex + hex + hex + hex + hex + hex + hex).substring(0, 64);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Search className="w-4 h-4" />
              <span>Digital Forensics & Incident Reconstruction</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Digital Forensics & Evidence Laboratory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Examine file metadata, verify cryptographic checksum integrity, parse EXIF camera artifacts, and maintain legal chain of custody.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
            <button
              onClick={() => setActiveTab('artifacts')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'artifacts'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Artifact Examiner
            </button>
            <button
              onClick={() => setActiveTab('hashcalc')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'hashcalc'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Hash Integrity
            </button>
            <button
              onClick={() => setActiveTab('chain')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'chain'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Chain of Custody
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'artifacts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Artifact List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Seized Digital Exhibits (2)
            </div>

            {artifacts.map(art => (
              <button
                key={art.id}
                onClick={() => setSelectedArtifact(art.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedArtifact === art.id
                    ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 ring-1 ring-purple-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{art.name}</h4>
                    <span className="text-xs text-slate-400">{art.fileSize}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Artifact Deep Inspector */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Forensic Examination Record
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeArt.name}
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {activeArt.fileType}
              </span>
            </div>

            {/* Checksums */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Cryptographic Checksums (Proof of Integrity)
              </span>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs space-y-1 select-all">
                <div><span className="text-slate-400">SHA-256: </span><span className="text-indigo-600 dark:text-cyan-400">{activeArt.sha256}</span></div>
                <div><span className="text-slate-400">MD5:     </span><span className="text-slate-700 dark:text-slate-300">{activeArt.md5}</span></div>
              </div>
            </div>

            {/* Metadata Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Extracted Metadata (EXIF & Document Properties)
              </span>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {activeArt.metadata.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 font-bold text-slate-500 w-1/3">{m.key}</td>
                        <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200">{m.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Forensic Finding */}
            <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold text-purple-900 dark:text-purple-300 block mb-1">
                Forensic Investigator Opinion:
              </span>
              {activeArt.findings}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hashcalc' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Live Cryptographic Hash Generator
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Forensic investigators rely on SHA-256 and MD5 hashing before and after examining digital disk images to establish that digital evidence has not been tampered with.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Input String / Simulated File Byte Stream
            </label>
            <textarea
              rows={3}
              value={hashInput}
              onChange={e => setHashInput(e.target.value)}
              className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-950 text-cyan-400 rounded-xl border border-slate-800 select-all">
              <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold mb-1">SHA-256 Digest (256 bits)</span>
              {computeHash(hashInput, 'sha256')}
            </div>

            <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl border border-slate-800 select-all">
              <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold mb-1">MD5 Digest (128 bits)</span>
              {computeHash(hashInput, 'md5')}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chain' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Digital Evidence Chain of Custody Record
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            The legal ledger recording every individual who collected, handled, transferred, analyzed, or stored digital evidence to guarantee courtroom admissibility.
          </p>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl mt-4">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Date / Time (UTC)</th>
                  <th className="py-2.5 px-3">Item ID</th>
                  <th className="py-2.5 px-3">Custodian</th>
                  <th className="py-2.5 px-3">Action Taken</th>
                  <th className="py-2.5 px-3">Hash Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-slate-500">2026-11-04 08:45:00</td>
                  <td className="py-2.5 px-3 font-bold text-indigo-600">EX-01</td>
                  <td className="py-2.5 px-3">Lead Officer S. Ramos</td>
                  <td className="py-2.5 px-3 font-sans">Seized workstation drive into anti-static bag</td>
                  <td className="py-2.5 px-3 text-emerald-500 font-bold">MATCH (SHA256)</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-slate-500">2026-11-04 09:30:15</td>
                  <td className="py-2.5 px-3 font-bold text-indigo-600">EX-01</td>
                  <td className="py-2.5 px-3">Analyst K. Mercer</td>
                  <td className="py-2.5 px-3 font-sans">Created bitstream raw forensic image via write-blocker</td>
                  <td className="py-2.5 px-3 text-emerald-500 font-bold">MATCH (SHA256)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
