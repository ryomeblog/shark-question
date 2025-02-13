import React, { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigator from "./src/navigation/AppNavigator";
import rootStore from "./src/stores";
import StorageManager from "./src/utils/storage";

/**
 * アプリケーションのルートコンポーネント
 */
export default function App() {
  const [isReady, setIsReady] = useState(false);

  // アプリケーションの初期化
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // ストレージの初期化確認
        const hasData = await StorageManager.hasData();
        if (!hasData) {
          await StorageManager.initializeStorage();
        }

        // ストアの初期データ読み込み
        await Promise.all([
          rootStore.examStore.loadExams(),
          rootStore.progressStore.loadProgress(),
        ]);

        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize app:", error);
        // エラー処理（必要に応じて実装）
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    // ローディング表示（必要に応じて実装）
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
