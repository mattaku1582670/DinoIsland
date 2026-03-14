import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';
import * as PIXI from 'pixi.js';

/**
 * Vue↔PixiJS橋渡しComposable
 * PixiJS Application のライフサイクルを Vue コンポーネントと同期する。
 */
export function usePixiStage(containerRef: Ref<HTMLElement | null>) {
  const app = ref<PIXI.Application | null>(null);

  onMounted(async () => {
    if (!containerRef.value) {
      return;
    }

    const pixiApp = new PIXI.Application();
    await pixiApp.init({
      resizeTo: containerRef.value,
      backgroundAlpha: 0,
      antialias: true,
    });

    containerRef.value.appendChild(pixiApp.canvas);
    app.value = pixiApp;
  });

  onBeforeUnmount(() => {
    if (app.value) {
      app.value.destroy(true);
      app.value = null;
    }
  });

  return { app };
}
