import React, { useState } from 'react';
import { Layers, Shield, AlertTriangle, ArrowDown, ArrowUp, Info } from 'lucide-react';

interface OsiLayer {
  number: number;
  name: string;
  pdu: string;
  protocols: string[];
  attacks: string[];
  defenses: string[];
  description: string;
  color: string;
}

const OSI_LAYERS: OsiLayer[] = [
  {
    number: 7,
    name: 'Application',
    pdu: 'Data',
    protocols: ['HTTP/HTTPS', 'DNS', 'SSH', 'FTP', 'SMTP'],
    attacks: ['SQL Injection', 'Cross-Site Scripting (XSS)', 'CSRF', 'Credential Stuffing'],
    defenses: ['Web Application Firewall (WAF)', 'Input Validation', 'Parameterized Queries', 'MFA'],
    description: 'Closest to the end user. Directly interacts with software applications (web browsers, email clients) to facilitate human-computer communications.',
    color: 'from-violet-500 to-purple-600'
  },
  {
    number: 6,
    name: 'Presentation',
    pdu: 'Data',
    protocols: ['TLS/SSL', 'ASCII', 'JPEG', 'MPEG', 'JSON'],
    attacks: ['SSL Stripping', 'Downgrade Attacks', 'MIME Sniffing', 'Format String Bugs'],
    defenses: ['Strict Transport Security (HSTS)', 'TLS 1.3 Enforcement', 'Safe Serializers'],
    description: 'Translates, encrypts, and compresses data so that software applications can properly interpret incoming and outgoing network payloads.',
    color: 'from-indigo-500 to-violet-600'
  },
  {
    number: 5,
    name: 'Session',
    pdu: 'Data',
    protocols: ['RPC', 'NetBIOS', 'PPTP', 'SOCKS'],
    attacks: ['Session Hijacking', 'Session Fixation', 'Man-in-the-Middle (MITM)'],
    defenses: ['Cryptographically Random Session IDs', 'HttpOnly & Secure Cookie Flags', 'Short Token TTL'],
    description: 'Manages the establishment, maintenance, coordination, and termination of persistent communication sessions between local and remote applications.',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    number: 4,
    name: 'Transport',
    pdu: 'Segment / Datagram',
    protocols: ['TCP', 'UDP', 'QUIC', 'SCTP'],
    attacks: ['TCP SYN Flood', 'UDP Amplification DDoS', 'Port Scanning', 'RST Injection'],
    defenses: ['TCP SYN Cookies', 'Rate Limiting', 'Stateful Firewalls', 'Connection Backlog Tuning'],
    description: 'Provides transparent transfer of data between end systems with error recovery, flow control, and reliable delivery (TCP) or low latency (UDP).',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    number: 3,
    name: 'Network',
    pdu: 'Packet',
    protocols: ['IPv4', 'IPv6', 'ICMP', 'IPsec', 'BGP', 'OSPF'],
    attacks: ['IP Spoofing', 'ICMP Smurf Attacks', 'BGP Hijacking', 'Route Injection'],
    defenses: ['Router Access Control Lists (ACLs)', 'uRPF (Unicast Reverse Path Forwarding)', 'IPsec Encryption', 'BGP RPKI'],
    description: 'Responsible for logical device addressing, subnetting, path determination, packet fragmentation, and routing across distributed network boundaries.',
    color: 'from-teal-500 to-cyan-600'
  },
  {
    number: 2,
    name: 'Data Link',
    pdu: 'Frame',
    protocols: ['Ethernet (802.3)', 'Wi-Fi (802.11)', 'ARP', 'VLAN (802.1Q)', 'PPP'],
    attacks: ['ARP Poisoning / Spoofing', 'MAC Flooding', 'VLAN Hopping', 'Rogue APs'],
    defenses: ['Dynamic ARP Inspection (DAI)', 'Port Security (Sticky MAC)', '802.1X Port Authentication', 'WPA3 Enterprise'],
    description: 'Handles node-to-node data transfer across physical local links, frame synchronization, physical MAC hardware addressing, and error detection.',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    number: 1,
    name: 'Physical',
    pdu: 'Bits',
    protocols: ['1000BASE-T', 'Fiber Optic', 'Radio Frequency', 'DSL', 'USB'],
    attacks: ['Physical Wiretapping', 'Signal Jamming', 'Evil Maid Hardware Implants', 'Cable Severing'],
    defenses: ['Physical Access Control', 'Conduit Shielding', 'Tamper-Evident Seals', 'Fiber Optic Intrusion Monitoring'],
    description: 'Transmits unstructured raw bit streams over physical transmission mediums (copper wire, fiber optics, radio frequencies, airwaves).',
    color: 'from-amber-500 to-emerald-600'
  }
];

export const OsiModelInteractive: React.FC = () => {
  const [selectedLayerNum, setSelectedLayerNum] = useState<number>(7);
  const [flowDirection, setFlowDirection] = useState<'encapsulate' | 'decapsulate'>('encapsulate');

  const selectedLayer = OSI_LAYERS.find(l => l.number === selectedLayerNum) || OSI_LAYERS[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Layers className="w-4 h-4" />
            <span>Interactive Protocol Visualizer</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            The OSI 7-Layer Architecture & Threat Surface
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select any layer to inspect its Protocol Data Unit (PDU), standard protocols, vulnerability vectors, and defense controls.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setFlowDirection('encapsulate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              flowDirection === 'encapsulate'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Encapsulation (L7 → L1)</span>
          </button>
          <button
            onClick={() => setFlowDirection('decapsulate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              flowDirection === 'decapsulate'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Decapsulation (L1 → L7)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Layer Stack */}
        <div className="lg:col-span-5 space-y-2">
          {OSI_LAYERS.map(layer => {
            const isSelected = layer.number === selectedLayerNum;
            return (
              <button
                key={layer.number}
                onClick={() => setSelectedLayerNum(layer.number)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white bg-gradient-to-br ${layer.color} shadow-sm shrink-0`}
                  >
                    L{layer.number}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{layer.name}</span>
                      <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                        ({layer.pdu})
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {layer.protocols.slice(0, 3).join(', ')}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-mono font-medium text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {isSelected ? 'ACTIVE' : 'INSPECT'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Layer Deep Dive Inspector */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <span
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm text-white bg-gradient-to-br ${selectedLayer.color}`}
                >
                  L{selectedLayer.number}
                </span>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    Layer {selectedLayer.number}: {selectedLayer.name} Layer
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Protocol Data Unit (PDU): <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{selectedLayer.pdu}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              {selectedLayer.description}
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                  Common Protocols & Standards
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLayer.protocols.map((p, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Attack Vectors */}
                <div className="bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider mb-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Attack Vectors</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {selectedLayer.attacks.map((atk, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{atk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Defenses */}
                <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Defensive Controls</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {selectedLayer.defenses.map((def, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{def}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              <span>Flow model: {flowDirection === 'encapsulate' ? 'Outgoing packet headers added downwards' : 'Incoming frames parsed upwards'}</span>
            </span>
            <button
              onClick={() => {
                const next = selectedLayerNum === 1 ? 7 : selectedLayerNum - 1;
                setSelectedLayerNum(next);
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Next Layer →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
