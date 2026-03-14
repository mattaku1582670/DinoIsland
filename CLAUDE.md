# 🦕 きょうりゅうのしまたんけん — Claude Code 初期指示書

## ▼ このファイルの使い方
このファイルをClaude Codeのプロジェクト開始時に貼り付けて使ってください。
`CLAUDE.md` としてプロジェクトルートに置くと、Claude Codeが自動で参照します。

---

## 🎯 プロジェクト概要

6歳の子供向けPWAゲームアプリ。
ロボキャラクターと一緒に恐竜の島を探検しながら、算数ミッションをクリアして宝を集める。
セリフと算数問題はAnthropicのAI APIでリアルタイム生成する。

### ターゲット
- **ユーザー:** 6歳の子供（タッチ操作。親と一緒に遊ぶケースも想定）
- **プラットフォーム優先順位:** タブレット > スマホ > PC
- **プレイ時間:** 1セッション約3分

---

## 🏗️ 技術スタック（変更禁止）

| 役割 | 技術 | バージョン指定 |
|------|------|--------------|
| フレームワーク | Vue 3 (Composition API) | latest |
| ビルドツール | Vite | latest |
| 言語 | TypeScript（strict: false） | latest |
| ゲーム描画 | PixiJS | v8 |
| UIアニメーション | GSAP | latest |
| 状態管理 | Pinia | latest |
| AI API | Anthropic API (claude-haiku-4-5) | latest SDK |
| 音声 | Howler.js | latest |
| オフライン/PWA | vite-plugin-pwa + Workbox | latest |
| IndexedDB | Dexie.js | latest |

> ⚠️ 勝手にライブラリを追加・変更しないこと。追加が必要な場合は必ず確認を取ること。

---

## 📁 ディレクトリ構成（この構成を厳守）

```
src/
├── components/
│   ├── game/
│   │   ├── RobotCharacter.vue      # ロボのスプライト + 吹き出し
│   │   ├── DinoIslandMap.vue       # 冒険マップ（PixiJSステージ）
│   │   └── TreasureChest.vue      # 宝箱演出コンポーネント
│   └── ui/
│       ├── MissionPanel.vue        # 算数ミッション表示・回答UI
│       ├── TimerBar.vue            # 3分カウントダウンタイマー
│       └── SpeechBubble.vue       # セリフ吹き出し
├── screens/
│   ├── TitleScreen.vue             # タイトル・スタート画面
│   ├── AdventureScreen.vue         # メイン冒険画面（ゲームループ）
│   └── ResultScreen.vue           # 結果・宝コレクション画面
├── stores/
│   └── gameStore.ts                # Pinia: スコア・宝・タイマー・進行状態
├── prompts/                        # ★AIプロンプトをここに集中管理
│   ├── robotDialog.ts              # ロボのセリフ生成プロンプト
│   └── mathMission.ts             # 算数問題生成プロンプト
├── services/
│   ├── claudeApi.ts               # Anthropic APIラッパー
│   └── offlineCache.ts            # Dexie.jsによる問題の先読みキャッシュ
├── pixi/
│   └── usePixiStage.ts            # Vue↔PixiJS橋渡しComposable
├── assets/
│   ├── sprites/                    # キャラ・背景画像 (PNG/WebP)
│   ├── sounds/                     # BGM・効果音 (MP3/WebM)
│   └── fonts/                      # 丸ゴシック系フォント
└── types/
    └── game.ts                     # 型定義（ゲーム全体の共通型）
```

---

## 🔄 ゲームフロー

```
① TitleScreen
   └─ [はじめる] ボタン
        ↓
② AdventureScreen 起動時
   └─ claudeApi.ts でストーリーと最初の問題を先読み生成
        ↓
③ DinoIslandMap でロボが移動アニメーション
        ↓ スポットに到達
④ RobotCharacter がセリフを表示（AI生成 or キャッシュ）
        ↓
⑤ MissionPanel で算数ミッション表示
   ├─ 正解 → TreasureChest演出 → スコア加算 → ③に戻る
   └─ 不正解 → ロボがヒントセリフ（AI生成）→ 再挑戦
        ↓ TimerBarが0になったとき
⑥ ResultScreen
   └─ 集めた宝・スコア・ほめコメント（AI生成）を表示
```

---

## 🤖 AI API 仕様

### 使用モデル
```
claude-haiku-4-5
```

### 共通ルール（全プロンプトに適用）
- max_tokens: **200**（コスト管理のため厳守）
- temperature: **0.8**（毎回違う反応のため）
- レスポンスは必ず **JSON形式** で返させる
- エラー時はキャッシュから代替データを返す（画面を止めない）

### プロンプト設計ルール
`src/prompts/` 内のファイルでシステムプロンプトを管理する。

#### robotDialog.ts — ロボのセリフ生成
```typescript
export const ROBOT_SYSTEM_PROMPT = `
あなたは6さいの こどもむけ ぼうけんゲームに でてくる ロボットです。

【かならず まもること】
- ぜんぶ ひらがな か カタカナ だけ つかう（かんじ きんし）
- 1つの せりふは 20もじ いない
- げんき よく たのしく はなす
- こどもが わかる やさしい ことばだけ

【へんじの かたち】
かならず JSON で かえす:
{"dialog": "ここに せりふ"}
`;
```

#### mathMission.ts — 算数問題生成
```typescript
export const MATH_SYSTEM_PROMPT = `
あなたは6さいむけ さんすう もんだいを つくる ロボットです。

