import { configure } from 'mobx';
import React from 'react';
import { aiStore } from './aiStore';
import { examStore } from './examStore';
import { progressStore } from './progressStore';

// MobXの設定
configure({
  enforceActions: 'never',
});

/**
 * ルートストア
 * アプリケーション全体の状態を管理します
 */
class RootStore {
  examStore;
  progressStore;
  aiStore;

  constructor() {
    this.examStore = examStore;
    this.progressStore = progressStore;
    this.aiStore = aiStore;
  }
}

// シングルトンインスタンスを作成
const rootStore = new RootStore();

// ストアコンテキスト作成
export const StoresContext = React.createContext(rootStore);

/**
 * ストアをコンポーネントで使用するためのカスタムフック
 */
export function useStores() {
  const stores = React.useContext(StoresContext);
  if (!stores) {
    throw new Error('useStores must be used within a StoresProvider');
  }
  return stores;
}

export { aiStore, examStore, progressStore };
export default rootStore;
