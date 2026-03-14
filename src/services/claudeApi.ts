import Anthropic from '@anthropic-ai/sdk';
import type { MathMission } from '../types/game';
import { ROBOT_SYSTEM_PROMPT } from '../prompts/robotDialog';
import { MATH_SYSTEM_PROMPT } from '../prompts/mathMission';

const MODEL_NAME = 'claude-haiku-4-5';
const MAX_TOKENS = 200;
const TEMPERATURE = 0.8;
const REQUEST_TIMEOUT_MS = 5000;
const MAX_RETRY_WITHOUT_KANJI = 2;

const anthropicApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

const anthropicClient =
  typeof anthropicApiKey === 'string' && anthropicApiKey.length > 0
    ? new Anthropic({
        apiKey: anthropicApiKey,
        dangerouslyAllowBrowser: true,
      })
    : null;

function hasKanji(text: string): boolean {
  return /[一-龯々]/u.test(text);
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

function safeParseJson<T>(raw: string): T | null {
  try {
    const parsed = JSON.parse(raw) as T;
    return parsed;
  } catch {
    return null;
  }
}

async function createJsonMessage(
  systemPrompt: string,
  userPrompt: string,
): Promise<string | null> {
  if (!anthropicClient) {
    return null;
  }

  const response = await withTimeout(
    anthropicClient.messages.create({
      model: MODEL_NAME,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    }),
    REQUEST_TIMEOUT_MS,
  );

  const content = response.content[0];
  if (content.type !== 'text') {
    return null;
  }

  return content.text;
}

export async function generateRobotDialog(fallbackDialog: string): Promise<string> {
  let attempts = 0;

  while (attempts <= MAX_RETRY_WITHOUT_KANJI) {
    attempts += 1;

    try {
      const raw = await createJsonMessage(
        ROBOT_SYSTEM_PROMPT,
        'ゲームようの せりふを ひとつ つくってください。',
      );

      if (!raw) {
        continue;
      }

      interface RobotResponse {
        dialog: string;
      }

      const parsed = safeParseJson<RobotResponse>(raw);
      if (!parsed || typeof parsed.dialog !== 'string') {
        continue;
      }

      const dialog = parsed.dialog.trim();
      if (!dialog || hasKanji(dialog)) {
        if (attempts <= MAX_RETRY_WITHOUT_KANJI) {
          continue;
        }
        return fallbackDialog;
      }

      return dialog;
    } catch {
      // Try again within retry limit; fall back if still failing
      if (attempts > MAX_RETRY_WITHOUT_KANJI) {
        return fallbackDialog;
      }
    }
  }

  return fallbackDialog;
}

export async function generateMathMission(fallbackMission: MathMission): Promise<MathMission> {
  let attempts = 0;

  while (attempts <= MAX_RETRY_WITHOUT_KANJI) {
    attempts += 1;

    try {
      const raw = await createJsonMessage(
        MATH_SYSTEM_PROMPT,
        'さんすうの もんだいを ひとつ つくってください。',
      );

      if (!raw) {
        continue;
      }

      const parsed = safeParseJson<MathMission>(raw);
      if (!parsed) {
        continue;
      }

      const isValidQuestion = typeof parsed.question === 'string' && !hasKanji(parsed.question);
      const isValidHint = typeof parsed.hint === 'string' && !hasKanji(parsed.hint);
      const isValidChoices =
        Array.isArray(parsed.choices) &&
        parsed.choices.length === 3 &&
        parsed.choices.every((c) => typeof c === 'number');

      const isValidAnswer =
        typeof parsed.answer === 'number' &&
        parsed.answer >= 1 &&
        parsed.answer <= 10 &&
        parsed.choices.includes(parsed.answer);

      if (!isValidQuestion || !isValidHint || !isValidChoices || !isValidAnswer) {
        if (attempts <= MAX_RETRY_WITHOUT_KANJI) {
          continue;
        }
        return fallbackMission;
      }

      return parsed;
    } catch {
      if (attempts > MAX_RETRY_WITHOUT_KANJI) {
        return fallbackMission;
      }
    }
  }

  return fallbackMission;
}

