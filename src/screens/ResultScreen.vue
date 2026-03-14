<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { generateRobotDialog } from '../services/claudeApi';

const emit = defineEmits<{
  (e: 'restart'): void;
}>();

const game = useGameStore();
const praise = ref('すごい！ いっぱい あつめたね！');

const handleRestart = (): void => {
  emit('restart');
};

onMounted(async () => {
  const dialog = await generateRobotDialog(praise.value);
  praise.value = dialog;
});
</script>

<template>
  <div class="result">
    <div class="result__card">
      <h1 class="result__title">けっか</h1>
      <p class="result__score">
        スコア:
        <span class="result__score-value">
          {{ game.score }}
        </span>
      </p>

      <div class="result__praise">
        <p class="result__praise-text">
          {{ praise }}
        </p>
      </div>

      <div class="result__treasures">
        <h2 class="result__subtitle">あつめた たから</h2>
        <div v-if="game.treasuresCollected.length > 0" class="result__treasure-list">
          <div
            v-for="treasure in game.treasuresCollected"
            :key="treasure.id"
            class="result__treasure"
            :data-rarity="treasure.rarity"
          >
            <div class="result__treasure-icon">
              {{ treasure.iconKey }}
            </div>
            <p class="result__treasure-name">
              {{ treasure.name }}
            </p>
          </div>
        </div>
        <p v-else class="result__empty">
          こんどは たからを みつけよう！
        </p>
      </div>

      <button type="button" class="result__restart" @click="handleRestart">
        もういちど あそぶ
      </button>
    </div>
  </div>
</template>

<style scoped>
.result {
  min-height: 100vh;
  padding: 24px 16px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(#87ceeb, #3a8c3f);
  font-family: 'YuGothic', 'Yu Gothic', 'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', sans-serif;
  font-weight: 700;
}

.result__card {
  width: 100%;
  max-width: 960px;
  background-color: #fff9e6;
  border-radius: 32px;
  padding: 24px 24px 32px;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.18);
  text-align: center;
}

.result__title {
  margin: 0 0 16px;
  font-size: 36px;
}

.result__score {
  margin: 0 0 16px;
  font-size: 26px;
}

.result__score-value {
  font-size: 32px;
  color: #ff8c00;
}

.result__praise {
  margin-bottom: 20px;
}

.result__praise-text {
  margin: 0;
  font-size: 26px;
  color: #333333;
}

.result__treasures {
  margin-bottom: 24px;
}

.result__subtitle {
  margin: 0 0 12px;
  font-size: 28px;
}

.result__treasure-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.result__treasure {
  min-width: 120px;
  min-height: 80px;
  padding: 12px 16px;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.result__treasure[data-rarity='rare'] {
  background-color: #e5f3ff;
}

.result__treasure[data-rarity='epic'] {
  background-color: #fff3c4;
}

.result__treasure-icon {
  font-size: 28px;
}

.result__treasure-name {
  margin: 0;
  font-size: 22px;
}

.result__empty {
  margin: 0;
  font-size: 24px;
}

.result__restart {
  margin-top: 12px;
  min-width: 240px;
  min-height: 80px;
  border-radius: 40px;
  border: none;
  background-color: #ff8c00;
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.2);
  transition:
    transform 0.15s ease-out,
    box-shadow 0.15s ease-out,
    filter 0.15s ease-out;
}

.result__restart:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
  filter: brightness(0.95);
}
</style>

