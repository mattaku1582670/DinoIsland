<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as PIXI from 'pixi.js';

const props = defineProps<{
  currentSpot: number;
  totalSpots: number;
}>();

const canvasContainerRef = ref<HTMLDivElement | null>(null);
let app: PIXI.Application | null = null;
let spots: PIXI.Graphics[] = [];
let robot: PIXI.Graphics | null = null;

const createStage = async (): Promise<void> => {
  if (!canvasContainerRef.value) {
    return;
  }

  app = new PIXI.Application();
  await app.init({
    background: '#3A8C3F',
    resizeTo: canvasContainerRef.value,
    antialias: true,
  });

  canvasContainerRef.value.appendChild(app.canvas);

  const width = app.screen.width;
  const height = app.screen.height;

  const path = new PIXI.Graphics();
  path.roundRect(40, height / 2 - 20, width - 80, 40, 20);
  path.fill('#2f6a33');
  app.stage.addChild(path);

  const step = (width - 140) / Math.max(props.totalSpots - 1, 1);
  spots = [];

  for (let index = 0; index < props.totalSpots; index += 1) {
    const spot = new PIXI.Graphics();
    const x = 70 + step * index;
    const y = height / 2;
    spot.circle(x, y, 18);
    spot.fill(index <= props.currentSpot ? '#ffd700' : '#ffffff');
    spot.stroke({ width: 4, color: 0x3a8c3f });
    app.stage.addChild(spot);
    spots.push(spot);
  }

  robot = new PIXI.Graphics();
  robot.roundRect(0, 0, 40, 40, 10);
  robot.fill('#4a90e2');
  robot.stroke({ width: 4, color: 0xffffff });
  app.stage.addChild(robot);

  updateRobotPosition();
};

const updateRobotPosition = (): void => {
  if (!app || !robot || spots.length === 0) {
    return;
  }

  const clampedIndex = Math.min(Math.max(props.currentSpot, 0), spots.length - 1);
  const targetSpot = spots[clampedIndex];
  const bounds = targetSpot.getBounds();
  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;

  robot.x = centerX - robot.width / 2;
  robot.y = centerY - robot.height - 10;
};

onMounted(() => {
  void createStage();
});

onBeforeUnmount(() => {
  if (app) {
    app.destroy(true);
    app = null;
  }
  spots = [];
  robot = null;
});

watch(
  () => props.currentSpot,
  () => {
    updateRobotPosition();

    if (!robot) {
      return;
    }

    const originalY = robot.y;
    let elapsed = 0;

    const ticker = app?.ticker;
    if (!ticker) {
      return;
    }

    const handleTick = (): void => {
      if (!robot) {
        ticker.remove(handleTick);
        return;
      }

      elapsed += 1;
      const progress = Math.min(elapsed / 30, 1);
      const offset = Math.sin(progress * Math.PI) * 10;
      robot.y = originalY - offset;

      if (progress >= 1) {
        robot.y = originalY;
        ticker.remove(handleTick);
      }
    };

    ticker.add(handleTick);
  },
);
</script>

<template>
  <div class="map">
    <div ref="canvasContainerRef" class="map__canvas" />
  </div>
</template>

<style scoped>
.map {
  width: 100%;
  max-width: 960px;
  aspect-ratio: 16 / 9;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.25);
  background-color: #3a8c3f;
}

.map__canvas {
  width: 100%;
  height: 100%;
}
</style>

