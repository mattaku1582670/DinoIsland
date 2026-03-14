<script setup lang="ts">
import SpeechBubble from '../ui/SpeechBubble.vue';

const props = defineProps<{
  dialog: string;
  isTalking: boolean;
}>();
</script>

<template>
  <div class="robot">
    <div class="robot__body" :class="{ 'robot__body--talking': props.isTalking }">
      <div class="robot__face">
        <div class="robot__eye robot__eye--left" />
        <div class="robot__eye robot__eye--right" />
        <div class="robot__mouth" />
      </div>
      <div class="robot__antenna" />
    </div>
    <SpeechBubble v-if="props.dialog" :text="props.dialog" />
  </div>
</template>

<style scoped>
.robot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.robot__body {
  width: 140px;
  height: 140px;
  border-radius: 32px;
  background: linear-gradient(145deg, #ffffff, #e0f0ff);
  box-shadow:
    0 6px 0 rgba(0, 0, 0, 0.2),
    inset 0 0 0 4px #4a90e2;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.3s ease-out;
}

.robot__body--talking {
  animation: robot-bounce 0.8s ease-in-out infinite;
}

.robot__face {
  width: 80px;
  height: 60px;
  border-radius: 24px;
  background-color: #4a90e2;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px;
}

.robot__eye {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #ffffff;
  position: relative;
  overflow: hidden;
}

.robot__eye::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #00bcd4;
}

.robot__mouth {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 10px;
  border-radius: 10px;
  background-color: #ffffff;
}

.robot__antenna {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 24px;
  border-radius: 6px;
  background-color: #4a90e2;
}

.robot__antenna::after {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #ffd700;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.8);
}


@keyframes robot-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
</style>

