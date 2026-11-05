import { exec, execFile } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

export interface DockerStatus {
  available: boolean;
  version?: string;
  os?: string;
  containers?: number;
  error?: string;
  checkedAt: string;
}

export interface ActiveLabSession {
  sessionId: string;
  labId: string;
  containerId: string;
  containerName: string;
  image: string;
  status: 'running' | 'stopped' | 'starting' | 'error';
  startedAt: number;
  expiresAt: number;
  durationSeconds: number;
  remainingSeconds: number;
  cpuLimit: string;
  memoryLimit: string;
  pidsLimit: number;
  isolation: string;
  hostname: string;
  username: string;
  error?: string;
}

export interface LabDockerSpec {
  image: string;
  hostname: string;
  username: string;
  workdir: string;
  setupCommands: string[];
  env: Record<string, string>;
  cpuLimit: string;
  memoryLimit: string;
  pidsLimit: number;
  capDrop: string[];
  capAdd?: string[];
  network?: string;
}

// Docker specs for practical cybersecurity labs
export const LAB_DOCKER_SPECS: Record<string, LabDockerSpec> = {
  // 1. Linux Practical Lab
  'lab-linux-perm': {
    image: 'alpine:3.19',
    hostname: 'linux-sec-lab',
    username: 'student',
    workdir: '/home/student',
    setupCommands: [
      'adduser -D -s /bin/sh student',
      'echo "student:student123" | chpasswd',
      'mkdir -p /root /home/student/audit',
      'echo "CN{su1d_pr1v1l3g3_3sc4l4t10n_succ3ss}" > /root/flag.txt',
      'chmod 600 /root/flag.txt',
      // Create a vulnerable SUID binary simulator
      'cat << \'EOF\' > /usr/bin/backup_tool\n#!/bin/sh\nif [ "$1" = "--read" ] && [ -n "$2" ]; then\n  cat "$2"\nelse\n  echo "Backup Utility v1.02: Use --read <file>"\nfi\nEOF',
      'chmod 4755 /usr/bin/backup_tool',
      'cat << \'EOF\' > /home/student/README.txt\n=== Linux Security & Privilege Escalation Lab ===\nTarget: Locate SUID executables on this host.\nFlag location: /root/flag.txt\nHint: find / -perm -4000 2>/dev/null\nEOF',
      'chown -R student:student /home/student'
    ],
    env: {
      FLAG: 'CN{su1d_pr1v1l3g3_3sc4l4t10n_succ3ss}',
      LAB_ID: 'lab-linux-perm'
    },
    cpuLimit: '0.5',
    memoryLimit: '256m',
    pidsLimit: 100,
    capDrop: ['ALL'],
    capAdd: ['CHOWN', 'SETUID', 'SETGID', 'DAC_OVERRIDE'],
    network: 'none'
  },

  // 2. Python Practical Lab
  'lab-python-sec': {
    image: 'python:3.11-alpine',
    hostname: 'python-audit-node',
    username: 'student',
    workdir: '/home/student',
    setupCommands: [
      'adduser -D -s /bin/sh student',
      'mkdir -p /home/student',
      // Create a Python security auditing and parser challenge
      'cat << \'EOF\' > /home/student/auth_service.py\nimport os, sys, json, hashlib\n\nSECRET_FLAG = "CN{python_sandbox_code_exec_defended}"\nUSERS_DB = {"admin": hashlib.sha256(b"P@ssw0rd99").hexdigest(), "guest": "84983c60f7daadc1cb8698621f802c0d9f9a3c3c295c810748fb048115c186ec"}\n\ndef authenticate(token_data):\n    try:\n        # Evaluates token payload dictionary\n        data = eval(token_data)\n        if data.get("role") == "admin":\n            print(f"[SUCCESS] Admin access granted! Proof Flag: {SECRET_FLAG}")\n            return True\n        print(f"[DENIED] Insufficient role: {data.get(\'role\')}")\n        return False\n    except Exception as e:\n        print(f"[ERROR] Invalid token format: {e}")\n        return False\n\nif __name__ == "__main__":\n    if len(sys.argv) > 1:\n        authenticate(sys.argv[1])\n    else:\n        print("Usage: python3 auth_service.py \'{\\"user\\": \\"guest\\", \\"role\\": \\"guest\\"}\'")\nEOF',
      'cat << \'EOF\' > /home/student/README.txt\n=== Python Security & Insecure Deserialization Lab ===\nTarget: Examine auth_service.py and bypass authentication using object manipulation.\nCommand to test: python3 auth_service.py \'{"role": "admin"}\'\nEOF',
      'chown -R student:student /home/student'
    ],
    env: {
      FLAG: 'CN{python_sandbox_code_exec_defended}',
      LAB_ID: 'lab-python-sec'
    },
    cpuLimit: '0.5',
    memoryLimit: '256m',
    pidsLimit: 100,
    capDrop: ['ALL'],
    network: 'none'
  },

  // 3. Networking Practical Lab
  'lab-net-nmap': {
    image: 'alpine:3.19',
    hostname: 'network-probe-host',
    username: 'student',
    workdir: '/home/student',
    setupCommands: [
      'apk update && apk add --no-cache curl net-tools iproute2',
      'adduser -D -s /bin/sh student',
      'mkdir -p /home/student',
      // Start an internal simulated honeypot / FTP listener on localhost port 2121
      'cat << \'EOF\' > /home/student/start_service.sh\n#!/bin/sh\nwhile true; do\n  echo -e "220 vsftpd 2.3.4 (Anonymous allowed)\\r\\n230 Guest login ok.\\r\\nFLAG: CN{nm4p_p0rt_sc4n_s3rv1c3_d1sc0v3ry}\\r\\n" | nc -l -p 2121\ndone\nEOF',
      'chmod +x /home/student/start_service.sh',
      '/home/student/start_service.sh &',
      'cat << \'EOF\' > /home/student/README.txt\n=== Network Diagnostics & Socket Discovery Lab ===\nTarget: Discover listening TCP ports on localhost and grab the service banner.\nHelpful commands: netstat -tuln, nc 127.0.0.1 2121, curl 127.0.0.1:2121\nEOF',
      'chown -R student:student /home/student'
    ],
    env: {
      FLAG: 'CN{nm4p_p0rt_sc4n_s3rv1c3_d1sc0v3ry}',
      LAB_ID: 'lab-net-nmap'
    },
    cpuLimit: '0.5',
    memoryLimit: '256m',
    pidsLimit: 120,
    capDrop: ['ALL'],
    capAdd: ['NET_BIND_SERVICE', 'NET_RAW'],
    network: 'bridge'
  },

  // 4. Web Security Practical Lab
  'lab-sql-injection': {
    image: 'python:3.11-alpine',
    hostname: 'web-sec-node',
    username: 'student',
    workdir: '/home/student',
    setupCommands: [
      'adduser -D -s /bin/sh student',
      'mkdir -p /home/student /opt/webapp',
      // Create a lightweight standalone HTTP login verification server
      'cat << \'EOF\' > /opt/webapp/server.py\nfrom http.server import HTTPServer, BaseHTTPRequestHandler\nimport json, urllib.parse\n\nFLAG = "CN{sql_1nj3ct10n_4uth_byp4ss_m4st3r}"\n\nclass Handler(BaseHTTPRequestHandler):\n    def do_GET(self):\n        self.send_response(200)\n        self.send_header("Content-Type", "application/json")\n        self.send_header("X-Security-Policy", "Vulnerable-Legacy-Portal")\n        self.end_headers()\n        self.wfile.write(json.dumps({"service": "Staff Authentication Portal v2.1", "status": "active"}).encode())\n\n    def do_POST(self):\n        content_len = int(self.headers.get("Content-Length", 0))\n        body = self.rfile.read(content_len).decode("utf-8", errors="ignore")\n        params = urllib.parse.parse_qs(body)\n        user = params.get("username", [""])[0]\n        password = params.get("password", [""])[0]\n\n        # Simulated SQL query string construction: SELECT * FROM staff WHERE username=\'$user\' AND password=\'$pass\'\n        print(f"[SQL LOG] Executing query: SELECT * FROM staff WHERE username=\'{user}\' AND password=\'{password}\'")\n\n        # Tautology injection detection: admin\' OR 1=1 or admin\' -- or \' OR \'1\'=\'1\n        if ("\'" in user and ("1=1" in user or "OR" in user.upper() or "--" in user)) or (user == "admin" and password == "SuperSecret2026!"):\n            self.send_response(200)\n            self.send_header("Content-Type", "application/json")\n            self.end_headers()\n            res = {"status": "success", "authenticated": True, "role": "administrator", "flag": FLAG}\n            self.wfile.write(json.dumps(res).encode())\n        else:\n            self.send_response(401)\n            self.send_header("Content-Type", "application/json")\n            self.end_headers()\n            self.wfile.write(json.dumps({"status": "failed", "error": "Invalid credentials"}).encode())\n\nserver = HTTPServer(("127.0.0.1", 8080), Handler)\nprint("[WebSec] Portal listening on http://127.0.0.1:8080")\nserver.serve_forever()\nEOF',
      'python3 /opt/webapp/server.py &',
      'cat << \'EOF\' > /home/student/README.txt\n=== Web Security: SQL Injection & Authentication Bypass ===\nInternal target server is running on: http://127.0.0.1:8080\nTest authentication with curl:\n  curl -X POST http://127.0.0.1:8080 -d "username=admin&password=wrong"\nExploit the vulnerable SQL concatenation with:\n  curl -X POST http://127.0.0.1:8080 -d "username=admin\' OR 1=1--&password=x"\nEOF',
      'chown -R student:student /home/student'
    ],
    env: {
      FLAG: 'CN{sql_1nj3ct10n_4uth_byp4ss_m4st3r}',
      LAB_ID: 'lab-sql-injection'
    },
    cpuLimit: '0.5',
    memoryLimit: '256m',
    pidsLimit: 100,
    capDrop: ['ALL'],
    capAdd: ['NET_BIND_SERVICE'],
    network: 'bridge'
  }
};

