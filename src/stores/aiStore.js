import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';
import { AIClientFactory } from '../utils/ai/clientFactory';
import { AIError } from '../utils/ai/errors';
import { PromptManager } from '../utils/ai/promptManager';

const AI_SETTINGS_KEY = '@ai_settings';

/**
 * AI設定を管理するストア
 */
class AIStore {
  settings = null;
  isLoading = false;
  error = null;
  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
    this.initialize();
  }

  /**
   * 初期化処理
   */
  async initialize() {
    if (this.isInitialized) return;
    try {
      runInAction(() => {
        this.isLoading = true;
        this.error = null;
      });

      const savedSettings = await AsyncStorage.getItem(AI_SETTINGS_KEY);
      const settings = savedSettings
        ? JSON.parse(savedSettings)
        : {
            modelType: 'OpenAI',
            apiKey: '',
            defaultPrompt: '',
          };

      runInAction(() => {
        this.settings = settings;
        this.isInitialized = true;
        this.isLoading = false;
      });

      if (!savedSettings) {
        await this._saveSettings();
      }
    } catch (error) {
      console.error('AI設定の読み込みに失敗しました:', error);
      runInAction(() => {
        this.error = error.message;
        this.isLoading = false;
        this.isInitialized = true;
        this.settings = {
          modelType: 'OpenAI',
          apiKey: '',
          defaultPrompt: '',
        };
      });
    }
  }

  /**
   * 設定を更新する
   * @param {Object} newSettings - 新しい設定
   */
  async updateSettings(newSettings) {
    try {
      runInAction(() => {
        this.settings = {
          ...this.settings,
          ...newSettings,
        };
        this.error = null;
      });
      await this._saveSettings();
    } catch (error) {
      console.error('AI設定の保存に失敗しました:', error);
      runInAction(() => {
        this.error = error.message;
      });
    }
  }

  /**
   * 問題を生成する
   * @param {string} examName - 試験名
   * @param {string[]} keywords - キーワードリスト
   * @returns {Promise<Object>} - 生成された問題
   */
  async generateQuestions(examName, keywords) {
    try {
      runInAction(() => {
        this.isLoading = true;
        this.error = null;
      });

      if (!this.settings?.apiKey) {
        throw new AIError('API_KEY_INVALID', 'APIキーが設定されていません');
      }

      // クライアントを生成
      const client = AIClientFactory.createClient(
        this.settings.modelType,
        this.settings.apiKey
      );

      // プロンプトを生成
      const prompt = await PromptManager.generatePrompt(examName, keywords);
      console.log('生成プロンプト:', prompt);

      // 問題を生成
      const result = await client.generate(prompt);
      return result;
    } catch (error) {
      console.error('問題生成に失敗しました:', error);
      runInAction(() => {
        this.error = error.message;
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  /**
   * 設定を保存する
   * @private
   */
  async _saveSettings() {
    await AsyncStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(this.settings));
  }
}

// シングルトンインスタンスを作成
const aiStore = new AIStore();
export { aiStore };
