<script setup lang="ts">
import SpeechBubble from '../ui/SpeechBubble.vue';

const props = defineProps<{
  dialog: string;
  isTalking: boolean;
}>();
</script>

<template>
  <div class="robot">
    <img
      class="robot__img"
      :class="{ 'robot__img--talking': props.isTalking }"
      src="/sprites/robot.svg"
      alt="ロボット"
      width="120"
      height="160"
    />
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

.robot__img {
  width: 120px;
  height: 160px;
  filter: drop-shadow(0 6px 0 rgba(0, 0, 0, 0.18));
  transition: transform 0.3s ease-out;
}

.robot__img--talking {
  animation: robot-bounce 0.8s ease-in-out infinite;
}

@keyframes robot-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
