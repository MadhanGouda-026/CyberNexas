import { PacketItem } from '../types';

export const SAMPLE_PACKETS: PacketItem[] = [
  {
    id: 1,
    time: '0.000000',
    source: '192.168.1.50',
    destination: '192.168.1.1',
    protocol: 'ARP',
    length: 42,
    info: 'Who has 192.168.1.1? Tell 192.168.1.50',
    hexDump: 'ffffffffffff000c294f8e3208060001080006040001000c294f8e32c0a80132000000000000c0a80101',
    layers: {
      frame: 'Frame 1: 42 bytes on wire (336 bits), 42 bytes captured on interface eth0',
      ethernet: 'Ethernet II, Src: VMware_4f:8e:32 (00:0c:29:4f:8e:32), Dst: Broadcast (ff:ff:ff:ff:ff:ff)',
      ip: 'Address Resolution Protocol (request)',
      transport: 'Hardware type: Ethernet (1), Protocol type: IPv4 (0x0800), Hardware size: 6, Protocol size: 4',
      payload: 'Sender MAC: 00:0c:29:4f:8e:32, Sender IP: 192.168.1.50, Target MAC: 00:00:00:00:00:00, Target IP: 192.168.1.1'
    }
  },
  {
    id: 2,
    time: '0.000412',
    source: '192.168.1.1',
    destination: '192.168.1.50',
    protocol: 'ARP',
    length: 42,
    info: '192.168.1.1 is at 00:50:56:c0:00:08',
    hexDump: '000c294f8e32005056c0000808060001080006040002005056c00008c0a80101000c294f8e32c0a80132',
    layers: {
      frame: 'Frame 2: 42 bytes on wire (336 bits), 42 bytes captured on interface eth0',
      ethernet: 'Ethernet II, Src: Gateway_c0:00:08 (00:50:56:c0:00:08), Dst: VMware_4f:8e:32 (00:0c:29:4f:8e:32)',
      ip: 'Address Resolution Protocol (reply)',
      transport: 'Hardware type: Ethernet (1), Protocol type: IPv4 (0x0800), Opcode: reply (2)',
      payload: 'Sender MAC: 00:50:56:c0:00:08, Sender IP: 192.168.1.1, Target MAC: 00:0c:29:4f:8e:32, Target IP: 192.168.1.50'
    }
  },
  {
    id: 3,
    time: '0.012540',
    source: '192.168.1.50',
    destination: '8.8.8.8',
    protocol: 'DNS',
    length: 74,
    info: 'Standard query 0x1a2b A cyb-defense.org',
    hexDump: '005056c00008000c294f8e3208004500003c7a1040004011e4f4c0a8013208080808c1020035002821a21a2b010000010000000000000b6379622d646566656e7365036f72670000010001',
    layers: {
      frame: 'Frame 3: 74 bytes on wire (592 bits), 74 bytes captured on interface eth0',
      ethernet: 'Ethernet II, Src: 00:0c:29:4f:8e:32, Dst: 00:50:56:c0:00:08',
      ip: 'Internet Protocol Version 4, Src: 192.168.1.50, Dst: 8.8.8.8, TTL: 64, Protocol: UDP (17)',
      transport: 'User Datagram Protocol, Src Port: 49410, Dst Port: 53, Length: 40',
      payload: 'Domain Name System (query): Transaction ID: 0x1a2b, Flags: 0x0100 (Standard query), Query: cyb-defense.org: type A, class IN'
    }
  },
  {
    id: 4,
    time: '0.028910',
    source: '8.8.8.8',
    destination: '192.168.1.50',
    protocol: 'DNS',
    length: 90,
    info: 'Standard query response 0x1a2b A cyb-defense.org A 104.21.44.82',
    hexDump: '000c294f8e32005056c0000808004500004c2b184000361132e008080808c0a801320035c10200388a101a2b818000010001000000000b6379622d646566656e7365036f72670000010001c00c000100010000012c000468152c52',
    layers: {
      frame: 'Frame 4: 90 bytes on wire (720 bits), 90 bytes captured on interface eth0',
      ethernet: 'Ethernet II, Src: 00:50:56:c0:00:08, Dst: 00:0c:29:4f:8e:32',
      ip: 'Internet Protocol Version 4, Src: 8.8.8.8, Dst: 192.168.1.50, TTL: 54, Protocol: UDP (17)',
      transport: 'User Datagram Protocol, Src Port: 53, Dst Port: 49410, Length: 56',
      payload: 'DNS Response: Answers: cyb-defense.org: type A, class IN, addr 104.21.44.82, TTL: 300'
    }
  },
  {
    id: 5,
    time: '0.035120',
    source: '192.168.1.50',
    destination: '104.21.44.82',
    protocol: 'TCP',
    length: 66,
    info: '49412 → 443 [SYN] Seq=0 Win=64240 Len=0 MSS=1460 WS=256 SACK_PERM=1',
    hexDump: '005056c00008000c294f8e32080045000034a1b240004006bd5dc0a8013268152c52c10401bb1337beef000000008002faf051b40000020405b40103030801010402',
    layers: {
      frame: 'Frame 5: 66 bytes on wire (528 bits), 66 bytes captured on interface eth0',
      ethernet: 'Ethernet II, Src: 00:0c:29:4f:8e:32, Dst: 00:50:56:c0:00:08',
      ip: 'Internet Protocol Version 4, Src: 192.168.1.50, Dst: 104.21.44.82, TTL: 64, Protocol: TCP (6)',
      transport: 'Transmission Control Protocol, Src Port: 49412, Dst Port: 443 (HTTPS), Seq: 0 (relative), Flags: 0x002 (SYN)',
      payload: 'TCP Options: (MSS: 1460, NOP, WS: 256, NOP, NOP, SACK permitted)'
    }
  },
  {
    id: 6,
    time: '0.048700',
    source: '104.21.44.82',
    destination: '192.168.1.50',
    protocol: 'TCP',
    length: 66,
    info: '443 → 49412 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0 MSS=1430',
    hexDump: '000c294f8e32005056c000080800450000340000400037065f1068152c52c0a8013201bbc1048899aabb1337bef08012ffff2d4b0000020405960101040201030307',
    layers: {
      frame: 'Frame 6: 66 bytes on wire, 66 bytes captured',
      ethernet: 'Ethernet II, Src: 00:50:56:c0:00:08, Dst: 00:0c:29:4f:8e:32',
      ip: 'Internet Protocol Version 4, Src: 104.21.44.82, Dst: 192.168.1.50, TTL: 55, Protocol: TCP (6)',
      transport: 'Transmission Control Protocol, Src Port: 443, Dst Port: 49412, Seq: 0, Ack: 1, Flags: 0x012 (SYN, ACK)',
      payload: 'Server Initial Sequence Number: 0x8899aabb, Acknowledging Client Seq + 1'
    }
  },
  {
    id: 7,
    time: '0.049010',
    source: '192.168.1.50',
    destination: '104.21.44.82',
    protocol: 'TCP',
    length: 54,
    info: '49412 → 443 [ACK] Seq=1 Ack=1 Win=64240 Len=0',
    hexDump: '005056c00008000c294f8e32080045000028a1b340004006bd68c0a8013268152c52c10401bb1337bef08899aabc5010faf012340000',
    layers: {
      frame: 'Frame 7: 54 bytes on wire (Handshake Complete)',
      ethernet: 'Ethernet II, Src: 00:0c:29:4f:8e:32, Dst: 00:50:56:c0:00:08',
      ip: 'Internet Protocol Version 4, Src: 192.168.1.50, Dst: 104.21.44.82, TTL: 64',
      transport: 'Transmission Control Protocol, Src Port: 49412, Dst Port: 443, Seq: 1, Ack: 1, Flags: 0x010 (ACK)',
      payload: 'Connection State: ESTABLISHED'
    }
  },
  {
    id: 8,
    time: '0.052100',
    source: '192.168.1.50',
    destination: '104.21.44.82',
    protocol: 'TLSv1.3',
    length: 517,
    info: 'Client Hello (SNI=cyb-defense.org, Supported Cipher: TLS_AES_256_GCM_SHA384)',
    hexDump: '16030101d0010001cc03037f8e...002f0035009c...00000013001100000e6379622d646566656e73652e6f7267',
    layers: {
      frame: 'Frame 8: 517 bytes on wire, Encrypted Session Handshake',
      ethernet: 'Ethernet II, Src: 00:0c:29:4f:8e:32, Dst: 00:50:56:c0:00:08',
      ip: 'Internet Protocol Version 4, Src: 192.168.1.50, Dst: 104.21.44.82, Length: 503',
      transport: 'Transport Layer Security: TLSv1.3 Record Layer: Handshake Protocol: Client Hello',
      payload: 'Extension: server_name (len=19) -> cyb-defense.org, KeyShare: X25519, Supported Versions: TLS 1.3, TLS 1.2'
    }
  }
];