【もんだいの ルール】
- たしざん か ひきざん のみ
- こたえは 1〜10 のあいだ
- すうじは かならず 数字（1, 2, 3...）で かく
- せんたくし 3つ（せいかい1つ + まちがい2つ）

【へんじの かたち】
かならず JSON で かえす:
{
  "question": "3 + 4 は いくつ？",
  "choices": [7, 5, 9],
  "answer": 7,
  "hint": "ゆびを つかって かぞえて みよう"
}
`;
```

### claudeApi.ts の実装方針
```typescript
// ① 通信中はローディング演出を表示（子供を待たせない工夫）
// ② タイムアウト 5秒。超えたらキャッシュから返す
// ③ APIキーは .env の VITE_ANTHROPIC_API_KEY から読む
// ④ レスポンスは JSON.parse する。失敗時はフォールバックデータを返す
```

---

## 💾 状態管理（Pinia: gameStore.ts）

```typescript
interface GameState {
  // タイマー
  timeLeft: number           // 残り秒数（初期値: 180）
  isTimerRunning: boolean

  // スコア・進行
  score: number
  treasuresCollected: Treasure[]
  currentSpot: number        // 現在の島スポット番号（0〜4）
  totalSpots: number         // スポット総数（固定: 5）

  // ミッション
  currentMission: MathMission | null
  isAnswering: boolean

  // ロボ
  robotDialog: string
  isRobotTalking: boolean
}
```

---

## 🎨 UI / デザインルール

### レスポンシブ基準
- **基準解像度:** 768px幅（タブレット縦）
- タッチターゲット最小サイズ: **80px × 80px**（指で押しやすく）
- フォントサイズ最小: **24px**（6歳が読める）

### カラーパレット
| 用途 | カラーコード |
|------|------------|
| 背景（空） | `#87CEEB` |
| 背景（島） | `#3A8C3F` |
| ロボ吹き出し | `#FFF9E6` |
| 正解演出 | `#FFD700` |
| 不正解演出 | `#FF6B6B` |
| ボタン | `#FF8C00` |
| ボタンテキスト | `#FFFFFF` |

### フォント
- 游ゴシック または Noto Sans JP（丸みのあるフォント）
- 本文・ボタン: bold

---

## ⚡ パフォーマンス要件

| 項目 | 目標値 |
|------|--------|
| 初回ロード | 3秒以内（4G回線） |
| API応答待ち上限 | 5秒（超えたらキャッシュ使用） |
| アニメーション | 60fps維持 |
| バンドルサイズ | 1MB以内（gzip後） |

### オフライン戦略
1. オンライン時: APIで問題を生成 → **IndexedDB(Dexie)に10問先読みキャッシュ**
2. オフライン時: キャッシュから出題（Workbox NetworkFirst戦略）
3. キャッシュ切れ時: ハードコードされたフォールバック問題5問を使用

---

## 🚫 禁止事項・注意事項

### コーディング
- `any` 型の使用禁止（`unknown` を使うこと）
- コンポーネントのpropsは必ず型定義すること
- APIキーをコードにハードコード禁止（必ず `.env` から読む）
- `console.log` を本番コードに残さないこと

### UX（子供向け配慮）
- 「まちがい」「だめ」などの否定語を使わない（「もう いちど！」などポジティブに）
- 正解・不正解どちらでも**必ず次のアクションへ誘導**する（詰まらせない）
- ローディング中は必ずアニメーション表示（空白画面禁止）

### AI生成
- 漢字が含まれるレスポンスが返ってきた場合は**再生成**する（最大2回リトライ）
- JSON parseエラー時は絶対に画面を止めない（フォールバックへ）

---

## 🛠️ セットアップ手順

Claude Codeへの指示:
```
以下の手順でプロジェクトをセットアップしてください:

1. `npm create vite@latest dino-island -- --template vue-ts` を実行
2. 必要パッケージをインストール:
   npm install pixi.js @pixi/react gsap pinia howler dexie
   npm install -D vite-plugin-pwa @anthropic-ai/sdk
3. 上記のディレクトリ構成どおりにファイルを作成
4. vite.config.ts に vite-plugin-pwa を設定
5. src/types/game.ts に型定義を作成
6. src/stores/gameStore.ts にPiniaストアを作成
7. src/services/claudeApi.ts にAPIラッパーを作成
```

---

## ✅ 作業の進め方（Claude Codeへの指示例）

### 段階的に実装すること

```
フェーズ1: 基盤（まずここから）
- プロジェクトセットアップ
- gameStore.ts（状態管理）
- claudeApi.ts（APIラッパー）
- TitleScreen.vue（スタート画面）

フェーズ2: コアゲーム
- DinoIslandMap.vue（PixiJSマップ）
- RobotCharacter.vue（ロボ）
- MissionPanel.vue（算数ミッション）
- TimerBar.vue（タイマー）

フェーズ3: 演出・仕上げ
- TreasureChest.vue（宝箱演出）
- ResultScreen.vue（結果画面）
- PWA設定・オフライン対応
- 音声・BGM統合
```

### 各フェーズで確認すること
- [ ] TypeScriptエラーが0件
- [ ] タブレット縦（768px）で表示が崩れない
- [ ] タッチ操作でボタンが押せる
- [ ] AI APIレスポンスが来なくてもゲームが止まらない

---

*最終更新: 2026-03-14*
