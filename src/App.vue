<script setup lang="ts">
import { ref } from 'vue';
import TitleScreen from './screens/TitleScreen.vue';
import AdventureScreen from './screens/AdventureScreen.vue';
import ResultScreen from './screens/ResultScreen.vue';
import { useGameStore } from './stores/gameStore';

type Screen = 'title' | 'adventure' | 'result';

const currentScreen = ref<Screen>('title');
const game = useGameStore();

const handleStart = (): void => {
  game.resetGame();
  currentScreen.value = 'adventure';
};

const handleAdventureFinish = (): void => {
  currentScreen.value = 'result';
};

const handleRestart = (): void => {
  game.resetGame();
  currentScreen.value = 'title';
};
</script>

<template>
  <TitleScreen v-if="currentScreen === 'title'" @start="handleStart" />
  <AdventureScreen v-else-if="currentScreen === 'adventure'" @finish="handleAdventureFinish" />
  <ResultScreen v-else @restart="handleRestart" />
</template>