class DockerService {
  private activeSessions: Map<string, ActiveLabSession> = new Map();
  private cleanupTimers: Map<string, NodeJS.Timeout> = new Map();
  private dockerStatusCache: { status: DockerStatus; timestamp: number } | null = null;
  private readonly CACHE_TTL_MS = 10000; // 10s status cache
  private readonly DEFAULT_LAB_DURATION_SECONDS = 900; // 15 minutes session

  constructor() {
    // Run orphan cleanup on server boot
    this.cleanupOrphanedContainers().catch(() => {});

    // Periodic sweep for expired sessions every 30 seconds
    setInterval(() => {
      this.sweepExpiredSessions().catch(() => {});
    }, 30000);
  }

  /**
   * Check if Docker Engine is installed and responsive
   */
  async checkStatus(): Promise<DockerStatus> {
    const now = Date.now();
    if (this.dockerStatusCache && now - this.dockerStatusCache.timestamp < this.CACHE_TTL_MS) {
      return this.dockerStatusCache.status;
    }

    try {
      // Execute docker version check
      const { stdout } = await execAsync('docker version --format "{{json .}}"', { timeout: 4000 });
      let parsed: any = {};
      try {
        parsed = JSON.parse(stdout.trim());
      } catch {
        // Fallback for plaintext output
      }

      const version = parsed?.Server?.Version || parsed?.Client?.Version || 'Active';
      const os = parsed?.Server?.Os || parsed?.Client?.Os || 'Host OS';

      let containerCount = 0;
      try {
        const countRes = await execAsync('docker ps -q | wc -l', { timeout: 3000 });
        containerCount = parseInt(countRes.stdout.trim(), 10) || 0;
      } catch {
        // count is optional
      }

      const status: DockerStatus = {
        available: true,
        version: `Docker Engine v${version}`,
        os,
        containers: containerCount,
        checkedAt: new Date().toISOString()
      };

      this.dockerStatusCache = { status, timestamp: now };
      return status;
    } catch (err: any) {
      const status: DockerStatus = {
        available: false,
        error: 'Docker Engine is not running or accessible. Please start Docker Desktop (Windows/macOS) or enable the systemd docker service (Linux).',
        checkedAt: new Date().toISOString()
      };
      this.dockerStatusCache = { status, timestamp: now };
      return status;
    }
  }

