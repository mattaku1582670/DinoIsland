import { defineStore } from 'pinia';
import type { GameState, MathMission, Treasure } from '../types/game';

const INITIAL_TIME_SECONDS = 180;
const TOTAL_SPOTS = 5;

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    timeLeft: INITIAL_TIME_SECONDS,
    isTimerRunning: false,
    score: 0,
    treasuresCollected: [],
    currentSpot: 0,
    totalSpots: TOTAL_SPOTS,
    currentMission: null,
    isAnswering: false,
    robotDialog: '',
    isRobotTalking: false,
  }),
  actions: {
    startTimer(): void {
      this.isTimerRunning = true;
    },
    stopTimer(): void {
      this.isTimerRunning = false;
    },
    resetTimer(): void {
      this.timeLeft = INITIAL_TIME_SECONDS;
      this.isTimerRunning = false;
    },
    tickTimer(): void {
      if (!this.isTimerRunning || this.timeLeft <= 0) {
        return;
      }
      this.timeLeft -= 1;
    },
    addScore(amount: number): void {
      if (amount <= 0) {
        return;
      }
      this.score += amount;
    },
    addTreasure(treasure: Treasure): void {
      this.treasuresCollected.push(treasure);
    },
    moveToNextSpot(): void {
      if (this.currentSpot < this.totalSpots - 1) {
        this.currentSpot += 1;
      }
    },
    setMission(mission: MathMission | null): void {
      this.currentMission = mission;
      this.isAnswering = mission !== null;
    },
    setRobotDialog(dialog: string): void {
      this.robotDialog = dialog;
      this.isRobotTalking = dialog.trim().length > 0;
    },
    resetGame(): void {
      this.timeLeft = INITIAL_TIME_SECONDS;
      this.isTimerRunning = false;
      this.score = 0;
      this.treasuresCollected = [];
      this.currentSpot = 0;
      this.totalSpots = TOTAL_SPOTS;
      this.currentMission = null;
      this.isAnswering = false;
      this.robotDialog = '';
      this.isRobotTalking = false;
    },
  },
});

