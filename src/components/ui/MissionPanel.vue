<script setup lang="ts">
import type { MathMission } from '../../types/game';

const props = defineProps<{
  mission: MathMission | null;
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', value: number): void;
}>();

const handleSelect = (value: number): void => {
  if (props.disabled) {
    return;
  }
  emit('select', value);
};
</script>

<template>
  <div class="panel">
    <div class="panel__header">
      <span class="panel__label">さんすうミッション</span>
    </div>

    <div v-if="mission" class="panel__body">
      <p class="panel__question">
        {{ mission.question }}
      </p>

      <div class="panel__choices">
        <button
          v-for="choice in mission.choices"
          :key="choice"
          type="button"
          class="panel__choice"
          :disabled="disabled"
          @click="handleSelect(choice)"
        >
          {{ choice }}
        </button>
      </div>

      <p class="panel__hint">
        {{ mission.hint }}
      </p>
    </div>

    <div v-else class="panel__empty">
      まっててね…
    </div>
  </div>
</template>

<style scoped>
.panel {
  width: 100%;
  max-width: 960px;
  background-color: #fff9e6;
  border-radius: 32px;
  padding: 24px 24px 28px;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.18);
}

.panel__header {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.panel__label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 18px;
  border-radius: 999px;
  background-color: #ff8c00;
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
}

.panel__body {
  text-align: center;
}

.panel__question {
  margin: 0 0 20px;
  font-size: 28px;
  font-weight: 700;
  color: #333333;
}

.panel__choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.panel__choice {
  min-height: 80px;
  border-radius: 24px;
  border: none;
  background-color: #ffffff;
  color: #333333;
  font-size: 28px;
  font-weight: 700;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.16);
  cursor: pointer;
  transition:
    transform 0.1s ease-out,
    box-shadow 0.1s ease-out,
    background-color 0.1s ease-out;
}

.panel__choice:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffe6b3;
}

.panel__choice:disabled {
  opacity: 0.6;
  cursor: default;
}

.panel__hint {
  margin: 0;
  font-size: 24px;
  color: #666666;
}

.panel__empty {
  text-align: center;
  font-size: 24px;
  color: #666666;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.panel__empty::after {
  content: '●●●';
  font-size: 24px;
  letter-spacing: 2px;
  animation: dots-blink 1s infinite ease-in-out;
}

@keyframes dots-blink {
  0%,
  20% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  80%,
  100% {
    opacity: 0.2;
  }
}

@media (min-width: 768px) {
  .panel__choices {
    flex-direction: row;
  }
}
</style>

