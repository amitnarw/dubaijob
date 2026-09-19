import { COURSE_VIDEOS } from '@/data/courseVideos';
import { Keys } from '@/data/storageKeys';
import { readJSON, writeJSON } from './storage';

export type ProgressMap = Record<string, 'done'>;

export async function getProgress(): Promise<ProgressMap> {
  return readJSON<ProgressMap>(Keys.courseProgress, {});
}

export async function markDone(videoId: string): Promise<ProgressMap> {
  const prev = await getProgress();
  const next: ProgressMap = { ...prev, [videoId]: 'done' };
  await writeJSON(Keys.courseProgress, next);
  return next;
}

export function progressStats(done: ProgressMap): { done: number; total: number; pct: number } {
  const total = COURSE_VIDEOS.length;
  const doneCount = COURSE_VIDEOS.filter((v) => done[v.id]).length;
  return { done: doneCount, total, pct: total === 0 ? 0 : Math.round((doneCount / total) * 100) };
}
