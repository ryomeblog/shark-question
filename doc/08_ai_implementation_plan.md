# AI生成機能実装計画

## 1. コンポーネント構造の変更

### QuestionFormModal の拡張

```typescript
// タブの定義
type FormTab = 'manual' | 'ai';

interface QuestionFormModalProps {
  visible: boolean;
  exam: Exam;
  question?: Question;
  onSave: (question: Question) => void;
  onClose: () => void;
}

// 新しい状態の追加
const [activeTab, setActiveTab] = useState<FormTab>('manual');
```

### AIGenerateTab コンポーネントの作成

```typescript
// src/components/form/AIGenerateTab.js
interface AIGenerateTabProps {
  exam: Exam;
  onGenerate: (questions: Question[]) => void;
  isLoading: boolean;
}

const AIGenerateTab = ({ exam, onGenerate, isLoading }) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  // ...
};
```

### AISettingsButton コンポーネントの作成

```typescript
// src/components/ui/AISettingsButton.js
interface AISettingsButtonProps {
  onPress: () => void;
}
```

## 2. 新しいストア・ユーティリティの追加

### AIStore の作成

```typescript
// src/stores/aiStore.js
interface AIStore {
  settings: AISettings;
  isLoading: boolean;
  error: string | null;
  
  // アクション
  updateSettings: (settings: AISettings) => Promise<void>;
  generateQuestions: (prompt: string) => Promise<Question[]>;
  clearError: () => void;
}
```

### AIサービスクライアントの作成

```typescript
// src/utils/ai/
interface AIClient {
  generate: (prompt: string) => Promise<Question[]>;
}

// OpenAIクライアント
class OpenAIClient implements AIClient {
  constructor(apiKey: string) {
    // ...
  }
  
  async generate(prompt: string): Promise<Question[]> {
    // OpenAI APIを使用した実装
  }
}

// Claudeクライアント
class ClaudeClient implements AIClient {
  // ...
}

// Ollamaクライアント
class OllamaClient implements AIClient {
  // ...
}

// DeepSeekクライアント
class DeepSeekClient implements AIClient {
  // ...
}
```

### プロンプトテンプレートマネージャーの作成

```typescript
// src/utils/ai/promptManager.js
class PromptManager {
  static generatePrompt(examName: string, keywords: string[]): string {
    return `あなたはこれから${examName}の試験の問題を考えます。
以下のキーワードを使って、問題を10問考えてください。

${keywords.map(k => `- ${k}`).join('\n')}

制約事項:
...`;
  }
}
```

## 3. 実装手順

1. QuestionFormModalの拡張
   - タブUIの追加
   - 既存のフォームをManualTabコンポーネントとして分離

2. AIGenerateTabの実装
   - キーワード入力フォーム
   - AI設定ボタン
   - 生成ボタン
   - 生成結果プレビュー
   - 結果編集機能

3. AISettingsModalの実装
   - APIキー設定
   - モデル選択
   - プロンプトテンプレート設定

4. AIStoreの実装
   - 設定の永続化
   - 生成処理の状態管理
   - エラーハンドリング

5. AIクライアントの実装
   - 各AIサービスのクライアント実装
   - レスポンスの形式統一
   - エラー処理の統一

## 4. エラーハンドリング

```typescript
// src/utils/ai/errors.js
class AIError extends Error {
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

const handleAIError = (error: AIError) => {
  switch (error.code) {
    case 'API_KEY_INVALID':
      // APIキーエラーの処理
      break;
    case 'RATE_LIMIT':
      // レート制限エラーの処理
      break;
    // ...
  }
};
```

## 5. セキュリティ対策

1. APIキーの保存
   - キーの暗号化
   - セキュアなストレージの使用

2. 入力値の検証
   - キーワードの長さ制限
   - 不適切なコンテンツのフィルタリング

3. レスポンスの検証
   - JSON形式の検証
   - コンテンツの適切性確認

## 6. パフォーマンス最適化

1. 生成処理の最適化
   - バッチ処理の実装
   - キャッシュの活用

2. UI応答性の維持
   - ローディング状態の適切な管理
   - 段階的なUI更新

## 7. テスト計画

1. ユニットテスト
   - AIクライアントのモック
   - プロンプト生成のテスト
   - バリデーションのテスト

2. 統合テスト
   - API連携のテスト
   - エラーハンドリングのテスト

3. UIテスト
   - タブ切り替えのテスト
   - フォーム入力のテスト
   - 生成結果の表示テスト