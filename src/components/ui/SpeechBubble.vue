<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <div class="speech-bubble">
    <p class="speech-bubble__text">
      {{ text }}
    </p>
  </div>
</template>

<style scoped>
.speech-bubble {
  max-width: 280px;
  background-color: #fff9e6;
  border-radius: 24px;
  padding: 16px 20px;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15);
  position: relative;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 12px 12px 12px;
  border-style: solid;
  border-color: transparent transparent #fff9e6 transparent;
}

.speech-bubble__text {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #333333;
}
</style>
