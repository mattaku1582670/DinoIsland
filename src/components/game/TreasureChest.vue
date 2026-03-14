<script setup lang="ts">
import { onMounted, watch, ref, nextTick } from 'vue';
import { gsap } from 'gsap';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'finished'): void;
}>();

const chestRef = ref<HTMLDivElement | null>(null);
const lidRef = ref<HTMLDivElement | null>(null);
const sparklesRef = ref<HTMLDivElement | null>(null);

const playAnimation = (): void => {
  if (!chestRef.value || !lidRef.value || !sparklesRef.value) {
    return;
  }

  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    onComplete: () => {
      emit('finished');
    },
  });

  tl.fromTo(
    chestRef.value,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4 },
  )
    .fromTo(
      lidRef.value,
      { rotate: 0 },
      { rotate: -45, transformOrigin: 'left bottom', duration: 0.4 },
      '-=0.1',
    )
    .fromTo(
      sparklesRef.value,
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 0.4 },
    );
};

onMounted(() => {
  if (props.visible) {
    playAnimation();
  }
});

watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      await nextTick();
      playAnimation();
    }
  },
);
</script>

<template>
  <div v-if="visible" class="chest-overlay">
    <div ref="chestRef" class="chest">
      <div ref="lidRef" class="chest__lid" />
      <div class="chest__box" />
      <div ref="sparklesRef" class="chest__sparkles">
        <div class="chest__sparkle chest__sparkle--1" />
        <div class="chest__sparkle chest__sparkle--2" />
        <div class="chest__sparkle chest__sparkle--3" />
      </div>
      <p class="chest__message">やったー！たからを ゲットしたよ！</p>
    </div>
  </div>
</template>

<style scoped>
.chest-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.4), rgba(0, 0, 0, 0.4));
  z-index: 40;
}

.chest {
  min-width: 260px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.chest__lid {
  width: 200px;
  height: 50px;
  border-radius: 20px 20px 8px 8px;
  background: linear-gradient(145deg, #c77f00, #ffb733);
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.25);
}

.chest__box {
  width: 220px;
  height: 90px;
  border-radius: 8px 8px 16px 16px;
  background: linear-gradient(145deg, #8b4a00, #c77f00);
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.35);
  position: relative;
}

.chest__box::before {
  content: '';
  position: absolute;
  inset: 12px 40%;
  border-radius: 999px;
  background-color: #ffd700;
}

.chest__sparkles {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 80px;
  pointer-events: none;
}

.chest__sparkle {
  position: absolute;
  width: 18px;
  height: 18px;
  background-color: #ffd700;
  border-radius: 50%;
  box-shadow: 0 0 16px rgba(255, 215, 0, 0.9);
  animation: sparkle-pulse 1.2s ease-in-out infinite;
}

.chest__sparkle--1 {
  top: 10px;
  left: 10px;
}

.chest__sparkle--2 {
  top: 0;
  right: 16px;
  animation-delay: 0.2s;
}

.chest__sparkle--3 {
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0.4s;
}

.chest__message {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 3px 0 rgba(0, 0, 0, 0.4);
  text-align: center;
}

@keyframes sparkle-pulse {
  0%,
  100% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}
</style>

