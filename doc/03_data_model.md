# データモデル設計

## 概要

アプリケーションのデータは AsyncStorage を使用してJSONフォーマットでローカルに保存されます。
以下に各モデルの詳細な構造と説明を記載します。

## データ構造

### ExamStore（試験データストア）

```typescript
interface ExamStore {
  Exam: Exam[];
}

interface Exam {
  id: number; // 試験ID
  name: string; // 試験名
  detail: string; // 試験の詳細
  questions: Question[]; // 問題リスト
  genres: Genre[]; // ジャンルリスト
}

interface Question {
  id: number; // 問題ID
  question: string; // 問題文
  genre: string; // ジャンル名
  choices: Choice[]; // 選択肢リスト
}

interface Choice {
  id: number; // 選択肢ID
  choice: string; // 選択肢のテキスト
  isCorrect: boolean; // 正解フラグ
}

interface Genre {
  id: number; // ジャンルID
  name: string; // ジャンル名
}
```

### UserProgressStore（ユーザー進捗データストア）

```typescript
interface UserProgressStore {
  wrongAnswers: WrongAnswer[]; // 間違えた問題の記録
  answerHistory: AnswerHistory[]; // 解答履歴
}

interface WrongAnswer {
  examId: number; // 試験ID
  questionId: number; // 問題ID
  timestamp: number; // 記録日時
}

interface AnswerHistory {
  examId: number; // 試験ID
  questionId: number; // 問題ID
  isCorrect: boolean; // 正解/不正解
  timeSpent: number; // 解答にかかった時間（ミリ秒）
  timestamp: number; // 解答日時
}
```

## データ操作

### AsyncStorage キー設計

```typescript
const STORAGE_KEYS = {
  EXAM_STORE: '@exam_store',
  USER_PROGRESS: '@user_progress',
};
```

### 主なデータ操作関数

```typescript
// 試験データ操作
async function saveExam(exam: Exam): Promise<void>;
async function getExam(examId: number): Promise<Exam | null>;
async function getAllExams(): Promise<Exam[]>;
async function deleteExam(examId: number): Promise<void>;
async function updateExam(exam: Exam): Promise<void>;

// 問題データ操作
async function addQuestion(examId: number, question: Question): Promise<void>;
async function updateQuestion(examId: number, question: Question): Promise<void>;
async function deleteQuestion(examId: number, questionId: number): Promise<void>;
async function getRandomQuestions(examId: number, count: number): Promise<Question[]>;
async function getQuestionsByGenre(examId: number, genre: string): Promise<Question[]>;

// ジャンルデータ操作
async function addGenre(examId: number, genre: Genre): Promise<void>;
async function updateGenre(examId: number, genre: Genre): Promise<void>;
async function deleteGenre(examId: number, genreId: number): Promise<void>;

// 進捗データ操作
async function recordWrongAnswer(wrongAnswer: WrongAnswer): Promise<void>;
async function getWrongAnswers(examId: number): Promise<WrongAnswer[]>;
async function recordAnswerHistory(history: AnswerHistory): Promise<void>;
async function getAnswerHistory(examId: number): Promise<AnswerHistory[]>;
```

## データ整合性

1. ID生成規則

   - 新規データ作成時は、現在の最大IDに1を加えた値を使用
   - IDは各エンティティ（試験、問題、選択肢、ジャンル）ごとに独立して管理

2. データ検証

   - 保存前に必須フィールドの存在確認
   - 選択肢は1つ以上、8つ以下であることを確認
   - 少なくとも1つの正解選択肢が存在することを確認
   - ジャンル名の重複チェック

3. エラーハンドリング

   - AsyncStorage操作の失敗時は適切なエラーメッセージを表示
   - データ整合性エラーの場合はユーザーに修正を促す
   - ネットワーク状態に依存しないよう、すべての操作をローカルで完結

4. データバックアップ
   - 重要な操作前にデータのバックアップを作成
   - 操作失敗時のロールバック機能
