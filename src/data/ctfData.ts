import { CTFChallenge } from '../types';

export const CTF_CHALLENGES: CTFChallenge[] = [
  {
    id: 'ctf-gk-01',
    title: 'The Port Authority',
    category: 'General Knowledge',
    difficulty: 'Beginner',
    points: 50,
    description: 'An old mainframe server is running an unencrypted remote administration protocol, a DNS nameserver, and an encrypted secure shell. Sum up their default standard IANA port numbers and submit the flag formatted as CN{sum_of_ports}.',
    hints: [
      'What is the standard port for Telnet?',
      'What is the standard port for DNS?',
      'What is the standard port for SSH?',
      'Calculate: 23 (Telnet) + 53 (DNS) + 22 (SSH).'
    ],
    flag: 'CN{98}',
    explanation: 'Telnet operates on TCP port 23, DNS uses UDP/TCP port 53, and SSH operates on TCP port 22. The sum is 23 + 53 + 22 = 98.',
    solvedCount: 1420,
    author: 'CyberNexus Academy'
  },
  {
    id: 'ctf-web-01',
    title: 'The Inspector\'s Cookie',
    category: 'Web Security',
    difficulty: 'Beginner',
    points: 75,
    description: 'An internal HR portal stores the current user authorization tier in a Base64-encoded client cookie named `auth_state`. A guest user inspects their cookies and sees: `eyJyb2xlIjoidmlzaXRvciIsImlzQWRtaW4iOmZhbHNlfQ==`. What should the cookie be modified to in order to claim administrator privileges?',
    hints: [
      'Decode the Base64 cookie to JSON: {"role":"visitor","isAdmin":false}',
      'Change "visitor" to "admin" and "isAdmin": true.',
      'Re-encode to Base64 to generate the payload, or discover the flag embedded in the admin challenge endpoint!'
    ],
    flag: 'CN{b4s364_c00k13_m4n1pul4t10n_3xp0s3d}',
    explanation: 'Relying on client-side cookies for authorization without cryptographic signatures (such as HMAC in signed JWTs) allows users to alter claims, elevating privileges effortlessly.',
    solvedCount: 980,
    author: 'WebSec Division'
  },
  {
    id: 'ctf-crypto-01',
    title: 'Julius\'s Shifty Secret',
    category: 'Cryptography',
    difficulty: 'Beginner',
    points: 50,
    description: 'Intercepted encrypted transmission: `FRQI{f43v4u_p1sk3u_g0q_fbsk3u_m4vw3u}`. The cipher uses a classical Latin letter shift of 3 positions backwards (Caesar Cipher ROT-3). Decrypt the ciphertext to retrieve the flag.',
    hints: [
      'Shift each alphabetical letter backwards by 3 positions.',
      'F -> C, R -> O, Q -> N, I -> F... Wait, look at the prefix "CN{"!',
      'Apply ROT-23 (or shift left by 3 positions).'
    ],
    flag: 'CN{c41s4r_c1ph3r_d0n_c1ph3r_j4st3r}',
    explanation: 'Caesar cipher shifts each letter in the alphabet by a fixed offset. Because the alphabet contains only 26 possible rotations, Caesar ciphers can be trivially broken via brute force or frequency analysis.',
    solvedCount: 1890,
    author: 'Crypta'
  },
  {
    id: 'ctf-linux-01',
    title: 'The Grep in the Haystack',
    category: 'Linux',
    difficulty: 'Intermediate',
    points: 100,
    description: 'A rogue developer hid a flag inside a massive server log file `/var/log/syslog.dump`. The line containing the flag begins with "CRITICAL_FLAG:" followed by 32 hexadecimal characters. What is the full flag string?',
    hints: [
      'Use grep with regular expressions: grep -E "CRITICAL_FLAG:[a-f0-9]{32}"',
      'The simulated flag value is: CN{gr3p_r3g3x_m4st3r_sysl0g_h4unt}'
    ],
    flag: 'CN{gr3p_r3g3x_m4st3r_sysl0g_h4unt}',
    explanation: 'Regular expressions with grep (`grep -E` or `egrep`) allow security analysts to search millions of log lines within seconds to extract Indicators of Compromise (IOCs) and leaked credentials.',
    solvedCount: 654,
    author: 'SysAdmin Ops'
  },
  {
    id: 'ctf-forensics-01',
    title: 'The Ghost in the Metadata',
    category: 'Digital Forensics',
    difficulty: 'Intermediate',
    points: 125,
    description: 'An image file named `classified_blueprint.jpg` was leaked on a dark web forum. An analyst ran `exiftool` on the image and discovered a hidden comment field containing GPS coordinates and an encoded secret string: `Q057ZXhpZl9tM3RhZDR0YV9sMzRrXzIwMjZ9`. Decode this forensic artifact.',
    hints: [
      'The string ends with `=` which is classic Base64 padding.',
      'Decode the string in your terminal with: `echo "Q057..." | base64 -d`.'
    ],
    flag: 'CN{exif_m3tad4ta_l34k_2026}',
    explanation: 'EXIF metadata embedded in JPEG and PNG images often inadvertently retains author names, camera serials, timestamps, and GPS geolocations, posing severe OPSEC risks unless stripped prior to publishing.',
    solvedCount: 742,
    author: 'Forensic Lab'
  },
  {
    id: 'ctf-net-01',
    title: 'The Rogue Handshake',
    category: 'Networking',
    difficulty: 'Advanced',
    points: 150,
    description: 'During a network capture, a client sent a TCP SYN packet with Sequence Number `0x1337BEEF`. The server responded with a standard SYN-ACK. What was the exact 32-bit hexadecimal Acknowledgment Number sent by the server in that response?',
    hints: [
      'The ACK number in a TCP SYN-ACK acknowledges receipt of the SYN by adding 1 to the client sequence number.',
      'Calculate: 0x1337BEEF + 1.',
      'Submit the answer formatted as: CN{0x1337bef0} (lowercase hex).'
    ],
    flag: 'CN{0x1337bef0}',
    explanation: 'In the TCP state machine, the server acknowledges the SYN by setting the ACK field to ISN_client + 1, signaling that it anticipates receiving the next byte starting at that incremented sequence number.',
    solvedCount: 420,
    author: 'NetOps Division'
  }
];
