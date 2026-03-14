<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import DinoIslandMap from '../components/game/DinoIslandMap.vue';
import RobotCharacter from '../components/game/RobotCharacter.vue';
import TreasureChest from '../components/game/TreasureChest.vue';
import MissionPanel from '../components/ui/MissionPanel.vue';
import TimerBar from '../components/ui/TimerBar.vue';
import { useGameStore } from '../stores/gameStore';
import { generateMathMission, generateRobotDialog } from '../services/claudeApi';
import { ensureSeedMissions, getCachedMission, getFallbackMissions } from '../services/offlineCache';
import { playBgm, playCorrect, playTreasure, playWrong, stopBgm } from '../services/audio';

const emit = defineEmits<{
  (e: 'finish'): void;
}>();

const game = useGameStore();

const isLoadingMission = ref(false);
const isChestVisible = ref(false);

let timerId: number | null = null;

const totalTime = computed(() => game.timeLeft > 0 || game.isTimerRunning ? 180 : 180);

const nextFallbackMission = (): ReturnType<typeof getFallbackMissions>[number] => {
  const list = getFallbackMissions();
  const index = game.score % list.length;
  return list[index];
};

const startTimerLoop = (): void => {
  if (timerId !== null) {
    return;
  }
  timerId = window.setInterval(() => {
    if (!game.isTimerRunning) {
      return;
    }
    game.tickTimer();
    if (game.timeLeft <= 0) {
      game.stopTimer();
      if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
      }
      emit('finish');
    }
  }, 1000);
};

const loadRobotDialog = async (): Promise<void> => {
  const fallback = 'いっしょに たんけん しよう！';
  const dialog = await generateRobotDialog(fallback);
  game.setRobotDialog(dialog);
};

const loadMission = async (): Promise<void> => {
  isLoadingMission.value = true;
  game.setMission(null);

  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;

  let missionFromCache: typeof getFallbackMissions extends () => (infer U)[] ? U | null : null =
    null;

  if (!offline) {
    missionFromCache = await getCachedMission();
  }

  const fallback = missionFromCache ?? nextFallbackMission();

  const mission = offline ? fallback : await generateMathMission(fallback);

  game.setMission(mission);
  isLoadingMission.value = false;
};

const handleChoice = async (value: number): Promise<void> => {
  if (!game.currentMission) {
    return;
  }

  if (value === game.currentMission.answer) {
    playCorrect();
    game.addScore(10);
    isChestVisible.value = true;
    playTreasure();
  } else {
    playWrong();
    const hintDialog = await generateRobotDialog('もう いちど やってみよう！');
    game.setRobotDialog(hintDialog);
  }
};

const handleChestFinished = async (): Promise<void> => {
  isChestVisible.value = false;
  if (game.currentSpot >= game.totalSpots - 1) {
    game.stopTimer();
    emit('finish');
    return;
  }
  game.moveToNextSpot();
  await loadMission();
};

onMounted(async () => {
  await ensureSeedMissions();
  game.resetGame();
  await loadRobotDialog();
  await loadMission();
  game.startTimer();
  playBgm();
  startTimerLoop();
});

onBeforeUnmount(() => {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
  stopBgm();
});
</script>

<template>
  <div class="adventure">
    <TimerBar :time-left="game.timeLeft" :total-time="totalTime" />

    <div class="adventure__stage">
      <DinoIslandMap :current-spot="game.currentSpot" :total-spots="game.totalSpots" />
    </div>

    <div class="adventure__robot">
      <RobotCharacter :dialog="game.robotDialog" :is-talking="game.isRobotTalking" />
    </div>

    <MissionPanel
      class="adventure__mission"
      :mission="game.currentMission"
      :disabled="isLoadingMission"
      @select="handleChoice"
    />

    <TreasureChest :visible="isChestVisible" @finished="handleChestFinished" />
  </div>
</template>

<style scoped>
.adventure {
  min-height: 100vh;
  padding: 24px 16px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: linear-gradient(#87ceeb, #3a8c3f);
  font-family: 'YuGothic', 'Yu Gothic', 'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', sans-serif;
  font-weight: 700;
}

.adventure__stage {
  margin-top: 8px;
}

.adventure__robot {
  margin-top: 8px;
}

.adventure__mission {
  margin-top: 8px;
}
</style>

