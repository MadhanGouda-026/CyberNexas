import { Lesson, ModuleInfo } from '../../types';
import { MODULES } from '../modulesData';
import { ALL_LESSONS } from './curriculumGenerator';

export { ALL_LESSONS } from './curriculumGenerator';
export { MODULE_LESSON_TITLES } from './titles';

export function getLessonsByModule(moduleNumber: number): Lesson[] {
  return ALL_LESSONS.filter(lesson => lesson.moduleNumber === moduleNumber);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return ALL_LESSONS.find(lesson => lesson.id === lessonId);
}

export function getModuleInfo(moduleNumber: number): ModuleInfo | undefined {
  return MODULES.find(m => m.number === moduleNumber);
}

export function searchLessons(query: string, moduleFilter?: number, difficultyFilter?: string): Lesson[] {
  const q = query.trim().toLowerCase();
  return ALL_LESSONS.filter(lesson => {
    if (moduleFilter && lesson.moduleNumber !== moduleFilter) return false;
    if (difficultyFilter && lesson.difficulty !== difficultyFilter) return false;
    if (!q) return true;
    return (
      lesson.title.toLowerCase().includes(q) ||
      lesson.summary.toLowerCase().includes(q) ||
      lesson.keyConcepts.some(kc => kc.term.toLowerCase().includes(q) || kc.definition.toLowerCase().includes(q))
    );
  });
}

export const TOTAL_LESSONS_COUNT = ALL_LESSONS.length; // exactly 375
export const TOTAL_MODULES_COUNT = MODULES.length; // 15
