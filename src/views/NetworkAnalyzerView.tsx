import React, { useState } from 'react';
import { Network, Server, Laptop, Shield, Play, ArrowRight, Activity, Calculator } from 'lucide-react';

export const NetworkAnalyzerView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'topology' | 'subnet' | 'diagnostics'>('topology');

  // Diagnostics simulator state
  const [diagTool, setDiagTool] = useState<'ping' | 'traceroute'>('traceroute');
  const [targetHost, setTargetHost] = useState<string>('defense.cybernexus.org');
  const [diagOutput, setDiagOutput] = useState<string[]>([]);
  const [isRunningDiag, setIsRunningDiag] = useState<boolean>(false);

  // Subnet calculator state
  const [cidrInput, setCidrInput] = useState<string>('192.168.1.0/24');

  const nodes = [
    { id: 'gw', name: 'Edge Firewall Gateway', ip: '198.51.100.1 / 10.0.0.1', type: 'firewall', status: 'ONLINE', icon: Shield },
    { id: 'web', name: 'DMZ Web Server', ip: '10.0.1.80', type: 'server', status: 'ONLINE', icon: Server },
    { id: 'db', name: 'Internal DB Cluster', ip: '10.0.3.50', type: 'server', status: 'PROTECTED', icon: Server },
    { id: 'ws1', name: 'Finance Workstation 01', ip: '10.0.2.14', type: 'client', status: 'ONLINE', icon: Laptop },
    { id: 'ws2', name: 'SOC Analyst Terminal', ip: '10.0.2.45', type: 'client', status: 'ONLINE', icon: Laptop }
  ];

  const handleRunDiagnostic = () => {
    setIsRunningDiag(true);
    setDiagOutput([]);

    if (diagTool === 'ping') {
      const logs = [
        `PING ${targetHost} (104.21.44.82) 56(84) bytes of data.`,
        `64 bytes from 104.21.44.82: icmp_seq=1 ttl=56 time=14.2 ms`,
        `64 bytes from 104.21.44.82: icmp_seq=2 ttl=56 time=13.8 ms`,
        `64 bytes from 104.21.44.82: icmp_seq=3 ttl=56 time=14.1 ms`,
        `64 bytes from 104.21.44.82: icmp_seq=4 ttl=56 time=14.5 ms`,
        `--- ${targetHost} ping statistics ---`,
        `4 packets transmitted, 4 received, 0% packet loss, time 3004ms`,
        `rtt min/avg/max/mdev = 13.8/14.15/14.5/0.24 ms`
      ];
      logs.forEach((line, i) => {
        setTimeout(() => {
          setDiagOutput(prev => [...prev, line]);
          if (i === logs.length - 1) setIsRunningDiag(false);
        }, i * 350);
      });
    } else {
      const hops = [
        `traceroute to ${targetHost} (104.21.44.82), 30 hops max, 60 byte packets`,
        ` 1  gateway.local (10.0.0.1)  0.842 ms  0.720 ms  0.690 ms`,
        ` 2  edge-router.isp.net (198.51.100.254)  2.410 ms  2.320 ms  2.190 ms`,
        ` 3  backbone-core.carrier.org (172.16.88.1)  6.120 ms  5.980 ms  5.890 ms`,
        ` 4  cloudflare-transit.net (195.66.225.10)  12.450 ms  12.110 ms  11.900 ms`,
        ` 5  104.21.44.82 (defense.cybernexus.org)  14.210 ms  14.050 ms  13.980 ms`
      ];
      hops.forEach((line, i) => {
        setTimeout(() => {
          setDiagOutput(prev => [...prev, line]);
          if (i === hops.length - 1) setIsRunningDiag(false);
        }, i * 400);
      });
    }
  };

  // Subnet calculations
  const calculateSubnet = (cidr: string) => {
    try {
      const [ip, maskStr] = cidr.split('/');
      const mask = parseInt(maskStr, 10);
      if (isNaN(mask) || mask < 1 || mask > 32) throw new Error();

      const totalHosts = Math.pow(2, 32 - mask);
      const usableHosts = mask >= 31 ? 0 : totalHosts - 2;

      // Netmask octets
      const maskBin = '1'.repeat(mask) + '0'.repeat(32 - mask);
      const netmask = [
        parseInt(maskBin.substring(0, 8), 2),
        parseInt(maskBin.substring(8, 16), 2),
        parseInt(maskBin.substring(16, 24), 2),
        parseInt(maskBin.substring(24, 32), 2)
      ].join('.');

      return {
        ip,
        mask,
        netmask,
        wildcard: netmask.split('.').map(o => 255 - parseInt(o, 10)).join('.'),
        totalHosts,
        usableHosts
      };
    } catch {
      return null;
    }
  };

  const subnetInfo = calculateSubnet(cidrInput);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Network className="w-4 h-4" />
              <span>Interactive Network Architecture</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Network Topology & Route Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Explore segmented subnets, simulate hop-by-hop traceroutes, and calculate IPv4 address boundaries.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
            <button
              onClick={() => setActiveTab('topology')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'topology'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Topology Map
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'diagnostics'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Ping / Traceroute
            </button>
            <button
              onClick={() => setActiveTab('subnet')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'subnet'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-cyan-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Subnet Calculator
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'topology' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Enterprise Network Segment Fabric (802.1Q VLANs)
            </h3>
            <span className="text-xs font-mono text-emerald-500 font-bold">5 ACTIVE HOSTS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map(n => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {n.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{n.name}</h4>
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{n.ip}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <span className="font-bold text-indigo-900 dark:text-indigo-300 block">Segmentation Architecture:</span>
            <span>VLAN 10 (DMZ: 10.0.1.0/24) is strictly isolated from VLAN 20 (Corporate Workstations: 10.0.2.0/24) via stateful firewall inspection policies to prevent lateral movement.</span>
          </div>
        </div>
      )}

      {activeTab === 'diagnostics' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Tool</label>
              <select
                value={diagTool}
                onChange={e => setDiagTool(e.target.value as any)}
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="traceroute">traceroute (Path Discovery)</option>
                <option value="ping">ping (ICMP Echo RTT)</option>
              </select>
            </div>

            <div className="sm:col-span-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Target Host or IP</label>
              <input
                type="text"
                value={targetHost}
                onChange={e => setTargetHost(e.target.value)}
                className="w-full text-xs font-mono p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                disabled={isRunningDiag}
                onClick={handleRunDiagnostic}
                className="w-full flex items-center justify-center gap-1.5 p-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-all shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunningDiag ? 'Executing...' : 'Run Diagnostic'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-950 text-cyan-400 font-mono text-xs rounded-xl border border-slate-800 min-h-60 space-y-1 select-all overflow-x-auto">
            {diagOutput.length > 0 ? (
              diagOutput.map((line, i) => (
                <div key={i} className="leading-relaxed">{line}</div>
              ))
            ) : (
              <div className="text-slate-500">Click &quot;Run Diagnostic&quot; to trace path and measure round-trip time.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'subnet' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Enter IPv4 Subnet in CIDR Notation:
            </label>
            <input
              type="text"
              value={cidrInput}
              onChange={e => setCidrInput(e.target.value)}
              placeholder="e.g. 192.168.1.0/24 or 10.0.0.0/16"
              className="text-sm font-mono p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white max-w-md w-full"
            />
          </div>

          {subnetInfo ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono text-xs">
                <span className="text-slate-400 block mb-1">Subnet Mask:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{subnetInfo.netmask}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono text-xs">
                <span className="text-slate-400 block mb-1">Wildcard Mask:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{subnetInfo.wildcard}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono text-xs">
                <span className="text-slate-400 block mb-1">Usable Host Count:</span>
                <span className="font-bold text-indigo-600 dark:text-cyan-400 text-sm">{subnetInfo.usableHosts.toLocaleString()} Hosts</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono text-xs">
                <span className="text-slate-400 block mb-1">CIDR Prefix:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">/{subnetInfo.mask}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-rose-500 font-semibold">
              Invalid CIDR. Please provide format: IP/prefix (e.g. 192.168.1.0/24).
            </div>
          )}
        </div>
      )}
    </div>
  );
};
