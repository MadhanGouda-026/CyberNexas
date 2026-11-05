import { Lab } from '../types';

export const LABS: Lab[] = [
  {
    id: 'lab-linux-perm',
    title: 'Linux Permissions & SUID Privilege Escalation',
    category: 'Linux',
    difficulty: 'Intermediate',
    durationMinutes: 25,
    xpReward: 150,
    scenario: 'You have gained unprivileged shell access on a Linux bastion server. The system administrator misconfigured an administrative utility with the SUID bit set.',
    learningObjectives: [
      'Understand POSIX file permissions and octal notations (rwx / 755)',
      'Inspect SUID (Set User ID) binaries and understand execution context',
      'Use find command to discover misconfigured privilege escalation vectors',
      'Safely audit Linux systems to eliminate unauthorized root access vectors'
    ],
    requirements: ['Basic Linux terminal navigation (cd, ls, cat, find)'],
    instructions: [
      'Type `whoami` and `id` to review your current unprivileged user status.',
      'Search for binaries with SUID permission using `find / -perm -4000 2>/dev/null`.',
      'Inspect `/usr/bin/backup_tool` and notice its SUID bit.',
      'Run the tool with `/usr/bin/backup_tool --read /etc/shadow` or inspect the flag at `/root/flag.txt` to capture your proof.'
    ],
    practicalTask: 'Find the vulnerable SUID binary, retrieve the sensitive system file, and submit the flag found inside.',
    hints: [
      'The find command with -perm -4000 searches for SUID executables.',
      'Look closely at `/usr/bin/backup_tool`.',
      'Try running `/usr/bin/backup_tool --read /root/flag.txt`.'
    ],
    expectedOutput: 'CN{su1d_pr1v1l3g3_3sc4l4t10n_succ3ss}',
    flag: 'CN{su1d_pr1v1l3g3_3sc4l4t10n_succ3ss}',
    explanation: 'When the SUID bit (octal 4000) is set on an executable file owned by root, any user executing that binary runs it with the effective UID of root. If that binary allows reading arbitrary files or invoking shells, unprivileged users can read sensitive credentials like /etc/shadow or escalate to a root shell.',
    dockerSupported: true,
    dockerImage: 'alpine:3.19',
    dockerResourceLimits: {
      cpu: '0.5 vCPU',
      memory: '256 MB',
      pids: 100,
      isolation: 'Sandboxed (CapDrop ALL, No-New-Privileges, Isolated /home)'
    },
    initialTerminalCommands: {
      'whoami': 'student',
      'id': 'uid=1001(student) gid=1001(student) groups=1001(student)',
      'ls -la': 'total 12\ndrwxr-xr-x 2 student student 4096 Nov 04 09:00 .\ndrwxr-xr-x 4 root    root    4096 Nov 04 08:30 ..\n-rw-r--r-- 1 student student  220 Nov 04 09:00 .bashrc',
      'find / -perm -4000 2>/dev/null': '/usr/bin/sudo\n/usr/bin/passwd\n/usr/bin/chsh\n/usr/bin/backup_tool',
      'ls -l /usr/bin/backup_tool': '-rwsr-xr-x 1 root root 18432 Oct 12 14:22 /usr/bin/backup_tool',
      '/usr/bin/backup_tool --help': 'Backup Utility v1.02\nUsage: backup_tool [OPTIONS]\n  --read <file>    Read and print file contents\n  --archive <dir>  Create compressed archive',
      '/usr/bin/backup_tool --read /root/flag.txt': 'FLAG: CN{su1d_pr1v1l3g3_3sc4l4t10n_succ3ss}',
      'cat /root/flag.txt': 'cat: /root/flag.txt: Permission denied',
      'help': 'Available commands: whoami, id, ls, cd, cat, find, /usr/bin/backup_tool, clear, pwd'
    }
  },
  {
    id: 'lab-python-sec',
    title: 'Python Security: Insecure Deserialization & Token Manipulation',
    category: 'Python',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    xpReward: 140,
    scenario: 'An internal authentication middleware script uses unsafe eval() serialization to unpack user claims tokens. An adversary can craft a malicious dictionary payload to elevate user status to admin.',
    learningObjectives: [
      'Recognize dangerous dynamic code evaluation primitives in Python (eval, exec, pickle)',
      'Inspect runtime execution behavior and audit user-controlled parameters',
      'Manipulate JSON/dict claims structure to trigger authorized branches',
      'Refactor insecure deserialization to safe json.loads() and Pydantic schemas'
    ],
    requirements: ['Basic Python 3 syntax and command line invocation'],
    instructions: [
      'Launch the Python Docker container session.',
      'Inspect the target script with `cat /home/student/auth_service.py`.',
      'Test normal user authentication: `python3 auth_service.py \'{"user": "guest", "role": "guest"}\'`.',
      'Craft an administrative token payload with role set to "admin" to trigger the flag reveal.'
    ],
    practicalTask: 'Bypass the role check in the Python authentication service and capture the proof flag.',
    hints: [
      'Read `/home/student/auth_service.py` to see what condition checks `data.get("role") == "admin"`.',
      'Run `python3 auth_service.py \'{"role": "admin"}\'`.',
      'The script prints the proof flag once the admin branch is satisfied.'
    ],
    expectedOutput: 'CN{python_sandbox_code_exec_defended}',
    flag: 'CN{python_sandbox_code_exec_defended}',
    explanation: 'Using `eval()` on untrusted input allows attackers to execute arbitrary code or bypass security logic. Even if not achieving arbitrary shell execution immediately, manipulating structured state bypasses critical authentication gates. Deserialization should always use strict parsers like `json.loads()`.',
    dockerSupported: true,
    dockerImage: 'python:3.11-alpine',
    dockerResourceLimits: {
      cpu: '0.5 vCPU',
      memory: '256 MB',
      pids: 100,
      isolation: 'Sandboxed (CapDrop ALL, Safe Python Sandbox)'
    },
    initialTerminalCommands: {
      'python3 --version': 'Python 3.11.9',
      'cat /home/student/auth_service.py': 'def authenticate(token_data):\n    data = eval(token_data)\n    if data.get("role") == "admin":\n        print("[SUCCESS] Flag: CN{python_sandbox_code_exec_defended}")',
      'python3 auth_service.py \'{"role": "admin"}\'': '[SUCCESS] Admin access granted! Proof Flag: CN{python_sandbox_code_exec_defended}',
      'help': 'Commands: cat, ls, python3, whoami, clear'
    }
  },
  {
    id: 'lab-sql-injection',
    title: 'SQL Injection: Authentication Bypass & Schema Extraction',
    category: 'Web Security',
    difficulty: 'Beginner',
    durationMinutes: 20,
    xpReward: 120,
    scenario: 'An internal employee portal login form fails to sanitize user credentials before executing dynamic SQL queries against a PostgreSQL database.',
    learningObjectives: [
      'Understand how dynamic string concatenation creates SQL injection flaws',
      'Construct a classic tautology payload (\' OR \'1\'=\'1) to bypass authentication',
      'Analyze backend query logs to observe how syntax is altered',
      'Remediate the vulnerability using parameterized prepared statements'
    ],
    requirements: ['Understanding of basic SQL SELECT syntax and HTTP POST forms'],
    instructions: [
      'Examine the login endpoint which executes: SELECT * FROM staff WHERE username=\'$user\' AND password=\'$pass\'.',
      'Input an injection payload into the username field that makes the WHERE clause evaluate to TRUE for all rows.',
      'Log into the administrator account and locate the secret flag in the administrative dashboard.'
    ],
    practicalTask: 'Bypass the authentication barrier using SQL injection and retrieve the admin flag.',
    hints: [
      'What happens if the username is: admin\' -- ?',
      'The single quote closes the string literal, and -- comments out the password check.',
      'Try payload: admin\' OR 1=1--'
    ],
    expectedOutput: 'CN{sql_1nj3ct10n_4uth_byp4ss_m4st3r}',
    flag: 'CN{sql_1nj3ct10n_4uth_byp4ss_m4st3r}',
    explanation: 'By entering `admin\' OR 1=1--`, the query becomes: `SELECT * FROM staff WHERE username=\'admin\' OR 1=1--\' AND password=\'...\'`. Because `1=1` is unconditionally true, the database returns the administrator account record regardless of the password supplied.',
    dockerSupported: true,
    dockerImage: 'python:3.11-alpine',
    dockerResourceLimits: {
      cpu: '0.5 vCPU',
      memory: '256 MB',
      pids: 100,
      isolation: 'Sandboxed (Isolated Internal HTTP Server :8080)'
    },
    initialTerminalCommands: {
      'curl -X POST http://portal.local/api/login -d "username=admin&password=wrong"': '{"status": 401, "error": "Invalid credentials"}',
      'curl -X POST http://portal.local/api/login -d "username=admin\' OR 1=1--&password=x"': '{"status": 200, "role": "admin", "token": "eyJh...", "flag": "CN{sql_1nj3ct10n_4uth_byp4ss_m4st3r}"}',
      'help': 'Try using curl to interact with the login endpoint, or submit the flag directly.'
    }
  },
  {
    id: 'lab-net-nmap',
    title: 'Network Port Scanning & Service Fingerprinting',
    category: 'Networking',
    difficulty: 'Intermediate',
    durationMinutes: 30,
    xpReward: 160,
    scenario: 'You are conducting an authorized internal network penetration test against target host 192.168.10.15. You need to enumerate open ports, services, and running versions.',
    learningObjectives: [
      'Master Nmap SYN stealth scanning flags (-sS, -sV, -O, -p-)',
      'Analyze open TCP ports and identify common services (SSH, HTTP, SMB, MySQL)',
      'Perform banner grabbing to discover outdated service versions',
      'Detect vulnerable service banners and extract the network flag'
    ],
    requirements: ['Basic understanding of TCP ports and Nmap syntax'],
    instructions: [
      'Run `nmap -sS -p 1-1000 192.168.10.15` to identify open TCP ports.',
      'Execute service version detection with `nmap -sV -p 21,22,80,445 192.168.10.15`.',
      'Inspect the FTP service on port 21 which allows anonymous login.',
      'Connect via `ftp 192.168.10.15` and download `flag.txt`.'
    ],
    practicalTask: 'Scan the target host, discover the anonymous FTP service, and download the challenge flag.',
    hints: [
      'Use Nmap with -sV to inspect version banners.',
      'Port 21 is FTP; check if anonymous login is permitted.',
      'Run `ftp 192.168.10.15` with username `anonymous`.'
    ],
    expectedOutput: 'CN{nm4p_p0rt_sc4n_s3rv1c3_d1sc0v3ry}',
    flag: 'CN{nm4p_p0rt_sc4n_s3rv1c3_d1sc0v3ry}',
    explanation: 'Network reconnaissance systematically discovers active hosts and listening daemons. Service fingerprinting analyzes protocol responses and TCP banner strings, exposing software versions and potential vulnerabilities such as unauthenticated anonymous FTP access.',
    dockerSupported: true,
    dockerImage: 'alpine:3.19',
    dockerResourceLimits: {
      cpu: '0.5 vCPU',
      memory: '256 MB',
      pids: 120,
      isolation: 'Sandboxed (Isolated Bridge Network, Socket Audit)'
    },
    initialTerminalCommands: {
      'nmap -sS 192.168.10.15': 'Starting Nmap 7.94\nNmap scan report for 192.168.10.15\nHost is up (0.0021s latency).\nPORT    STATE SERVICE\n21/tcp  open  ftp\n22/tcp  open  ssh\n80/tcp  open  http\n445/tcp open  microsoft-ds',
      'nmap -sV -p 21 192.168.10.15': 'PORT   STATE SERVICE VERSION\n21/tcp open  ftp     vsftpd 2.3.4 (Anonymous allowed)',
      'ftp 192.168.10.15': 'Connected to 192.168.10.15.\n220 (vsFTPd 2.3.4)\nName: anonymous\n230 Login successful.\nftp> get flag.txt\n226 Transfer complete.\nContent: CN{nm4p_p0rt_sc4n_s3rv1c3_d1sc0v3ry}',
      'help': 'Commands available: nmap, ftp, ping, curl, clear'
    }
  },
  {
    id: 'lab-crypto-aes',
    title: 'Cryptographic Failure: ECB Mode & Ciphertext Replay',
    category: 'Cryptography',
    difficulty: 'Advanced',
    durationMinutes: 35,
    xpReward: 200,
    scenario: 'A legacy payment API encrypts session cookies using AES in Electronic Codebook (ECB) mode. Because identical 16-byte plaintext blocks produce identical ciphertext blocks, an attacker can manipulate user roles.',
    learningObjectives: [
      'Understand why AES-ECB mode leaks patterns and lacks semantic security',
      'Analyze 16-byte block boundary alignment in cryptographic protocols',
      'Perform block rearrangement and splicing to alter encrypted authorization claims',
      'Migrate cryptographic implementations to authenticated AES-GCM mode'
    ],
    requirements: ['Familiarity with block ciphers and base64 hex representations'],
    instructions: [
      'Inspect encrypted cookies generated for user `user=guest;role=user`.',
      'Calculate the 16-byte block alignments.',
      'Swap the role block with an admin token block to forge administrative privileges.',
      'Submit the forged cookie to decrypt the vault key and capture the flag.'
    ],
    practicalTask: 'Exploit AES-ECB pattern leakage to elevate privileges to administrator and retrieve the flag.',
    hints: [
      'ECB mode encrypts each 16-byte block independently with no Initialization Vector (IV).',
      'Look for repeating 32-character hexadecimal chunks.',
      'Swap block 2 with the forged admin block.'
    ],
    expectedOutput: 'CN{43s_3cb_m0d3_p4tt3rn_l34k4g3_busted}',
    flag: 'CN{43s_3cb_m0d3_p4tt3rn_l34k4g3_busted}',
    explanation: 'Electronic Codebook (ECB) mode encrypts each block independently using the same key without an Initialization Vector (IV). Identical plaintext blocks yield identical ciphertext blocks, allowing adversaries to detect patterns and splice blocks together to forge valid encrypted payloads.',
    initialTerminalCommands: {
      'python3 crypto_oracle.py --create-token guest': 'Token: a94f83b276c19de0f3b41299e12089aa558832a100b2cd33a82e9901ee19aa32',
      'python3 crypto_oracle.py --verify a94f83b276c19de0f3b41299e12089aa558832a100b2cd33a82e9901ee19aa32': 'Authenticated as: guest (role=user)',
      'python3 crypto_oracle.py --forge-admin': 'Forged token: a94f83b276c19de0f3b41299e12089aaeeff00112233445566778899aabbccdd\nDecrypted: role=admin\nFlag: CN{43s_3cb_m0d3_p4tt3rn_l34k4g3_busted}',
      'help': 'Use python3 crypto_oracle.py with options --create-token, --verify, or --forge-admin'
    }
  },
  {
    id: 'lab-forensics-pcap',
    title: 'Network Forensics: Dissecting an Exfiltration Incident',
    category: 'Digital Forensics',
    difficulty: 'Intermediate',
    durationMinutes: 25,
    xpReward: 175,
    scenario: 'SOC sensors flagged abnormal outbound traffic on DNS port 53. An adversary is suspected of utilizing DNS tunneling to exfiltrate proprietary source code.',
    learningObjectives: [
      'Inspect packet captures (.pcap) for protocol anomalies',
      'Identify DNS tunneling indicators (long TXT queries, high Shannon entropy, subdomains)',
      'Extract hex/base64 encoded payloads embedded within DNS queries',
      'Reconstruct exfiltrated data files and identify the flag'
    ],
    requirements: ['Basic understanding of DNS query types (A, TXT, CNAME) and PCAP structure'],
    instructions: [
      'Analyze the captured DNS packets with `tshark -r incident.pcap -Y "dns"`.',
      'Filter for suspicious subdomains queried to `attacker-c2.net`.',
      'Extract the base64-encoded labels prefixed to each query.',
      'Decode the concatenated base64 stream to reveal the stolen secret and flag.'
    ],
    practicalTask: 'Isolate the anomalous DNS TXT queries, decode the exfiltrated payload, and submit the flag.',
    hints: [
      'Notice queries to `[base64].tunnel.attacker-c2.net`.',
      'Concatenate the subdomain strings and run them through base64 -d.',
      'Look for the CN{...} flag in the decoded string.'
    ],
    expectedOutput: 'CN{dns_tunn3l1ng_d4t4_3xf1ltr4t10n_d3t3ct3d}',
    flag: 'CN{dns_tunn3l1ng_d4t4_3xf1ltr4t10n_d3t3ct3d}',
    explanation: 'DNS tunneling encapsulates non-DNS traffic within standard DNS lookups (such as TXT records). Because organizations rarely block outbound port 53, adversaries utilize this technique to bypass egress firewalls. Detection relies on monitoring subdomain query lengths, high query frequency, and packet entropy.',
    initialTerminalCommands: {
      'tshark -r incident.pcap -Y "dns.flags.response == 0" -T fields -e dns.qry.name | head -n 5': 'Q057ZG5zX3R1.tunnel.attacker-c2.net\nbm5lbDFuZ19k.tunnel.attacker-c2.net\nNHRhXzN4ZjFs.tunnel.attacker-c2.net\ndHI0dDEwbl9k.tunnel.attacker-c2.net\nM3QzY3QzZH0=.tunnel.attacker-c2.net',
      'echo -n "Q057ZG5zX3R1bm5lbDFuZ19kNHRhXzN4ZjFsdHI0dDEwbl9kM3QzY3QzZH0=" | base64 -d': 'CN{dns_tunn3l1ng_d4t4_3xf1ltr4t10n_d3t3ct3d}',
      'help': 'Use tshark, base64, grep, or cat to inspect the incident PCAP.'
    }
  }
];
