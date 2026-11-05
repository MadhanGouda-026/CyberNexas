export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  description: string;
  detection: string;
  mitigation: string;
}

export interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  origin: string;
  motivation: string;
  targetSectors: string[];
  notableTTPs: string[];
  signatureTools: string[];
  description: string;
}

export interface IOCEntry {
  type: 'IP' | 'Domain' | 'SHA-256' | 'CVE';
  value: string;
  threatActor: string;
  malwareFamily: string;
  confidence: 'Low' | 'Medium' | 'High';
  firstSeen: string;
  status: 'Active' | 'Sinkholed' | 'Mitigated';
  description: string;
}

export const MITRE_TECHNIQUES: MitreTechnique[] = [
  {
    id: 'T1566',
    name: 'Phishing',
    tactic: 'Initial Access',
    description: 'Adversaries send phishing messages to gain access to victim systems. Messages may contain malicious attachments or hyperlinks directing victims to malicious websites.',
    detection: 'Monitor email logs for SPF/DKIM/DMARC failures, inspect external link clicks in proxy logs, and correlate suspicious inbound mail with immediate endpoint macro executions.',
    mitigation: 'Implement email authentication (DMARC p=reject), disable Office macros via Group Policy (GPO), and conduct regular interactive user awareness simulations.'
  },
  {
    id: 'T1059.001',
    name: 'PowerShell Execution',
    tactic: 'Execution',
    description: 'Adversaries may abuse PowerShell commands and scripts for executing unauthorized commands, downloading payloads, or bypassing execution policies (-ExecutionPolicy Bypass -NoProfile -W Hidden).',
    detection: 'Enable PowerShell Script Block Logging (Event ID 4104) and Transcription (Event ID 4103). Flag base64-encoded strings (-enc) and web download invocations (Net.WebClient, Invoke-WebRequest).',
    mitigation: 'Enforce PowerShell Constrained Language Mode via AppLocker or Windows Defender Application Control (WDAC), and require code signing for all administrative scripts.'
  },
  {
    id: 'T1078',
    name: 'Valid Accounts',
    tactic: 'Defense Evasion & Persistence',
    description: 'Adversaries obtain and abuse credentials of existing domain or local accounts as a means of gaining Initial Access, Persistence, Privilege Escalation, or Defense Evasion.',
    detection: 'Track anomalous authentication times, impossible travel logins (geolocations separated by impossible travel speed), and logon type spikes via Windows Event IDs 4624/4625.',
    mitigation: 'Enforce phishing-resistant FIDO2 MFA across all external access vectors and privileged accounts; implement automated session risk scoring.'
  },
  {
    id: 'T1021.002',
    name: 'SMB/Windows Admin Shares',
    tactic: 'Lateral Movement',
    description: 'Adversaries use valid administrative credentials to interact with remote SMB shares (C$, ADMIN$) and execute code remotely via PsExec or scheduled services.',
    detection: 'Monitor Windows Event 5140 (A network share object was accessed) and Event 7045 (A service was installed in the system) on critical servers.',
    mitigation: 'Block incoming port 445 on workstation-to-workstation boundaries using host-based firewalls; enforce Privileged Access Workstations (PAW).'
  },
  {
    id: 'T1048',
    name: 'Exfiltration Over Alternative Protocol',
    tactic: 'Exfiltration',
    description: 'Adversaries exfiltrate data rather than over existing C2 channels by utilizing DNS tunneling, ICMP tunneling, or unmonitored FTP/cloud storage endpoints.',
    detection: 'Analyze network egress logs for high-frequency DNS TXT requests, abnormal query lengths, high payload entropy, or unusual cloud bucket PUT requests.',
    mitigation: 'Route all DNS requests through a hardened internal DNS sinkhole/resolver; block direct outbound port 53; implement egress DLP inspection.'
  }
];

