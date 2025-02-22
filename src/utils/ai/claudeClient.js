import { BaseAIClient } from './baseClient';
import { AIError } from './errors';

/**
 * Anthropic Claude APIクライアント
 */
export class ClaudeClient extends BaseAIClient {
  constructor(apiKey) {
    super(apiKey);
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
  }

  /**
   * Claude APIを使用して問題を生成する
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
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          max_tokens: 3000,
          messages: [
            {
              role: 'system',
              content: '試験問題を作成するAIアシスタントです。指示された形式のJSONで回答します。',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new AIError(
          'NETWORK_ERROR',
          `Claude APIエラー: ${response.status}`
        );
      }

      const data = await response.json();
      if (!data.content?.[0]?.text) {
        throw new AIError(
          'INVALID_RESPONSE',
          'Claude APIからの応答が不完全です'
        );
      }

      // レスポンスをパースして標準フォーマットに変換
      return this._standardizeResponse(data.content[0].text);
    } catch (error) {
      throw this._handleError(error);
    }
  }
}