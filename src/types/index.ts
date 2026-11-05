export type ThemeMode = 'light' | 'dark' | 'system';

export type DifficultyLevel = 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper Intermediate' | 'Advanced';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticalExercise {
  title: string;
  scenario: string;
  steps: string[];
  expectedResult: string;
  hint?: string;
  verificationQuestion?: string;
  verificationAnswer?: string;
}

export interface Lesson {
  id: string; // e.g. "mod1-les1"
  moduleNumber: number; // 1 to 15
  lessonNumber: number; // 1 to 25
  title: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  objectives: string[];
  introduction: string;
  detailedExplanation: string;
  keyConcepts: { term: string; definition: string }[];
  realWorldExample: string;
  commonMistakes: string[];
  bestPractices: string[];
  summary: string;
  keyTakeaways: string[];
  quiz: QuizQuestion[];
  practicalExercise: PracticalExercise;
  interactiveTool?: 'osi' | 'tcp' | 'dns' | 'crypto' | 'firewall' | 'ir' | 'terminal';
}

export interface ModuleInfo {
  number: number;
  id: string;
  title: string;
  tagline: string;
  category: 'Fundamentals' | 'Systems' | 'Offensive' | 'Defensive' | 'Operations' | 'Specialized';
  icon: string;
  color: string;
  gradient: string;
  totalLessons: number; // 25
  description: string;
  levelRange: string;
}

export interface DockerResourceLimits {
  cpu: string;
  memory: string;
  pids: number;
  isolation: string;
}

export interface DockerSessionInfo {
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

export interface DockerEngineStatus {
  available: boolean;
  version?: string;
  os?: string;
  containers?: number;
  error?: string;
  checkedAt?: string;
}

export interface Lab {
  id: string;
  title: string;
  category: 'Linux' | 'Python' | 'Networking' | 'Web Security' | 'Cryptography' | 'Ethical Hacking' | 'Vulnerability Assessment' | 'Log Analysis' | 'Network Defense' | 'Digital Forensics' | 'Incident Response';
  difficulty: DifficultyLevel;
  durationMinutes: number;
  xpReward: number;
  scenario: string;
  learningObjectives: string[];
  requirements: string[];
  instructions: string[];
  practicalTask: string;
  hints: string[];
  expectedOutput: string;
  flag: string; // e.g. "CN{...}"
  explanation: string;
  initialTerminalCommands?: { [cmd: string]: string };
  dockerSupported?: boolean;
  dockerImage?: string;
  dockerResourceLimits?: DockerResourceLimits;
}

export interface CTFChallenge {
  id: string;
  title: string;
  category: 'General Knowledge' | 'Linux' | 'Networking' | 'Web Security' | 'Cryptography' | 'Digital Forensics' | 'Log Analysis' | 'Security Fundamentals';
  difficulty: DifficultyLevel;
  points: number;
  description: string;
  hints: string[];
  flag: string;
  explanation: string;
  solvedCount: number;
  author: string;
  artifacts?: { name: string; content: string; type: string }[];
}

export interface Mission {
  id: string;
  title: string;
  codename: string;
  tier: 'Beginner' | 'Intermediate' | 'Advanced';
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  story: string;
  scenario: string;
  objectives: string[];
  evidence: { label: string; details: string; type: 'log' | 'pcap' | 'email' | 'artifact' }[];
  tasks: { id: string; description: string; expectedInput: string; xp: number }[];
  hints: string[];
  explanation: string;
  xpRewards: number;
}

export interface SIEMLog {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  port: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'SSH' | 'DNS';
  action: 'ALLOW' | 'BLOCK' | 'ALERT' | 'DROP';
  severity: 'Informational' | 'Low' | 'Medium' | 'High' | 'Critical';
  signature: string;
  category: 'Authentication' | 'Malware' | 'Intrusion' | 'Network Scan' | 'Policy Violation';
  rawPayload: string;
}

export interface PacketItem {
  id: number;
  time: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
  hexDump: string;
  layers: {
    frame: string;
    ethernet: string;
    ip: string;
    transport: string;
    payload?: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'Lessons' | 'Labs' | 'CTF' | 'Mastery' | 'Streaks';
  icon: string;
  xp: number;
  unlockedAt?: string;
  isSecret?: boolean;
}

export interface UserProgress {
  completedLessons: string[]; // lesson ids e.g. "mod1-les1"
  completedLabs: string[];
  completedCtfs: string[];
  completedMissions: string[];
  bookmarkedLessons: string[];
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  theme: ThemeMode;
  userProfile: {
    username: string;
    avatar: string;
    bio: string;
    specialization: string;
    joinedDate: string;
  };
  unlockedAchievements: string[];
}
