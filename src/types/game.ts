export type TreasureRarity = 'common' | 'rare' | 'epic';

export interface Treasure {
  id: string;
  name: string;
  rarity: TreasureRarity;
  iconKey: string;
}

export interface MathMission {
  question: string;
  choices: number[];
  answer: number;
  hint: string;
}

export interface GameState {
  // タイマー
  timeLeft: number;
  isTimerRunning: boolean;

  // スコア・進行
  score: number;
  treasuresCollected: Treasure[];
  currentSpot: number;
  totalSpots: number;

  // ミッション
  currentMission: MathMission | null;
  isAnswering: boolean;

  // ロボ
  robotDialog: string;
  isRobotTalking: boolean;
}