  /**
   * Launch a real isolated Docker container for a given lab
   */
  async launchLab(labId: string): Promise<ActiveLabSession> {
    const status = await this.checkStatus();
    if (!status.available) {
      throw new Error(
        'Docker Engine is not available. Please ensure Docker Desktop is started and running on your system.'
      );
    }

    // Stop existing container for this lab if already running
    if (this.activeSessions.has(labId)) {
      await this.stopLab(labId).catch(() => {});
    }

    const spec = LAB_DOCKER_SPECS[labId] || LAB_DOCKER_SPECS['lab-linux-perm'];
    const shortId = Math.random().toString(36).substring(2, 8);
    const containerName = `cybernexus-lab-${labId}-${shortId}`;
    const sessionId = `session-${shortId}`;

    // Security & isolation arguments
    const dockerArgs: string[] = [
      'run',
      '-d',
      '--name', containerName,
      '--label', 'cybernexus=true',
      '--label', `cybernexus_lab=${labId}`,
      '--hostname', spec.hostname,
      `--cpus=${spec.cpuLimit}`,
      `--memory=${spec.memoryLimit}`,
      `--pids-limit=${spec.pidsLimit}`,
      '--security-opt=no-new-privileges:true',
      '--restart=no'
    ];

    // Capabilities
    if (spec.capDrop && spec.capDrop.length > 0) {
      for (const cap of spec.capDrop) {
        dockerArgs.push(`--cap-drop=${cap}`);
      }
    }
    if (spec.capAdd && spec.capAdd.length > 0) {
      for (const cap of spec.capAdd) {
        dockerArgs.push(`--cap-add=${cap}`);
      }
    }

    // Network isolation
    if (spec.network) {
      dockerArgs.push(`--network=${spec.network}`);
    }

    // Environment variables
    for (const [key, value] of Object.entries(spec.env)) {
      dockerArgs.push('-e', `${key}=${value}`);
    }

    // Image and long-running keepalive entrypoint
    dockerArgs.push(spec.image);
    dockerArgs.push('/bin/sh', '-c', 'while true; do sleep 3600; done');

    // Run container
    const runResult = await execFileAsync('docker', dockerArgs, { timeout: 30000 });
    const containerId = runResult.stdout.trim().substring(0, 12);

    // Run setup commands inside the container
    if (spec.setupCommands && spec.setupCommands.length > 0) {
      for (const cmd of spec.setupCommands) {
        try {
          await execFileAsync('docker', ['exec', containerId, '/bin/sh', '-c', cmd], { timeout: 15000 });
        } catch (setupErr) {
          console.warn(`[DockerService] Warning during setup command (${cmd.substring(0, 30)}...):`, setupErr);
        }
      }
    }

    const now = Date.now();
    const expiresAt = now + this.DEFAULT_LAB_DURATION_SECONDS * 1000;

    const session: ActiveLabSession = {
      sessionId,
      labId,
      containerId,
      containerName,
      image: spec.image,
      status: 'running',
      startedAt: now,
      expiresAt,
      durationSeconds: this.DEFAULT_LAB_DURATION_SECONDS,
      remainingSeconds: this.DEFAULT_LAB_DURATION_SECONDS,
      cpuLimit: `${spec.cpuLimit} vCPU`,
      memoryLimit: spec.memoryLimit.toUpperCase(),
      pidsLimit: spec.pidsLimit,
      isolation: 'Sandboxed (No New Privileges, CapDrop ALL, Resource Capped)',
      hostname: spec.hostname,
      username: spec.username
    };

    this.activeSessions.set(labId, session);

    // Schedule auto-destruction after expiry
    const timer = setTimeout(async () => {
      console.log(`[DockerService] Session expired for lab ${labId}, tearing down container...`);
      await this.stopLab(labId).catch(() => {});
    }, this.DEFAULT_LAB_DURATION_SECONDS * 1000);

    this.cleanupTimers.set(labId, timer);

    return session;
  }

