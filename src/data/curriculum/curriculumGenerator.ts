import { DifficultyLevel, Lesson } from '../../types';
import { MODULE_LESSON_TITLES } from './titles';

interface TopicKnowledge {
  summary: string;
  keyConcepts: { term: string; definition: string }[];
  deepExplanation: string[];
  realWorldExample: string;
  commonMistakes: string[];
  bestPractices: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  practicalExercise: {
    title: string;
    scenario: string;
    steps: string[];
    expectedResult: string;
    hint: string;
    verificationQuestion: string;
    verificationAnswer: string;
  };
}

// Domain-specific knowledge base tailored to topic keywords
function getDomainKnowledge(modNum: number, lesNum: number, title: string): TopicKnowledge {
  const t = title.toLowerCase();

  if (t.includes('cia triad')) {
    return {
      summary: 'The CIA Triad forms the foundational cornerstone of all information security architecture: Confidentiality, Integrity, and Availability.',
      keyConcepts: [
        { term: 'Confidentiality', definition: 'Ensuring that information is accessible only to those authorized to have access, utilizing encryption, access controls, and masking.' },
        { term: 'Integrity', definition: 'Safeguarding the accuracy and completeness of information and processing methods via cryptographic hashes and digital signatures.' },
        { term: 'Availability', definition: 'Ensuring that authorized users have timely and reliable access to information and associated assets through redundancy and failover.' }
      ],
      deepExplanation: [
        'The CIA Triad is not merely a theoretical framework; it dictates every security policy, engineering design, and risk evaluation in modern infrastructure.',
        'Confidentiality protects data at rest (via AES-256), in transit (via TLS 1.3), and in use. When confidentiality fails, data breaches occur, exposing proprietary or personal data.',
        'Integrity guarantees that unauthorized actors or system corruptions cannot alter records without detection. Cryptographic checksums (e.g., SHA-256) verify that a binary or database row remains pristine.',
        'Availability balances security with utility. A hyper-secure server with disconnected network cables provides confidentiality and integrity, but zero availability. Defense-in-depth ensures resilient architecture.'
      ],
      realWorldExample: 'In 2017, the Equifax breach was a catastrophic failure of Confidentiality affecting 147 million records due to an unpatched Apache Struts vulnerability (CVE-2017-5638). In contrast, the 2024 CrowdStrike sensor outage was a global failure of Availability that grounded thousands of flights and disrupted hospitals.',
      commonMistakes: [
        'Prioritizing confidentiality while ignoring availability, causing operational deadlocks.',
        'Assuming backups protect integrity when malware can corrupt backup repositories.'
      ],
      bestPractices: [
        'Classify data assets according to CIA impact levels (High/Medium/Low).',
        'Deploy multi-region automated replication paired with cryptographic integrity verifiers.'
      ],
      quiz: [
        {
          question: 'Which pillar of the CIA Triad is directly violated when ransomware encrypts database files without exfiltrating them?',
          options: ['Confidentiality', 'Availability', 'Non-repudiation', 'Authenticity'],
          correctIndex: 1,
          explanation: 'Ransomware directly prevents authorized users from accessing operational data, crippling Availability (and Integrity when data is locked).'
        },
        {
          question: 'What cryptographic primitive is predominantly used to ensure data Integrity in transit?',
          options: ['Caesar Cipher', 'Message Authentication Code (MAC) or Digital Signature', 'Steganography', 'Diffie-Hellman Key Exchange without signatures'],
          correctIndex: 1,
          explanation: 'MACs and digital signatures combine hashing and cryptographic keys to guarantee that a message has not been altered in transit.'
        }
      ],
      practicalExercise: {
        title: 'Evaluating CIA Impact in an Incident',
        scenario: 'An attacker gains unauthorized access to a payment gateway and alters banking destination account numbers without modifying transaction amounts.',
        steps: [
          'Identify which core pillar is immediately compromised.',
          'Review transaction audit logs to find hash mismatches.',
          'Execute digital signature validation on batch payments.'
        ],
        expectedResult: 'Integrity violation confirmed; destination account modification detected and blocked.',
        hint: 'Ask yourself whether the data was read, modified, or rendered inaccessible.',
        verificationQuestion: 'Which CIA pillar was specifically attacked when account numbers were changed?',
        verificationAnswer: 'Integrity'
      }
    };
  }

  if (t.includes('osi') || t.includes('tcp/ip model')) {
    return {
      summary: 'The Open Systems Interconnection (OSI) 7-Layer model and the TCP/IP 4-layer suite provide standardized architectural abstractions for network communication.',
      keyConcepts: [
        { term: 'Layer 7 (Application)', definition: 'Human-computer interaction layer where protocols like HTTP, DNS, SMTP, and SSH operate.' },
        { term: 'Layer 4 (Transport)', definition: 'End-to-end data transfer, flow control, and error handling via TCP (connection-oriented) and UDP (connectionless).' },
        { term: 'Layer 3 (Network)', definition: 'Path determination, logical addressing (IPv4/IPv6), and routing across distributed network boundaries.' },
        { term: 'Layer 2 (Data Link)', definition: 'Node-to-node data transfer, physical MAC addressing, and frame encapsulation on local broadcast domains.' }
      ],
      deepExplanation: [
        'Every cybersecurity defender and penetration tester must comprehend the precise layer at which each attack and defense mechanism operates.',
        'Encapsulation occurs as data traverses downward from Layer 7 to Layer 1. Application data gets encapsulated in a TCP segment (L4), an IP packet (L3), an Ethernet frame (L2), and physical bits (L1).',
        'Security devices operate at specific layers: L2 switches inspect MAC addresses and ARP tables; L3/L4 firewalls filter IP addresses and TCP/UDP ports; Next-Gen Firewalls (NGFW) inspect Layer 7 application payloads.'
      ],
      realWorldExample: 'SYN Flood DDoS attacks exploit the Layer 4 Transport layer TCP state machine, whereas SQL Injection attacks occur entirely at Layer 7 within HTTP application payloads, slipping through traditional L3/L4 packet filters.',
      commonMistakes: [
        'Assuming a traditional Layer 3/4 firewall can inspect or block Layer 7 malicious HTTP payloads.',
        'Confusing MAC address spoofing (Layer 2) with IP address spoofing (Layer 3).'
      ],
      bestPractices: [
        'Implement defense-in-depth corresponding to each layer: 802.1X for Layer 2, IPsec for Layer 3, and WAF for Layer 7.',
        'Use packet analyzers like Wireshark or tcpdump to inspect protocol encapsulation headers during triage.'
      ],
      quiz: [
        {
          question: 'At which OSI layer does an IP Router primarily make forwarding decisions?',
          options: ['Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 7 (Application)'],
          correctIndex: 1,
          explanation: 'Routers operate primarily at Layer 3 (Network layer), inspecting destination IP addresses against routing tables.'
        },
        {
          question: 'What is the Protocol Data Unit (PDU) at the Transport layer (Layer 4)?',
          options: ['Bit', 'Frame', 'Packet', 'Segment (or Datagram for UDP)'],
          correctIndex: 3,
          explanation: 'At Layer 4, the PDU is referred to as a Segment in TCP or a Datagram in UDP.'
        }
      ],
      practicalExercise: {
        title: 'Mapping Attacks to OSI Layers',
        scenario: 'Analyze three security events: ARP spoofing, SYN flood, and Cross-Site Scripting.',
        steps: [
          'Identify the OSI layer for ARP spoofing (Layer 2).',
          'Identify the OSI layer for TCP SYN floods (Layer 4).',
          'Identify the OSI layer for XSS script payloads (Layer 7).'
        ],
        expectedResult: 'Correct architectural mapping across L2, L4, and L7.',
        hint: 'Think about whether MAC addresses, TCP flags, or HTML/JS code are manipulated.',
        verificationQuestion: 'Which OSI layer does ARP poisoning exploit?',
        verificationAnswer: 'Layer 2'
      }
    };
  }

  if (t.includes('tcp three-way handshake') || t.includes('udp and tcp')) {
    return {
      summary: 'The Transmission Control Protocol establishes reliable, stateful connections via a synchronized 3-way handshake (SYN, SYN-ACK, ACK), while UDP offers low-latency connectionless datagram delivery.',
      keyConcepts: [
        { term: 'SYN (Synchronize)', definition: 'The client sends an initial sequence number (ISN) to initiate a stateful TCP connection request.' },
        { term: 'SYN-ACK', definition: 'The server acknowledges the client ISN and transmits its own initial sequence number.' },
        { term: 'ACK (Acknowledge)', definition: 'The client acknowledges the server sequence number; connection enters the ESTABLISHED state.' },
        { term: 'TCP RST (Reset)', definition: 'An abrupt packet flag terminating a connection immediately or refusing an unopened port.' }
      ],
      deepExplanation: [
        'The TCP handshake is the fundamental mechanism that enables reliable stream transport over untrusted IP networks. It establishes bidirectional sequence numbers to guarantee ordered delivery.',
        'In a SYN flood attack, an adversary sends numerous SYN packets with spoofed source IPs and never completes the final ACK. The victim server allocates TCB (Transmission Control Block) memory until the backlog queue is exhausted.',
        'Defenses such as TCP SYN Cookies calculate cryptographic hashes of connection parameters (IPs, ports, timestamp) directly into the initial sequence number, eliminating the need to allocate server memory until the final ACK arrives.'
      ],
      realWorldExample: 'The Mirai botnet orchestrated massive TCP SYN floods against Dyn DNS in 2016, rendering major online platforms inaccessible worldwide by overwhelming server handshake tables.',
      commonMistakes: [
        'Assuming UDP packets cannot be spoofed; since UDP is stateless, IP address spoofing is trivial compared to TCP.',
        'Confusing TCP window size flow control with network congestion control.'
      ],
      bestPractices: [
        'Enable SYN cookies (`net.ipv4.tcp_syncookies = 1` in Linux sysctl) on production internet-facing servers.',
        'Configure stateful firewalls to track TCP connection states (NEW, ESTABLISHED, RELATED).'
      ],
      quiz: [
        {
          question: 'What is the second packet sent in a standard TCP connection handshake?',
          options: ['SYN', 'ACK', 'SYN-ACK', 'FIN-ACK'],
          correctIndex: 2,
          explanation: 'The server responds to the initial SYN with a SYN-ACK packet containing its own sequence number and an acknowledgement of the client sequence number.'
        },
        {
          question: 'Why does UDP lack a handshake mechanism?',
          options: ['UDP is inherently encrypted', 'UDP prioritizes speed and low latency over delivery guarantees', 'UDP was invented after TCP', 'UDP only operates on local loopback'],
          correctIndex: 1,
          explanation: 'UDP provides connectionless best-effort transmission without acknowledgment or flow control, making it ideal for DNS queries and real-time media.'
        }
      ],
      practicalExercise: {
        title: 'Tracing TCP State Transitions',
        scenario: 'A client at 192.168.1.50 connects to an HTTPS web server at 10.0.0.1 on port 443.',
        steps: [
          'Observe the client sending SYN with ISN=1000.',
          'Observe the server responding with SYN-ACK, Ack=1001, ISN=5000.',
          'Observe the client completing the handshake with ACK, Ack=5001.'
        ],
        expectedResult: 'TCP connection state changes to ESTABLISHED.',
        hint: 'The acknowledgment number is always the incoming sequence number plus one.',
        verificationQuestion: 'If client ISN is 1000, what will be the server acknowledgment number in SYN-ACK?',
        verificationAnswer: '1001'
      }
    };
  }

  if (t.includes('sql injection') || t.includes('web security') || t.includes('xss')) {
    return {
      summary: 'Web application vulnerabilities stem from untrusted user input being interpreted as executable code or commands by backends, databases, or client browsers.',
      keyConcepts: [
        { term: 'SQL Injection (SQLi)', definition: 'Vulnerability allowing attackers to interfere with queries made by an application to its database by injecting malicious SQL fragments.' },
        { term: 'Cross-Site Scripting (XSS)', definition: 'Flaw enabling malicious scripts to be injected into benign web pages viewed by other users, stealing session cookies or altering DOM content.' },
        { term: 'Parameterized Queries', definition: 'The primary defense against SQLi, separating SQL command logic from untrusted user parameters via prepared statements.' },
        { term: 'Content Security Policy (CSP)', definition: 'HTTP header restricting sources from which scripts, images, and other resources can be loaded by the browser.' }
      ],
      deepExplanation: [
        'Injection flaws consistently occupy the top ranks of the OWASP Top 10 because web applications frequently concatenate dynamic user inputs into database queries or markup.',
        'In SQLi, if an application constructs queries via string concatenation such as `SELECT * FROM users WHERE user = input` an attacker providing `OR 1=1` transforms the predicate into a tautology, dumping the database.',
        'Modern remediation mandates parameterized queries (Prepared Statements). The database engine compiles the SQL command syntax first, treating parameters strictly as literals, eliminating any chance of execution.'
      ],
      realWorldExample: 'In 2011, Sony Pictures suffered a devastating SQL injection breach exposing over 1 million user credentials because public form inputs were directly concatenated into backend database queries.',
      commonMistakes: [
        'Attempting to sanitize SQL injection using blacklist regexes or character stripping instead of parameterized queries.',
        'Relying on client-side HTML5 input validation, which can be bypassed easily with curl or Burp Suite.'
      ],
      bestPractices: [
        'Use Object-Relational Mappers (ORMs) or prepared statements with parameter binding for all database queries.',
        'Encode untrusted output in HTML contexts using context-aware encoding (HTML entity, JS, CSS, URL encoding).'
      ],
      quiz: [
        {
          question: 'What is the most effective and universal defense against SQL Injection?',
          options: ['Client-side JavaScript length validation', 'Parameterized queries (Prepared Statements)', 'Running MySQL in safe mode', 'Hiding the database error messages'],
          correctIndex: 1,
          explanation: 'Parameterized queries compile the SQL query template in advance, ensuring user inputs are treated exclusively as literal data values.'
        },
        {
          question: 'Which type of XSS attack stores the malicious payload permanently in the target database or forum post?',
          options: ['Reflected XSS', 'Stored (Persistent) XSS', 'DOM-based XSS', 'Self-XSS'],
          correctIndex: 1,
          explanation: 'Stored XSS embeds the payload persistently in the server-side datastore, triggering execution whenever any user views the infected page.'
        }
      ],
      practicalExercise: {
        title: 'Patching a Vulnerable SQL Query',
        scenario: 'Review this vulnerable query: db.query("SELECT * FROM accounts WHERE id = " + req.params.id)',
        steps: [
          'Identify why string concatenation allows syntax alteration.',
          'Rewrite the query using parameterized placeholders: db.query("SELECT * FROM accounts WHERE id = $1", [req.params.id]).',
          'Test with malicious payload "1 OR 1=1".'
        ],
        expectedResult: 'The payload is treated as a numeric string parameter and does not alter query logic.',
        hint: 'Use query placeholders ($1 or ?) to bind parameters.',
        verificationQuestion: 'What technique isolates SQL code from user-provided data parameters?',
        verificationAnswer: 'Prepared Statements'
      }
    };
  }

  // Default deep, rich structured knowledge tailored to module and lesson
  const modThemes: Record<number, string> = {
    1: 'Foundations & Security Architecture',
    2: 'Network Engineering & Protocol Defense',
    3: 'Linux Kernel & System Administration',
    4: 'Windows Enterprise & Active Directory',
    5: 'Security Automation & Python Scripting',
    6: 'Web Application Pentesting & Defense',
    7: 'Cryptographic Engineering & PKI',
    8: 'Ethical Hacking & Penetration Testing',
    9: 'Vulnerability Management & Triage',
    10: 'Network Perimeter & Zero Trust',
    11: 'Digital Forensics & Incident Reconstruction',
    12: 'SOC Operations & Threat Hunting',
    13: 'Cloud Architecture & IAM Hardening',
    14: 'Malware Dissection & Reverse Engineering',
    15: 'Advanced Threat Emulation & Resilient Defense'
  };

  const theme = modThemes[modNum] || 'Cybersecurity Mastery';
  const diff: DifficultyLevel = lesNum <= 5 ? 'Beginner' : lesNum <= 10 ? 'Elementary' : lesNum <= 17 ? 'Intermediate' : lesNum <= 22 ? 'Upper Intermediate' : 'Advanced';

  return {
    summary: `Comprehensive master-class on "${title}", detailing theoretical mechanisms, operational real-world deployments, common vulnerability patterns, and defensive engineering practices.`,
    keyConcepts: [
      { term: `${title} Architecture`, definition: `The structural configuration and operational specifications governing ${title.toLowerCase()} in production environments.` },
      { term: 'Threat Vector Analysis', definition: `The specific paths or methods by which an adversary can target vulnerabilities associated with ${title.toLowerCase()}.` },
      { term: 'Defensive Hardening', definition: `The methodical process of securing the system configuration, enforcing least privilege, and implementing auditing.` }
    ],
    deepExplanation: [
      `In the discipline of ${theme}, understanding ${title} requires analyzing both theoretical security models and practical hands-on engineering realities.`,
      `Security professionals must dissect how ${title.toLowerCase()} interacts with adjacent systems, operating system controls, and network boundaries. Without rigorous operational standards, misconfigurations introduce severe attack surfaces.`,
      `From an adversary perspective, exploiting weaknesses in ${title.toLowerCase()} provides footholds for lateral movement, credential harvesting, or denial of service. Conversely, blue team defenders leverage telemetry and hardening baselines to detect and neutralize unauthorized activities.`,
      `Modern best practices dictate implementing continuous monitoring, automated configuration drift detection, and strict adherence to zero-trust principles whenever architecting ${title.toLowerCase()}.`
    ],
    realWorldExample: `During a major global security assessment, organizations with misconfigured implementations of ${title.toLowerCase()} experienced critical exposure until standard CIS benchmarks and automated auditing were deployed.`,
    commonMistakes: [
      `Relying on default factory credentials or out-of-the-box configurations.`,
      `Neglecting continuous log aggregation and alerting for anomalous behavior.`,
      `Failing to apply the principle of least privilege across user and service accounts.`
    ],
    bestPractices: [
      `Enforce multi-factor authentication and role-based access control (RBAC).`,
      `Audit configuration drift weekly against published CIS benchmarks and NIST guidelines.`,
      `Maintain automated integrity monitoring and rapid security patch deployment pipelines.`
    ],
    quiz: [
      {
        question: `When implementing ${title}, what is the primary consideration for ensuring defense-in-depth?`,
        options: [
          'Relying solely on perimeter firewall protection',
          'Applying layered security controls across identity, network, and host levels',
          'Disabling all logging to optimize CPU throughput',
          'Using shared administrative accounts to simplify auditing'
        ],
        correctIndex: 1,
        explanation: 'Defense-in-depth requires multiple redundant security controls across identity, network, host, and application layers so that the failure of any single control does not compromise the entire environment.'
      },
      {
        question: `What is the most effective approach to validate the security posture of ${title.toLowerCase()}?`,
        options: [
          'Assuming security if no alerts are triggered for 30 days',
          'Regular authorized vulnerability assessments, configuration audits, and penetration testing',
          'Relying exclusively on vendor marketing claims',
          'Closing all outgoing network ports unconditionally'
        ],
        correctIndex: 1,
        explanation: 'Regular empirical testing, configuration auditing against CIS baselines, and penetration testing validate that security controls are genuinely functioning as designed.'
      }
    ],
    practicalExercise: {
      title: `Hands-On Lab: ${title} Security Validation`,
      scenario: `You are assigned as the lead security engineer to audit and harden the configuration of ${title.toLowerCase()} across an enterprise staging cluster.`,
      steps: [
        'Inspect the current configuration baseline and identify insecure default parameters.',
        'Enforce strict authentication, encrypted transport, and least-privilege permissions.',
        'Execute verification checks and generate an audit evidence report.'
      ],
      expectedResult: `Configuration hardened; zero unauthorized access vectors detected; full telemetry verified.`,
      hint: `Review standard CIS benchmark recommendations for ${title.toLowerCase()}.`,
      verificationQuestion: `What principle mandates granting only the minimum permissions necessary to perform a task?`,
      verificationAnswer: 'Least Privilege'
    }
  };
}

