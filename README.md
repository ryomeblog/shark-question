# シャーク問題アプリ (Shark Question App)

問題集を管理・学習できるモバイルアプリケーション。

Expo (React Native)で実装されています。

## 📱 機能

- 問題の登録・管理
- ジャンル別問題管理
- 試験モード
- 学習進捗の記録
- タイマー機能付き問題演習

## 🛠 技術スタック

### フロントエンド
- Expo (React Native)
- JavaScript
- React Native Paper (UIフレームワーク)
- react-native-drag-sort

### データ永続化
- AsyncStorage

### 開発ツール
- ESLint
- Prettier

## 🚀 開始方法

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm start

# Androidでの実行
npm run android

# iOSでの実行
npm run ios
```

## 📂 プロジェクト構成

```
.
├── src/
│   ├── components/     # 共通コンポーネント
│   ├── screens/        # 画面コンポーネント
│   ├── navigation/     # ナビゲーション設定
│   ├── stores/        # 状態管理
│   └── utils/         # ユーティリティ関数
├── assets/            # 画像等の静的ファイル
└── doc/              # プロジェクトドキュメント
```

## 📚 ドキュメント

詳細な仕様やアーキテクチャについては、以下のドキュメントを参照してください：

- [システム概要](./doc/01_system_overview.md)
- [画面フロー](./doc/02_screen_flow.md)
- [データモデル](./doc/03_data_model.md)
- [コンポーネント設計](./doc/04_component_design.md)
- [状態管理設計](./doc/05_state_management.md)

## 🔧 開発ガイドライン

### コンポーネント設計

- Atomic Designパターンに基づくコンポーネント設計
- React Native Paperコンポーネントの積極的な活用
- レスポンシブデザインの考慮

### コーディング規約

- ESLint/Prettierの標準ルールに準拠
- コンポーネントは機能ごとにディレクトリを分割
- 適切なコメントの記述
