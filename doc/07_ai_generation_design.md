# AI生成機能設計

## 概要

問題のAI自動生成機能を追加します。この機能は、OpenAI、Claude、Ollama、DeepSeekのAIモデルを使用して、
キーワードベースで問題を自動生成します。

## 機能要件

1. 問題追加画面のモーダルにAI生成タブを追加
2. 複数のAIサービス（OpenAI、Claude、Ollama、DeepSeek）のサポート
3. APIキーの保存と管理
4. 生成された問題の検証と編集
5. 生成プロンプトのテンプレート管理

## データモデルの拡張

```typescript
// AI設定の永続化
interface AISettings {
  apiKey: string;         // APIキー
  modelType: 'OpenAI' | 'Claude' | 'Ollama' | 'DeepSeek';  // 使用するAIモデル
  defaultPrompt?: string; // デフォルトのプロンプトテンプレート
}

// ExamStoreの拡張
interface ExamStore {
  Exam: Exam[];
  aiSettings: AISettings; // AI設定を追加
}

// プロンプトテンプレート
interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  modelType: 'OpenAI' | 'Claude' | 'Ollama' | 'DeepSeek';
}
```

## コンポーネント設計

### 1. AIGenerateForm

```typescript
interface AIGenerateFormProps {
  examId: number;
  onGenerate: (keywords: string[]) => Promise<void>;
  isLoading: boolean;
}
```

AI生成タブのメインフォームコンポーネント：
- キーワード入力フィールド
- AI生成ボタン
- ローディングインジケーター

### 2. AISettingsModal

```typescript
interface AISettingsModalProps {
  visible: boolean;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
  onClose: () => void;
}
```

AI設定モーダル：
- APIキー入力
- AIモデル選択
- デフォルトプロンプト設定

## 状態管理

### 1. AI生成状態

```typescript
interface AIGenerateState {
  isGenerating: boolean;
  error: string | null;
  keywords: string[];
  generatedQuestions: Question[];
}
```

### 2. エラー処理

```typescript
interface AIError {
  code: 'API_KEY_INVALID' | 'NETWORK_ERROR' | 'RATE_LIMIT' | 'INVALID_RESPONSE';
  message: string;
}
```

## 画面フロー

1. 問題追加モーダルの拡張
   - 「手動作成」タブ
   - 「AI生成」タブ（新規追加）

2. AI生成タブのフロー
   ```
   キーワード入力 → AI生成 → 生成結果の確認 → 保存/編集
   ```

3. 設定フロー
   ```
   設定アイコン → AI設定モーダル → APIキー・モデル設定 → 保存
   ```

## セキュリティ考慮事項

1. APIキーの保護
   - APIキーは暗号化して保存
   - セキュアなストレージの使用

2. エラーハンドリング
   - API制限の管理
   - ネットワークエラーの処理
   - 不正なレスポンスの処理

## プロンプト設計

### ベースプロンプトテンプレート

```
あなたはこれから【試験名】の試験の問題を考えます。
以下のキーワードを使って、問題を10問考えてください。

- 【キーワード名】

制約事項:
- choices内の要素の選択肢は最大8つまでとする
- choices内のis_correctは複数trueとなってよい
- is_correctがtrueの場合、正解とする

返答は必ず以下のJSON形式で返してください：

{
  "questions": [
    {
      "id": "unique-id",
      "question": "問題文",
      "genre": "ジャンル名",
      "choices": [
        {
          "id": "1",
          "choice": "選択肢1",
          "is_correct": true
        },
        ...
      ]
    },
    ...
  ]
}
```

## パフォーマンス考慮事項

1. 生成処理の最適化
   - 生成中のUI応答性の維持
   - バックグラウンド処理の実装

2. データの検証
   - 生成された問題の形式検証
   - 重複チェック
   - 不適切なコンテンツのフィルタリング

## 拡張性

1. 新規AIモデルの追加
2. プロンプトテンプレートのカスタマイズ
3. バッチ生成機能の追加可能性