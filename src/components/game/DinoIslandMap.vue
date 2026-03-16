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
let robot: PIXI.Text | null = null;
let glowCircle: PIXI.Graphics | null = null;
let clouds: PIXI.Graphics[] = [];
const cloudSpeeds: number[] = [];

let stageWidth = 0;
let stageHeight = 0;
let spotStep = 0;

const SPOT_Y_RATIO = 0.62;

const makeCloud = (x: number, y: number): PIXI.Graphics => {
  const g = new PIXI.Graphics();
  g.circle(-24, 4, 18);
  g.fill(0xffffff);
  g.circle(0, 0, 24);
  g.fill(0xffffff);
  g.circle(26, 6, 18);
  g.fill(0xffffff);
  g.alpha = 0.82;
  g.x = x;
  g.y = y;
  return g;
};

const redrawSpots = (): void => {
  spots.forEach((spot, index) => {
    spot.clear();
    const x = 70 + spotStep * index;
    const y = stageHeight * SPOT_Y_RATIO;
    spot.circle(x, y, 20);
    spot.fill(index <= props.currentSpot ? '#ffd700' : '#ffffff');
    spot.stroke({ width: 4, color: 0x3a8c3f });
  });
};

const updateGlowPosition = (): void => {
  if (!glowCircle || spots.length === 0) return;
  const idx = Math.min(Math.max(props.currentSpot, 0), spots.length - 1);
  glowCircle.x = 70 + spotStep * idx;
  glowCircle.y = stageHeight * SPOT_Y_RATIO;
};

const updateRobotPosition = (): void => {
  if (!robot || spots.length === 0) return;
  const clampedIndex = Math.min(Math.max(props.currentSpot, 0), spots.length - 1);
  robot.x = 70 + spotStep * clampedIndex;
  robot.y = stageHeight * SPOT_Y_RATIO - 8;
};

const createStage = async (): Promise<void> => {
  if (!canvasContainerRef.value) return;

  app = new PIXI.Application();
  await app.init({
    background: '#3A8C3F',
    resizeTo: canvasContainerRef.value,
    antialias: true,
  });

  canvasContainerRef.value.appendChild(app.canvas);

  stageWidth = app.screen.width;
  stageHeight = app.screen.height;
  spotStep = (stageWidth - 140) / Math.max(props.totalSpots - 1, 1);

  const skyH = stageHeight * 0.46;

  // ── 空の背景 ──────────────────────────────────
  const sky = new PIXI.Graphics();
  sky.rect(0, 0, stageWidth, skyH);
  sky.fill('#87CEEB');
  app.stage.addChild(sky);

  // ── 太陽 ─────────────────────────────────────
  const sun = new PIXI.Text({ text: '☀️', style: { fontSize: 34 } });
  sun.x = stageWidth - 56;
  sun.y = 8;
  app.stage.addChild(sun);

  // ── 雲 × 2 ───────────────────────────────────
  const cloud1 = makeCloud(stageWidth * 0.18, skyH * 0.28);
  const cloud2 = makeCloud(stageWidth * 0.58, skyH * 0.12);
  clouds = [cloud1, cloud2];
  cloudSpeeds.push(0.12, 0.08);
  clouds.forEach((c) => app!.stage.addChild(c));

  // ── ヤシの木 ──────────────────────────────────
  const palmLeft = new PIXI.Text({ text: '🌴', style: { fontSize: 38 } });
  palmLeft.x = 6;
  palmLeft.y = skyH - 28;
  app.stage.addChild(palmLeft);

  const palmRight = new PIXI.Text({ text: '🌴', style: { fontSize: 38 } });
  palmRight.x = stageWidth - 46;
  palmRight.y = skyH - 28;
  app.stage.addChild(palmRight);

  // ── パス ─────────────────────────────────────
  const pathY = stageHeight * SPOT_Y_RATIO;
  const pathGraphic = new PIXI.Graphics();
  pathGraphic.roundRect(40, pathY - 18, stageWidth - 80, 36, 18);
  pathGraphic.fill('#2f6a33');
  app.stage.addChild(pathGraphic);

  // ── 恐竜（地面に佇む） ────────────────────────
  const dino = new PIXI.Text({ text: '🦕', style: { fontSize: 36 } });
  dino.x = 18;
  dino.y = pathY + 12;
  app.stage.addChild(dino);

  // ── スポット光輪（現在地ハイライト）──────────────
  glowCircle = new PIXI.Graphics();
  glowCircle.circle(0, 0, 30);
  glowCircle.fill({ color: 0xffffff, alpha: 0.32 });
  app.stage.addChild(glowCircle);
  updateGlowPosition();

  // ── スポット × n ──────────────────────────────
  spots = [];
  for (let index = 0; index < props.totalSpots; index += 1) {
    const spot = new PIXI.Graphics();
    app.stage.addChild(spot);
    spots.push(spot);
  }
  redrawSpots();

  // ── 最終スポットのトロフィー ──────────────────
  const trophy = new PIXI.Text({ text: '🏆', style: { fontSize: 20 } });
  trophy.anchor.set(0.5, 1);
  trophy.x = 70 + spotStep * (props.totalSpots - 1);
  trophy.y = pathY - 24;
  app.stage.addChild(trophy);

  // ── ロボットマーカー ──────────────────────────
  robot = new PIXI.Text({ text: '🤖', style: { fontSize: 34 } });
  robot.anchor.set(0.5, 1);
  app.stage.addChild(robot);
  updateRobotPosition();

  // ── 雲のアニメーション ────────────────────────
  app.ticker.add(() => {
    clouds.forEach((cloud, i) => {
      cloud.x += cloudSpeeds[i];
      if (cloud.x > stageWidth + 80) {
        cloud.x = -80;
      }
    });
  });
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
  clouds = [];
  robot = null;
  glowCircle = null;
});

watch(
  () => props.currentSpot,
  () => {
    redrawSpots();
    updateGlowPosition();
    updateRobotPosition();

    const ticker = app?.ticker;
    if (!ticker || !robot) return;

    const originalY = robot.y;
    let elapsed = 0;

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
