import React, { useState } from 'react';
import { Binary, Filter, Download, ArrowDown, ChevronRight, Layers, Search } from 'lucide-react';
import { SAMPLE_PACKETS } from '../data/packetData';
import { PacketItem } from '../types';
import { useProgress } from '../context/ProgressContext';

export const PacketAnalyzerView: React.FC = () => {
  const { unlockAchievement } = useProgress();
  const [packets] = useState<PacketItem[]>(SAMPLE_PACKETS);
  const [selectedPacketId, setSelectedPacketId] = useState<number>(1);
  const [protocolFilter, setProtocolFilter] = useState<string>('All');
  const [filterQuery, setFilterQuery] = useState<string>('');

  const activePacket = packets.find(p => p.id === selectedPacketId) || packets[0];

  const filteredPackets = packets.filter(p => {
    if (protocolFilter !== 'All' && p.protocol !== protocolFilter) return false;
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      return (
        p.source.includes(q) ||
        p.destination.includes(q) ||
        p.info.toLowerCase().includes(q) ||
        p.protocol.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const protocols = ['All', 'ARP', 'DNS', 'TCP', 'TLSv1.3'];

  const handleSelectPacket = (p: PacketItem) => {
    setSelectedPacketId(p.id);
    unlockAchievement('packet-sniffer');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Binary className="w-4 h-4" />
              <span>Interactive Wireshark Protocol Dissector</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Network Packet Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Examine live packet captures. Dissect Ethernet frame headers, IPv4 addresses, TCP handshake flags, DNS transactions, and hexadecimal payloads.
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
            {protocols.map(proto => (
              <button
                key={proto}
                onClick={() => setProtocolFilter(proto)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  protocolFilter === proto
                    ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {proto}
              </button>
            ))}
          </div>
        </div>

        {/* Display Filter Input */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 font-mono">Wireshark Filter:</span>
          <input
            type="text"
            placeholder="e.g. ip.addr == 192.168.1.50 or tcp.port == 443"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            className="flex-1 text-xs font-mono p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Packet Stream Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">No.</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Source</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Protocol</th>
                <th className="py-2.5 px-3">Length</th>
                <th className="py-2.5 px-3">Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPackets.map(pkt => {
                const isSelected = pkt.id === activePacket.id;
                let protoColor = 'text-slate-600 dark:text-slate-300';
                if (pkt.protocol === 'TCP') protoColor = 'text-cyan-600 dark:text-cyan-400 font-bold';
                else if (pkt.protocol === 'DNS') protoColor = 'text-teal-600 dark:text-teal-400 font-bold';
                else if (pkt.protocol === 'ARP') protoColor = 'text-amber-600 dark:text-amber-400 font-bold';
                else if (pkt.protocol.includes('TLS')) protoColor = 'text-indigo-600 dark:text-indigo-400 font-bold';

                return (
                  <tr
                    key={pkt.id}
                    onClick={() => handleSelectPacket(pkt)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-50 dark:bg-cyan-950/60 font-semibold text-slate-900 dark:text-white'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <td className="py-2 px-3 text-slate-400">{pkt.id}</td>
                    <td className="py-2 px-3">{pkt.time}</td>
                    <td className="py-2 px-3">{pkt.source}</td>
                    <td className="py-2 px-3">{pkt.destination}</td>
                    <td className={`py-2 px-3 ${protoColor}`}>{pkt.protocol}</td>
                    <td className="py-2 px-3 tabular-nums">{pkt.length}</td>
                    <td className="py-2 px-3 font-sans truncate max-w-xs">{pkt.info}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Packet Deep Layer Tree & Hex Dump */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Layer Tree */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Packet Layer Dissection (Frame #{activePacket.id})</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Physical / Frame Layer</span>
              <span className="text-slate-800 dark:text-slate-200">{activePacket.layers.frame}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Data Link (Ethernet II)</span>
              <span className="text-slate-800 dark:text-slate-200">{activePacket.layers.ethernet}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Network Layer (IPv4 / ARP)</span>
              <span className="text-slate-800 dark:text-slate-200">{activePacket.layers.ip}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Transport Layer (TCP / UDP)</span>
              <span className="text-slate-800 dark:text-slate-200">{activePacket.layers.transport}</span>
            </div>

            {activePacket.layers.payload && (
              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
                <span className="text-indigo-600 dark:text-indigo-400 block text-[10px] uppercase font-bold">Application Payload</span>
                <span className="text-indigo-950 dark:text-indigo-200">{activePacket.layers.payload}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hex & ASCII Dump View */}
        <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <span className="font-bold text-cyan-400">HEXADECIMAL / ASCII DUMP</span>
            <span>{activePacket.length} BYTES</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] leading-relaxed break-all text-emerald-400 select-all max-h-80 overflow-y-auto">
            {activePacket.hexDump.match(/.{1,32}/g)?.map((chunk, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-slate-500">{(i * 16).toString(16).padStart(4, '0')}:</span>
                <span className="text-cyan-300">{chunk.match(/.{1,2}/g)?.join(' ')}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            Bytes 0–13 represent the Ethernet II frame header (Destination MAC, Source MAC, EtherType 0x0800). Bytes 14–33 decode IPv4 headers with TTL and checksum.
          </p>
        </div>
      </div>
    </div>
  );
};
