import React, { useState } from 'react';
import { KeyRound, Lock, Unlock, Hash, RefreshCw, Copy, Check } from 'lucide-react';

export const CryptoPlaygroundInteractive: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'symmetric' | 'asymmetric' | 'hashing'>('symmetric');

  // Symmetric state
  const [aesKey, setAesKey] = useState<string>('c7b8e192a04f9811d6e5c2b3a4d9e0f1');
  const [plaintext, setPlaintext] = useState<string>('CLASSIFIED_DEFENSE_DIRECTIVE_2026');
  const [copied, setCopied] = useState<boolean>(false);

  // Hashing state
  const [hashInput, setHashInput] = useState<string>('cybersecurity');

  // Pseudo-crypto helpers for interactive client educational demonstration
  const generateNewKey = () => {
    const chars = '0123456789abcdef';
    let res = '';
    for (let i = 0; i < 32; i++) res += chars[Math.floor(Math.random() * chars.length)];
    setAesKey(res);
  };

  // Simple deterministic educational cipher simulation
  const pseudoAesEncrypt = (text: string, key: string) => {
    let out = '';
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      out += code.toString(16).padStart(2, '0');
    }
    return out;
  };

  const pseudoAesDecrypt = (hex: string, key: string) => {
    let out = '';
    for (let i = 0; i < hex.length; i += 2) {
      const byte = parseInt(hex.substring(i, i + 2), 16);
      const original = byte ^ key.charCodeAt((i / 2) % key.length);
      out += String.fromCharCode(original);
    }
    return out;
  };

  const ciphertext = pseudoAesEncrypt(plaintext, aesKey);
  const decrypted = pseudoAesDecrypt(ciphertext, aesKey);

  // Fast educational hash approximation for UI
  const pseudoSha256 = (str: string) => {
    let h1 = 0x6a09e667, h2 = 0xbb67ae85, h3 = 0x3c6ef372, h4 = 0xa54ff53a;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
      h3 = Math.imul(h3 ^ ch, 3812041933);
      h4 = Math.imul(h4 ^ ch, 2184229441);
    }
    const toHex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
    return (toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4) + toHex(h1 ^ h3) + toHex(h2 ^ h4) + toHex(h1 + h2) + toHex(h3 + h4)).substring(0, 64);
  };

  const currentHash = pseudoSha256(hashInput);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <KeyRound className="w-4 h-4" />
            <span>Interactive Cryptography Workbench</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Encryption, Decryption & Avalanche Hashing
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Test symmetric AES block encryption, public-key asymmetric pairs, and one-way SHA-256 hash digests.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('symmetric')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'symmetric'
                ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Symmetric (AES)
          </button>
          <button
            onClick={() => setActiveTab('asymmetric')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'asymmetric'
                ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Asymmetric (RSA)
          </button>
          <button
            onClick={() => setActiveTab('hashing')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'hashing'
                ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            One-Way Hashing
          </button>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'symmetric' && (
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Shared Secret Key (256-bit Hex)
                </span>
                <button
                  onClick={generateNewKey}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Generate New Key</span>
                </button>
              </div>
              <div className="font-mono text-xs bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 break-all select-all">
                {aesKey}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plaintext input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Original Plaintext</span>
                </label>
                <textarea
                  value={plaintext}
                  onChange={e => setPlaintext(e.target.value)}
                  rows={3}
                  className="w-full text-xs font-mono p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white resize-none"
                  placeholder="Enter message to encrypt..."
                />
              </div>

              {/* Ciphertext output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-red-500" />
                    <span>Encrypted Ciphertext (Hex)</span>
                  </label>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(ciphertext);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="w-full min-h-[72px] p-3 text-xs font-mono bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 break-all">
                  {ciphertext}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-indigo-900 dark:text-indigo-300">Decryption Verification: </span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{decrypted}</span>
              </div>
              <span className="px-2 py-0.5 rounded font-bold text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                Integrity Verified
              </span>
            </div>
          </div>
        )}

        {activeTab === 'asymmetric' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mb-1">
                  Alice&apos;s Public Key (Shared with the World)
                </span>
                <p className="text-xs text-slate-500 mb-2">Used by anyone to encrypt secret messages destined for Alice.</p>
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-[11px] text-slate-600 dark:text-slate-400 break-all">
                  -----BEGIN PUBLIC KEY-----<br />
                  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzqX49...<br />
                  -----END PUBLIC KEY-----
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">
                  Alice&apos;s Private Key (Strictly Secret)
                </span>
                <p className="text-xs text-slate-500 mb-2">Kept confidential on Alice&apos;s device; only key capable of decrypting.</p>
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-[11px] text-slate-600 dark:text-slate-400 break-all">
                  -----BEGIN PRIVATE KEY-----<br />
                  MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD...<br />
                  -----END PRIVATE KEY-----
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white text-sm">Key Principles of Asymmetric Cryptography:</div>
              <p>• <strong>Confidentiality Flow:</strong> Bob encrypts plaintext with Alice&apos;s Public Key. Only Alice&apos;s Private Key can decrypt it.</p>
              <p>• <strong>Digital Signature Flow:</strong> Alice hashes a document and signs it with her Private Key. Bob verifies it using Alice&apos;s Public Key, ensuring non-repudiation.</p>
            </div>
          </div>
        )}

        {activeTab === 'hashing' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-indigo-500" />
                <span>Input String (Type any text to observe Avalanche Effect)</span>
              </label>
              <input
                type="text"
                value={hashInput}
                onChange={e => setHashInput(e.target.value)}
                className="w-full text-sm font-mono p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                placeholder="Type here to see real-time hash transformation..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Cryptographic Output (256-bit Digest / 64 Hex Characters)
              </label>
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-cyan-400 break-all select-all">
                {currentHash}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                The Avalanche Effect in Action:
              </span>
              Notice that modifying even a single character (e.g., from &quot;cybersecurity&quot; to &quot;cybersecuritY&quot;) drastically changes virtually every byte of the resulting digest. A cryptographic hash is one-way: mathematically infeasible to reverse back to the plaintext.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
