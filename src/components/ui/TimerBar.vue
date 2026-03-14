<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  timeLeft: number;
  totalTime: number;
}>();

const percentage = computed(() => {
  if (props.totalTime <= 0) {
    return 0;
  }
  const value = (props.timeLeft / props.totalTime) * 100;
  return Math.max(0, Math.min(100, value));
});
</script>

<template>
  <div class="timer">
    <div class="timer__label">
      のこり
      <span class="timer__seconds">
        {{ Math.max(0, Math.floor(timeLeft)) }}
      </span>
      びょう
    </div>
    <div class="timer__bar">
      <div class="timer__bar-fill" :style="{ width: `${percentage}%` }" />
    </div>
  </div>
</template>

<style scoped>
.timer {
  width: 100%;
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timer__label {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
}

.timer__seconds {
  font-size: 28px;
  margin: 0 4px;
}

.timer__bar {
  position: relative;
  width: 100%;
  height: 28px;
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.timer__bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #ffd700, #ff8c00);
  transition: width 0.25s ease-out;
}
</style>