  /**
   * Stop and remove container cleanly
   */
  async stopLab(labId: string): Promise<{ success: boolean; message: string }> {
    const session = this.activeSessions.get(labId);

    // Clear auto-cleanup timer
    const existingTimer = this.cleanupTimers.get(labId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.cleanupTimers.delete(labId);
    }

    if (!session) {
      return { success: true, message: 'Lab container was not running.' };
    }

    try {
      // Force remove container
      await execAsync(`docker rm -f ${session.containerId}`, { timeout: 10000 });
    } catch (err: any) {
      console.warn(`[DockerService] Error removing container ${session.containerId}:`, err.message);
    }

    this.activeSessions.delete(labId);
    return { success: true, message: `Container ${session.containerName} stopped and destroyed cleanly.` };
  }

  /**
   * Execute command inside the running container
   */
  async executeCommand(labId: string, command: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    const session = this.activeSessions.get(labId);
    if (!session || session.status !== 'running') {
      throw new Error('Container is not running. Please click "Launch Lab" first.');
    }

    const trimmedCmd = command.trim();
    if (!trimmedCmd) {
      return { stdout: '', stderr: '', exitCode: 0 };
    }

    const spec = LAB_DOCKER_SPECS[labId] || LAB_DOCKER_SPECS['lab-linux-perm'];
    const workdir = spec.workdir || '/home/student';
    const user = spec.username || 'student';

    try {
      // Execute command inside container
      const { stdout, stderr } = await execFileAsync(
        'docker',
        ['exec', '-i', '-u', user, '-w', workdir, session.containerId, '/bin/sh', '-c', trimmedCmd],
        { timeout: 15000, maxBuffer: 1024 * 512 }
      );

      return {
        stdout: stdout || '',
        stderr: stderr || '',
        exitCode: 0
      };
    } catch (err: any) {
      return {
        stdout: err.stdout || '',
        stderr: err.stderr || err.message || 'Command execution error',
        exitCode: err.code || 1
      };
    }
  }

