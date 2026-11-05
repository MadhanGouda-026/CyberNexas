import { Achievement } from '../types';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'Initiate Access',
    description: 'Complete your very first cybersecurity lesson on CyberNexus.',
    category: 'Lessons',
    icon: 'BookOpen',
    xp: 50
  },
  {
    id: 'five-lessons',
    title: 'Knowledge Builder',
    description: 'Complete 5 lessons across any curriculum modules.',
    category: 'Lessons',
    icon: 'Award',
    xp: 100
  },
  {
    id: 'module-complete',
    title: 'Module Graduate',
    description: 'Complete all 25 lessons of an entire cybersecurity module.',
    category: 'Mastery',
    icon: 'GraduationCap',
    xp: 300
  },
  {
    id: 'first-lab',
    title: 'Hands on the Keystrokes',
    description: 'Successfully complete your first practical cyber lab.',
    category: 'Labs',
    icon: 'Terminal',
    xp: 100
  },
  {
    id: 'first-flag',
    title: 'Capture The Flag',
    description: 'Submit your first verified CTF flag in the arena.',
    category: 'CTF',
    icon: 'Flag',
    xp: 100
  },
  {
    id: 'first-mission',
    title: 'Incident Responder',
    description: 'Investigate and solve your first story-mode cyber mission.',
    category: 'Labs',
    icon: 'ShieldAlert',
    xp: 150
  },
  {
    id: 'siem-analyst',
    title: 'SOC Defender',
    description: 'Triage security events and inspect correlation rules in the SIEM dashboard.',
    category: 'Labs',
    icon: 'Activity',
    xp: 80
  },
  {
    id: 'packet-sniffer',
    title: 'Protocol Dissector',
    description: 'Inspect packet layer frames and hex dumps in the Packet Analyzer.',
    category: 'Mastery',
    icon: 'Binary',
    xp: 80
  },
  {
    id: 'docker-lab-operator',
    title: 'Container Commander',
    description: 'Launch an isolated Docker container lab environment.',
    category: 'Mastery',
    icon: 'Box',
    xp: 120
  },
  {
    id: 'xp-500',
    title: 'Cyber Sentinel',
    description: 'Accumulate 500 total XP points across exercises and challenges.',
    category: 'Streaks',
    icon: 'Zap',
    xp: 200
  }
];
