import { Howl } from 'howler';

interface SimpleHowl {
  play: () => void;
  stop: () => void;
}

let bgm: SimpleHowl | null = null;
let correctSfx: SimpleHowl | null = null;
let wrongSfx: SimpleHowl | null = null;
let treasureSfx: SimpleHowl | null = null;

function safeCreateHowl(options: { src: string[]; loop?: boolean; volume?: number }): SimpleHowl | null {
  try {
    const sound = new Howl({
      ...options,
      onloaderror: () => {
        // ignore load errors to avoid breaking the game
      },
    });
    return sound;
  } catch {
    return null;
  }
}

export function playBgm(): void {
  if (!bgm) {
    bgm = safeCreateHowl({
      src: ['/assets/sounds/bgm.mp3'],
      loop: true,
      volume: 0.5,
    });
  }
  bgm?.play();
}

export function stopBgm(): void {
  bgm?.stop();
}

export function playCorrect(): void {
  if (!correctSfx) {
    correctSfx = safeCreateHowl({
      src: ['/assets/sounds/correct.mp3'],
      volume: 0.8,
    });
  }
  correctSfx?.play();
}

export function playWrong(): void {
  if (!wrongSfx) {
    wrongSfx = safeCreateHowl({
      src: ['/assets/sounds/wrong.mp3'],
      volume: 0.8,
    });
  }
  wrongSfx?.play();
}

export function playTreasure(): void {
  if (!treasureSfx) {
    treasureSfx = safeCreateHowl({
      src: ['/assets/sounds/treasure.mp3'],
      volume: 0.9,
    });
  }
  treasureSfx?.play();
}

