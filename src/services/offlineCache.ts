import Dexie, { type Table } from 'dexie';
import type { MathMission } from '../types/game';

interface CachedMission extends MathMission {
  id?: number;
  createdAt: number;
}

class MissionDatabase extends Dexie {
  missions!: Table<CachedMission, number>;

  constructor() {
    super('DinoIslandMissions');
    this.version(1).stores({
      missions: '++id, createdAt',
    });
  }
}

const db = new MissionDatabase();

const FALLBACK_MISSIONS: MathMission[] = [
  {
    question: '2 + 3 は いくつ？',
    choices: [5, 4, 6],
    answer: 5,
    hint: 'ゆびを 5ぽん たてて みよう',
  },
  {
    question: '6 - 2 は いくつ？',
    choices: [4, 3, 5],
    answer: 4,
    hint: '6から 2 を ひくよ',
  },
  {
    question: '1 + 4 は いくつ？',
    choices: [3, 5, 6],
    answer: 5,
    hint: '1に 4 を たすよ',
  },
  {
    question: '7 - 3 は いくつ？',
    choices: [4, 5, 3],
    answer: 4,
    hint: '7から 3 を ひいて かんがえよう',
  },
  {
    question: '3 + 2 は いくつ？',
    choices: [5, 4, 6],
    answer: 5,
    hint: '3と 2 を あわせて みよう',
  },
];

export async function ensureSeedMissions(): Promise<void> {
  const count = await db.missions.count();
  if (count > 0) {
    return;
  }

  const now = Date.now();
  const missions: CachedMission[] = [];

  for (let index = 0; index < 10; index += 1) {
    const base = FALLBACK_MISSIONS[index % FALLBACK_MISSIONS.length];
    missions.push({
      ...base,
      createdAt: now + index,
    });
  }

  await db.missions.bulkAdd(missions);
}

export async function getCachedMission(): Promise<MathMission | null> {
  const first = await db.missions.orderBy('createdAt').first();
  if (!first || typeof first.id === 'undefined') {
    return null;
  }

  await db.missions.delete(first.id);
  const { question, choices, answer, hint } = first;
  return { question, choices, answer, hint };
}

export async function pushMission(mission: MathMission): Promise<void> {
  await db.missions.add({
    ...mission,
    createdAt: Date.now(),
  });
}

export function getFallbackMissions(): MathMission[] {
  return FALLBACK_MISSIONS;
}

