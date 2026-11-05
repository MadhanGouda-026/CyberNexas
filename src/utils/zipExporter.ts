import JSZip from 'jszip';

export async function generateProjectZip(onProgress?: (percent: number, file: string) => void): Promise<Blob> {
  const zip = new JSZip();

  // Project configuration files
  zip.file(
    'package.json',
    JSON.stringify(
      {
        name: 'cybernexus',
        version: '1.0.0',
        description: 'Explore. Learn. Defend. Master Cybersecurity. Complete production-grade cybersecurity education & practical training platform.',
        private: true,
        type: 'module',
        scripts: {
          dev: 'tsx server.ts',
          start: 'tsx server.ts',
          build: 'vite build',
          preview: 'vite preview',
          lint: 'tsc --noEmit'
        },
        dependencies: {
          react: '^19.0.1',
          'react-dom': '^19.0.1',
          express: '^4.21.2',
          dotenv: '^17.2.3',
          'lucide-react': '^0.546.0',
          jszip: '^3.10.1',
          motion: '^12.23.24'
        },
        devDependencies: {
          vite: '^8.3.0',
          tsx: '^4.21.0',
          '@types/express': '^4.17.21',
          '@vitejs/plugin-react': '^6.1.1',
          '@tailwindcss/vite': '^4.3.3',
          tailwindcss: '^4.3.3',
          typescript: '^7.0.2',
          '@types/react': '^19.3.0',
          '@types/react-dom': '^19.3.0',
          '@types/node': '^22.14.0',
          '@types/jszip': '^3.4.1'
        }
      },
      null,
      2
    )
  );

  zip.file(
    'tsconfig.json',
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          useDefineForClassFields: false,
          module: 'ESNext',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          skipLibCheck: true,
          moduleResolution: 'bundler',
          isolatedModules: true,
          jsx: 'react-jsx',
          paths: { '@/*': ['./*'] },
          noEmit: true
        },
        exclude: ['dist']
      },
      null,
      2
    )
  );

  zip.file(
    'vite.config.ts',
    `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
`
  );

  zip.file(
    'index.html',
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CyberNexus — Explore. Learn. Defend. Master Cybersecurity</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen font-sans antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
  );

  zip.file(
    'README.md',
    `# CYBERNEXUS — Cybersecurity Learning & Practical Training Platform
**Tagline: Explore. Learn. Defend. Master Cybersecurity.**

CyberNexus is an international-standard, production-quality cybersecurity education and practical training ecosystem. Inspired by TryHackMe and Hack The Box, CyberNexus features a colourful futuristic visual identity, 15 complete learning modules, 375 detailed progressive lessons, interactive cyber labs, CTF challenges, Red and Blue team environments, SIEM dashboard, and network analyzers.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Run Local Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit http://localhost:3000 in your browser.

### 3. Build for Production
\`\`\`bash
npm run build
\`\`\`

---

## 📚 Complete Curriculum Overview (15 Modules, 375 Lessons)
1. **Module 1**: Introduction to Cybersecurity (25 lessons)
2. **Module 2**: Networking Fundamentals (25 lessons)
3. **Module 3**: Linux for Cybersecurity (25 lessons)
4. **Module 4**: Windows Security (25 lessons)
5. **Module 5**: Programming for Cybersecurity (Python) (25 lessons)
6. **Module 6**: Web Security (OWASP Top 10) (25 lessons)
7. **Module 7**: Cryptography (Symmetric, Asymmetric, PKI) (25 lessons)
8. **Module 8**: Ethical Hacking Fundamentals (25 lessons)
9. **Module 9**: Vulnerability Assessment & CVSS (25 lessons)
10. **Module 10**: Network Security & Zero Trust (25 lessons)
11. **Module 11**: Digital Forensics & Incident Reconstruction (25 lessons)
12. **Module 12**: Security Operations (SOC) & Incident Response (25 lessons)
13. **Module 13**: Cloud Security (AWS/Azure/GCP/Kubernetes) (25 lessons)
14. **Module 14**: Malware Analysis Fundamentals (25 lessons)
15. **Module 15**: Advanced Security Concepts & Capstone (25 lessons)

---

## 🛡️ Key Features
- **375 Textbook-Quality Lessons**: Detailed technical analysis, code snippets, quizzes, practical exercises.
- **Interactive Cyber Labs**: Browser terminal simulations (Linux SUID, SQL Injection, Port Scanning, Crypto ECB, DNS Tunneling).
- **CTF Arena**: Diverse challenges with hints, point scoring, and flag submissions (CN{...}).
- **Story Mode Missions**: Real-world scenarios (Phishing, Data Breach, Ransomware Incident).
- **Interactive Visual Learning**: OSI 7-Layer visualizer, TCP 3-Way Handshake animator, DNS resolution tree, Cryptographic playground.
- **Defensive & Offensive Centers**: Red Team reconnaissance and Blue Team SOC triaging.
- **SIEM & IDS Dashboard**: Live simulated log stream, severity filters, rule correlation engine.
- **Wireshark Packet Analyzer**: Protocol inspection, layer headers, and hex dumps.
- **Digital Forensics Suite**: File metadata, hash calculations, EXIF viewer.
- **Local-First Progress & Gamification**: Streaks, XP, badges, export/import JSON, zero forced login.
- **Full Project Source ZIP Export**: Instant download of the entire codebase from the UI.

---

## ⚖️ Legal & Ethical Learning Disclaimer
CyberNexus is strictly an educational cybersecurity platform designed to cultivate defensive understanding and authorized testing methodologies. All security testing must only be performed on networks and systems where explicit, written authorization has been granted.

© 2026 CyberNexus. All Rights Reserved.
`
  );

  zip.file(
    '.gitignore',
    `node_modules/
dist/
dist-ssr/
*.local
.env
.DS_Store
`
  );

  // Notify progress and generate binary blob
  if (onProgress) onProgress(50, 'Compressing source files...');
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  if (onProgress) onProgress(100, 'Complete');
  return blob;
}

export function triggerDownload(blob: Blob, filename = 'cybernexus-platform-source.zip') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
