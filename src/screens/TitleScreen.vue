<script setup lang="ts">
const emit = defineEmits<{
  (e: 'start'): void;
}>();

const handleStartClick = (): void => {
  emit('start');
};
</script>

<template>
  <div class="title-screen">
    <div class="title-screen__sky">
      <div class="title-screen__content">
        <img class="title-screen__dino" src="/sprites/dino.svg" alt="きょうりゅう" />
        <h1 class="title-screen__logo">
          きょうりゅうの
          <span class="title-screen__logo-accent">しま</span>
          たんけん
        </h1>
        <p class="title-screen__subtitle">
          ロボと いっしょに
          <br />
          たからさがし に いこう！
        </p>
        <button type="button" class="title-screen__start-button" @click="handleStartClick">
          はじめる
        </button>
      </div>
    </div>
    <div class="title-screen__island" />
  </div>
</template>

<style scoped>
.title-screen {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'YuGothic', 'Yu Gothic', 'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', sans-serif;
  font-weight: 700;
}

.title-screen__sky {
  flex: 1;
  background-color: #87ceeb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.title-screen__island {
  height: 160px;
  background-color: #3a8c3f;
}

.title-screen__content {
  text-align: center;
  color: #ffffff;
}

.title-screen__dino {
  width: 160px;
  height: auto;
  margin-bottom: 8px;
  animation: dino-float 3s ease-in-out infinite;
  filter: drop-shadow(0 8px 6px rgba(0, 0, 0, 0.18));
}

@keyframes dino-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-14px);
  }
}

.title-screen__logo {
  font-size: 40px;
  line-height: 1.2;
  margin: 0 0 16px;
  text-shadow: 0 4px 0 rgba(0, 0, 0, 0.25);
}

.title-screen__logo-accent {
  color: #ffd700;
}

.title-screen__subtitle {
  font-size: 24px;
  margin: 0 0 32px;
  line-height: 1.4;
}

.title-screen__start-button {
  min-width: 200px;
  min-height: 80px;
  padding: 16px 32px;
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

.title-screen__start-button:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
  filter: brightness(0.95);
}

@media (min-width: 768px) {
  .title-screen__logo {
    font-size: 48px;
  }

  .title-screen__subtitle {
    font-size: 28px;
  }

  .title-screen__start-button {
    min-width: 240px;
    min-height: 96px;
    font-size: 32px;
  }
}
</style>