  /**
   * Retrieve active session status with remaining seconds
   */
  getSession(labId: string): ActiveLabSession | null {
    const session = this.activeSessions.get(labId);
    if (!session) return null;

    const remaining = Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));
    if (remaining <= 0) {
      this.stopLab(labId).catch(() => {});
      return null;
    }

    return {
      ...session,
      remainingSeconds: remaining
    };
  }

  /**
   * Sweep and destroy expired sessions
   */
  private async sweepExpiredSessions(): Promise<void> {
    const now = Date.now();
    for (const [labId, session] of this.activeSessions.entries()) {
      if (now >= session.expiresAt) {
        await this.stopLab(labId).catch(() => {});
      }
    }
  }

  /**
   * Clean up any leftover containers from previous server runs
   */
  private async cleanupOrphanedContainers(): Promise<void> {
    try {
      const { stdout } = await execAsync('docker ps -aq --filter "label=cybernexus=true"', { timeout: 5000 });
      const ids = stdout.trim().split(/\s+/).filter(Boolean);
      if (ids.length > 0) {
        console.log(`[DockerService] Pruning ${ids.length} orphaned CyberNexus container(s)...`);
        await execAsync(`docker rm -f ${ids.join(' ')}`, { timeout: 10000 });
      }
    } catch {
      // Docker may not be available on boot, non-fatal
    }
  }
}

export const dockerService = new DockerService();
