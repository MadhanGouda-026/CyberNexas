import React, { createContext, useContext, useEffect, useState } from 'react';
import { ALL_ACHIEVEMENTS } from '../data/achievementsData';
import { UserProgress } from '../types';

interface LevelInfo {
  level: number;
  rankTitle: string;
  currentXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

interface ProgressContextType {
  progress: UserProgress;
  completeLesson: (lessonId: string) => void;
  toggleBookmark: (lessonId: string) => void;
  completeLab: (labId: string, xpReward?: number) => void;
  completeCtf: (ctfId: string, points?: number) => void;
  completeMission: (missionId: string, xp?: number) => void;
  unlockAchievement: (achievementId: string) => void;
  addXp: (amount: number) => void;
  exportProgressJson: () => string;
  importProgressJson: (jsonStr: string) => boolean;
  resetProgress: () => void;
  updateProfile: (profile: Partial<UserProgress['userProfile']>) => void;
  levelInfo: LevelInfo;
}

const defaultProgress: UserProgress = {
  completedLessons: ['mod1-les1'], // 1 initial lesson marked as completed for warm start
  completedLabs: [],
  completedCtfs: [],
  completedMissions: [],
  bookmarkedLessons: [],
  xp: 120,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  theme: 'light',
  userProfile: {
    username: 'CyberOperative',
    avatar: 'shield',
    bio: 'Dedicated cybersecurity practitioner mastering offensive assessment and resilient defense.',
    specialization: 'Defensive Operations & SOC Analysis',
    joinedDate: 'November 2026'
  },
  unlockedAchievements: ['first-lesson']
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem('cybernexus_progress');
      if (stored) {
        return { ...defaultProgress, ...JSON.parse(stored) };
      }
    } catch {
      // fallback
    }
    return defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem('cybernexus_progress', JSON.stringify(progress));
  }, [progress]);

  const addXp = (amount: number) => {
    setProgress(prev => {
      const newXp = prev.xp + amount;
      const updatedAchievements = [...prev.unlockedAchievements];
      if (newXp >= 500 && !updatedAchievements.includes('xp-500')) {
        updatedAchievements.push('xp-500');
      }
      return {
        ...prev,
        xp: newXp,
        unlockedAchievements: updatedAchievements
      };
    });
  };

  const unlockAchievement = (achId: string) => {
    setProgress(prev => {
      if (prev.unlockedAchievements.includes(achId)) return prev;
      const ach = ALL_ACHIEVEMENTS.find(a => a.id === achId);
      const bonusXp = ach ? ach.xp : 50;
      return {
        ...prev,
        xp: prev.xp + bonusXp,
        unlockedAchievements: [...prev.unlockedAchievements, achId]
      };
    });
  };

  const completeLesson = (lessonId: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const newCompleted = [...prev.completedLessons, lessonId];
      const newAchievements = [...prev.unlockedAchievements];

      if (!newAchievements.includes('first-lesson')) {
        newAchievements.push('first-lesson');
      }
      if (newCompleted.length >= 5 && !newAchievements.includes('five-lessons')) {
        newAchievements.push('five-lessons');
      }

      return {
        ...prev,
        completedLessons: newCompleted,
        xp: prev.xp + 40,
        unlockedAchievements: newAchievements
      };
    });
  };

  const toggleBookmark = (lessonId: string) => {
    setProgress(prev => {
      const isBookmarked = prev.bookmarkedLessons.includes(lessonId);
      return {
        ...prev,
        bookmarkedLessons: isBookmarked
          ? prev.bookmarkedLessons.filter(id => id !== lessonId)
          : [...prev.bookmarkedLessons, lessonId]
      };
    });
  };

  const completeLab = (labId: string, xpReward = 150) => {
    setProgress(prev => {
      if (prev.completedLabs.includes(labId)) return prev;
      const newLabs = [...prev.completedLabs, labId];
      const newAchievements = [...prev.unlockedAchievements];
      if (!newAchievements.includes('first-lab')) {
        newAchievements.push('first-lab');
      }
      return {
        ...prev,
        completedLabs: newLabs,
        xp: prev.xp + xpReward,
        unlockedAchievements: newAchievements
      };
    });
  };

  const completeCtf = (ctfId: string, points = 100) => {
    setProgress(prev => {
      if (prev.completedCtfs.includes(ctfId)) return prev;
      const newCtfs = [...prev.completedCtfs, ctfId];
      const newAchievements = [...prev.unlockedAchievements];
      if (!newAchievements.includes('first-flag')) {
        newAchievements.push('first-flag');
      }
      return {
        ...prev,
        completedCtfs: newCtfs,
        xp: prev.xp + points,
        unlockedAchievements: newAchievements
      };
    });
  };

  const completeMission = (missionId: string, xp = 200) => {
    setProgress(prev => {
      if (prev.completedMissions.includes(missionId)) return prev;
      const newMissions = [...prev.completedMissions, missionId];
      const newAchievements = [...prev.unlockedAchievements];
      if (!newAchievements.includes('first-mission')) {
        newAchievements.push('first-mission');
      }
      return {
        ...prev,
        completedMissions: newMissions,
        xp: prev.xp + xp,
        unlockedAchievements: newAchievements
      };
    });
  };

  const exportProgressJson = () => {
    return JSON.stringify(progress, null, 2);
  };

  const importProgressJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed.xp === 'number') {
        setProgress({ ...defaultProgress, ...parsed });
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    localStorage.removeItem('cybernexus_progress');
  };

  const updateProfile = (profile: Partial<UserProgress['userProfile']>) => {
    setProgress(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        ...profile
      }
    }));
  };

  // Level calculation
  const calculateLevel = (xp: number): LevelInfo => {
    const thresholds = [
      { level: 1, min: 0, max: 250, rank: 'Cyber Initiate' },
      { level: 2, min: 250, max: 600, rank: 'Junior Analyst' },
      { level: 3, min: 600, max: 1200, rank: 'Security Specialist' },
      { level: 4, min: 1200, max: 2200, rank: 'Threat Hunter' },
      { level: 5, min: 2200, max: 3500, rank: 'Senior Architect' },
      { level: 6, min: 3500, max: 5500, rank: 'Cyber Commander' },
      { level: 7, min: 5500, max: 10000, rank: 'CyberNexus Legend' }
    ];

    const currentTier = thresholds.find(t => xp >= t.min && xp < t.max) || thresholds[thresholds.length - 1];
    const range = currentTier.max - currentTier.min;
    const progressInLevel = xp - currentTier.min;
    const percent = Math.min(100, Math.max(0, Math.round((progressInLevel / range) * 100)));

    return {
      level: currentTier.level,
      rankTitle: currentTier.rank,
      currentXp: xp,
      nextLevelXp: currentTier.max,
      progressPercent: percent
    };
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        completeLesson,
        toggleBookmark,
        completeLab,
        completeCtf,
        completeMission,
        unlockAchievement,
        addXp,
        exportProgressJson,
        importProgressJson,
        resetProgress,
        updateProfile,
        levelInfo: calculateLevel(progress.xp)
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export function useProgress(): ProgressContextType {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
