import { BaseAIClient } from './baseClient';
import { AIError } from './errors';

/**
 * Ollama APIクライアント
 * ローカルで実行されるAIモデルにアクセスします
 */
export class OllamaClient extends BaseAIClient {
  constructor(apiKey) {
    super(apiKey);
    // Ollamaはローカルで実行されるため、localhostを使用
    this.apiUrl = 'http://localhost:11434/api/generate';
  }

  /**
   * Ollama APIを使用して問題を生成する
   * @param {string} prompt - 生成プロンプト
   * @returns {Promise<Object>} - 生成された問題
   * @throws {AIError} - API呼び出しエラー
   */
  async generate(prompt) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral', // または他のOllamaでサポートされているモデル
          prompt: `
システム: 試験問題を作成するAIアシスタントです。指示された形式のJSONで回答します。

ユーザー: ${prompt}
`,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 3000,
          },
        }),
      });

      if (!response.ok) {
        throw new AIError(
          'NETWORK_ERROR',
          `Ollama APIエラー: ${response.status}`
        );
      }

      const data = await response.json();
      if (!data.response) {
        throw new AIError(
          'INVALID_RESPONSE',
          'Ollama APIからの応答が不完全です'
        );
      }

      // レスポンスをパースして標準フォーマットに変換
      return this._standardizeResponse(data.response);
    } catch (error) {
      // Ollamaサーバーが起動していない場合のエラーハンドリング
      if (error.message.includes('Failed to fetch')) {
        throw new AIError(
          'NETWORK_ERROR',
          'Ollamaサーバーに接続できません。サーバーが起動しているか確認してください。'
        );
      }
      throw this._handleError(error);
    }
  }

  /**
   * Ollamaサーバーの状態を確認する
   * @returns {Promise<boolean>} サーバーが利用可能な場合はtrue
   */
  async checkServerStatus() {
    try {
      const response = await fetch('http://localhost:11434/api/version');
      return response.ok;
    } catch {
      return false;
    }
  }
}