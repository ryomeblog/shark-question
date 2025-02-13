# コンポーネント設計

## 共通コンポーネント

### 1. LayoutComponents

```typescript
// src/components/layout/
interface HeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

interface ScreenContainerProps {
  children: React.ReactNode;
  padding?: number;
  safeArea?: boolean;
}
```

### 2. UIComponents

```typescript
// src/components/ui/
interface CustomButtonProps {
  label: string;
  onPress: () => void;
  mode?: 'contained' | 'outlined' | 'text';
  icon?: string;
  disabled?: boolean;
}

interface CustomFABProps {
  icon: string;
  onPress: () => void;
  label?: string;
}

interface ListItemProps {
  title: string;
  description?: string;
  leftIcon?: string;
  rightIcons?: Array<{
    icon: string;
    onPress: () => void;
  }>;
}

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```

### 3. FormComponents

```typescript
// src/components/form/
interface TextInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  multiline?: boolean;
}

interface ChoiceInputProps {
  choices: Array<{
    id: number;
    text: string;
    isCorrect: boolean;
  }>;
  onChoiceChange: (id: number, text: string) => void;
  onCorrectChange: (id: number, isCorrect: boolean) => void;
  onDeleteChoice: (id: number) => void;
  maxChoices?: number;
}
```

### 4. QuestionComponents

```typescript
// src/components/question/
interface QuestionCardProps {
  question: Question;
  onAnswer: (selectedChoices: number[]) => void;
  showResult?: boolean;
}

interface TimerDisplayProps {
  startTime: number;
  running: boolean;
}

interface ResultCardProps {
  correct: boolean;
  message?: string;
  timeSpent: number;
}
```

## 画面コンポーネント

### 1. HomeScreen

```typescript
// src/screens/HomeScreen/
interface MenuButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
}

interface HomeScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}
```

### 2. ExamScreen

```typescript
// src/screens/ExamScreen/
interface ExamListProps {
  exams: Exam[];
  onEditPress: (exam: Exam) => void;
  onDeletePress: (examId: number) => void;
}

interface ExamFormModalProps {
  visible: boolean;
  exam?: Exam;
  onSave: (exam: Partial<Exam>) => void;
  onClose: () => void;
}
```

### 3. QuestionScreen

```typescript
// src/screens/QuestionScreen/
interface QuestionScreenProps {
  route: RouteProp<RootStackParamList, 'Question'>;
  navigation: NavigationProp<RootStackParamList>;
}

interface QuestionSwipeContainerProps {
  questions: Question[];
  onComplete: (results: AnswerHistory[]) => void;
}

interface QuestionModeSelectProps {
  examId: number;
  onModeSelect: (mode: QuestionMode) => void;
}
```

### 4. ResultScreen

```typescript
// src/screens/ResultScreen/
interface ResultSummaryProps {
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
}

interface QuestionResultListProps {
  results: Array<{
    question: Question;
    isCorrect: boolean;
    timeSpent: number;
  }>;
}

interface RetryOptionsProps {
  onRetryAll: () => void;
  onRetryWrong: () => void;
  onGoHome: () => void;
}
```

## コンポーネントツリー構造

```
App
├── NavigationContainer
│   ├── HomeScreen
│   │   └── MenuButton[]
│   ├── ExamScreen
│   │   ├── ExamList
│   │   └── ExamFormModal
│   ├── GenreScreen
│   │   ├── ExamSelector
│   │   ├── GenreList
│   │   └── GenreFormModal
│   ├── QuestionAddScreen
│   │   ├── ExamSelector
│   │   ├── QuestionList
│   │   └── QuestionFormModal
│   ├── QuestionScreen
│   │   ├── QuestionModeSelect
│   │   ├── QuestionSwipeContainer
│   │   │   ├── QuestionCard
│   │   │   └── TimerDisplay
│   │   └── ResultCard
│   └── ResultScreen
│       ├── ResultSummary
│       ├── QuestionResultList
│       └── RetryOptions
```

## アニメーションとトランジション

1. スワイプアニメーション

```typescript
interface SwipeAnimationConfig {
  duration: number;
  easing: Animated.EasingFunction;
  useNativeDriver: boolean;
}
```

2. 正解/不正解エフェクト

```typescript
interface AnswerEffectProps {
  type: 'correct' | 'incorrect';
  visible: boolean;
  onAnimationComplete: () => void;
}
```

3. 画面トランジション

- ホーム → 各画面: スライドイン
- 問題画面 → 結果画面: フェード
- モーダル: 下からスライドアップ
