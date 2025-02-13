# テスト対策アプリ

TikTokのようなスワイプ操作で問題を解くことができるテスト対策アプリケーションです。

## 機能

- 試験の作成・管理
- ジャンルの作成・管理
- 問題の作成・管理（最大8択、複数選択可能）
- スワイプによる問題解答
- 解答時間の計測
- 正解・不正解のエフェクト表示
- 学習モード
  - ランダム10問
  - 全問チャレンジ（順序/ランダム）
  - 間違えた問題の復習
  - ジャンル別フィルタリング
- 結果画面での成績確認

## セットアップ

### 必要条件

- Node.js 16.x以上
- npm 8.x以上
- Expo CLI
- Android Studio（エミュレータ使用時）またはAndroidデバイス

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/shark-question.git
cd shark-question

# 依存パッケージのインストール
npm install
```

### 開発サーバーの起動

```bash
npm start
```

Expo CLIが起動し、QRコードが表示されます。

- AndroidエミュレータまたはAndroidデバイスでExpo Goアプリをインストール
- Expo GoアプリでQRコードをスキャン、もしくは`a`キーを押してAndroidで起動

## 技術スタック

- [Expo](https://expo.dev/) (React Native)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [react-native-drag-sort](https://github.com/computerjazz/react-native-drag-sort)
- [MobX](https://mobx.js.org/)

## プロジェクト構造

```
src/
├── components/          # 共通コンポーネント
│   ├── form/           # フォーム関連コンポーネント
│   ├── layout/         # レイアウトコンポーネント
│   ├── question/       # 問題関連コンポーネント
│   └── ui/             # UI共通コンポーネント
├── screens/            # 画面コンポーネント
│   ├── ExamScreen/     # 試験管理画面
│   ├── GenreScreen/    # ジャンル管理画面
│   ├── HomeScreen/     # ホーム画面
│   ├── QuestionScreen/ # 問題解答画面
│   └── ResultScreen/   # 結果表示画面
├── stores/             # 状態管理（MobX）
├── navigation/         # ナビゲーション設定
└── utils/             # ユーティリティ関数

```

## データ構造

アプリケーションのデータはAsyncStorageを使用してJSONフォーマットでローカルに保存されます。

```typescript
interface Exam {
  id: number;
  name: string;
  detail: string;
  questions: Question[];
  genres: Genre[];
}

interface Question {
  id: number;
  question: string;
  genre: string;
  choices: Choice[];
}

interface Choice {
  id: number;
  choice: string;
  isCorrect: boolean;
}

interface Genre {
  id: number;
  name: string;
}
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。