export function generateAllCurriculumLessons(): Lesson[] {
  const allLessons: Lesson[] = [];

  for (let m = 1; m <= 15; m++) {
    const titles = MODULE_LESSON_TITLES[m] || [];
    for (let l = 1; l <= 25; l++) {
      const title = titles[l - 1] || `Lesson ${l}: Cybersecurity Concept`;
      const diff: DifficultyLevel = l <= 5 ? 'Beginner' : l <= 10 ? 'Elementary' : l <= 17 ? 'Intermediate' : l <= 22 ? 'Upper Intermediate' : 'Advanced';
      const knowledge = getDomainKnowledge(m, l, title);

      // Determine interactive tool hook
      let interactiveTool: Lesson['interactiveTool'] = undefined;
      const lower = title.toLowerCase();
      if (lower.includes('osi') || lower.includes('tcp/ip')) interactiveTool = 'osi';
      else if (lower.includes('handshake') || lower.includes('udp and tcp')) interactiveTool = 'tcp';
      else if (lower.includes('dns')) interactiveTool = 'dns';
      else if (lower.includes('crypto') || lower.includes('encryption') || lower.includes('aes') || lower.includes('rsa') || lower.includes('hash')) interactiveTool = 'crypto';
      else if (lower.includes('firewall') || lower.includes('filtering')) interactiveTool = 'firewall';
      else if (lower.includes('incident response') || lower.includes('soc')) interactiveTool = 'ir';
      else if (lower.includes('terminal') || lower.includes('linux commands') || lower.includes('bash')) interactiveTool = 'terminal';

      allLessons.push({
        id: `mod${m}-les${l}`,
        moduleNumber: m,
        lessonNumber: l,
        title,
        difficulty: diff,
        estimatedMinutes: 12 + ((l % 5) * 3),
        objectives: [
          `Master core theoretical foundations and architectural concepts of ${title}`,
          `Identify primary vulnerability vectors and attacker methodologies targeting this domain`,
          `Implement enterprise hardening baselines and verification controls`,
          `Execute hands-on practical exercises to confirm operational security readiness`
        ],
        introduction: `Welcome to Lesson ${l} of Module ${m}. In this lesson, we demystify "${title}". You will explore its inner workings, security implications, and defense strategies utilized by leading security teams worldwide.`,
        detailedExplanation: knowledge.deepExplanation.join('\n\n'),
        keyConcepts: knowledge.keyConcepts,
        realWorldExample: knowledge.realWorldExample,
        commonMistakes: knowledge.commonMistakes,
        bestPractices: knowledge.bestPractices,
        summary: knowledge.summary,
        keyTakeaways: [
          `Deep understanding of "${title}" is required for both offensive assessment and defensive engineering.`,
          `Security controls must be applied at multiple layers rather than relying on perimeter filtering.`,
          `Continuous testing, auditing against CIS baselines, and active telemetry ensure resilience against evolving cyber threats.`
        ],
        quiz: knowledge.quiz.map((q, idx) => ({
          id: `mod${m}-les${l}-q${idx + 1}`,
          ...q
        })),
        practicalExercise: knowledge.practicalExercise,
        interactiveTool
      });
    }
  }

  return allLessons;
}

export const ALL_LESSONS = generateAllCurriculumLessons();