export const THREAT_ACTORS: ThreatActor[] = [
  {
    id: 'apt29',
    name: 'APT29 (Midnight Blizzard / Cozy Bear)',
    aliases: ['Cozy Bear', 'Nobelium', 'Midnight Blizzard', 'The Dukes'],
    origin: 'Russian Federation (SVR)',
    motivation: 'State-sponsored espionage, intelligence gathering',
    targetSectors: ['Government', 'Defense', 'Think Tanks', 'Cloud Service Providers', 'Diplomatic'],
    notableTTPs: ['SolarWinds Supply Chain (SUNBURST)', 'OAuth Application Abuse', 'Token Forgery', 'Passive DNS reconnaissance'],
    signatureTools: ['SUNBURST', 'GoldMax', 'Cobalt Strike', 'MagicWeb', 'EnvyScout'],
    description: 'Highly sophisticated state-sponsored threat group known for stealthy, patient long-term operations targeting foreign policy intelligence and global software supply chains.'
  },
  {
    id: 'apt28',
    name: 'APT28 (Fancy Bear / Forest Blizzard)',
    aliases: ['Fancy Bear', 'Sofacy', 'Pawn Storm', 'Strontium'],
    origin: 'Russian Federation (GRU)',
    motivation: 'Military intelligence, political subversion, credential harvesting',
    targetSectors: ['Defense', 'NATO members', 'Elections infrastructure', 'Aerospace', 'Energy'],
    notableTTPs: ['Spearphishing with weaponized RTF documents', 'Zero-day exploits (CVE-2023-23397)', 'Credential harvesting portals'],
    signatureTools: ['X-Agent', 'Sofacy', 'Zebrocy', 'Cannon', 'Responder'],
    description: 'Aggressive cyber military unit known for public leaks, fast operational tempos, credential harvesting, and attacks targeting defense installations.'
  },
  {
    id: 'lazarus',
    name: 'Lazarus Group (Hidden Cobra)',
    aliases: ['Hidden Cobra', 'Zinc', 'Diamond Sleet'],
    origin: 'Democratic People\'s Republic of Korea',
    motivation: 'Financial theft, cryptocurrency laundering, espionage',
    targetSectors: ['Cryptocurrency exchanges', 'Banking (SWIFT)', 'Defense', 'Critical Infrastructure'],
    notableTTPs: ['WannaCry ransomware outbreak', 'Social engineering via fake LinkedIn job recruitment', 'Cross-chain crypto bridge attacks'],
    signatureTools: ['Manuscrypt', 'Fallchill', 'AppleJeus', 'WannaCry', 'Midas'],
    description: 'Prolific state-backed operator combining geopolitical espionage with billion-dollar financial cyber heists and cryptocurrency bridge exploits.'
  }
];

export const IOC_DATABASE: IOCEntry[] = [
  {
    type: 'IP',
    value: '194.26.29.112',
    threatActor: 'APT29 (Cozy Bear)',
    malwareFamily: 'Cobalt Strike TeamServer',
    confidence: 'High',
    firstSeen: '2026-10-18',
    status: 'Active',
    description: 'Command and control listener identified hosting malicious SSL certificate default-c2.'
  },
  {
    type: 'Domain',
    value: 'awss-payment-verification.com',
    threatActor: 'Financially Motivated Group',
    malwareFamily: 'Spearhook Dropper',
    confidence: 'High',
    firstSeen: '2026-11-01',
    status: 'Sinkholed',
    description: 'Look-alike typo-squatted domain used for phishing email campaigns targeting corporate finance teams.'
  },
  {
    type: 'SHA-256',
    value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    threatActor: 'Unknown Adversary',
    malwareFamily: 'Null Payload Zero-Hash',
    confidence: 'Medium',
    firstSeen: '2026-09-12',
    status: 'Mitigated',
    description: 'Empty payload hash often seen in probe telemetry and baseline testing.'
  },
  {
    type: 'CVE',
    value: 'CVE-2024-3400',
    threatActor: 'Multiple Nation-State Groups',
    malwareFamily: 'Palo Alto GlobalProtect PAN-OS Command Injection',
    confidence: 'High',
    firstSeen: '2024-04-12',
    status: 'Mitigated',
    description: 'Command injection vulnerability in PAN-OS GlobalProtect gateway feature allowing unauthenticated root execution.'
  }
];
