import { BaseAIClient } from './baseClient';
import { AIError } from './errors';

/**
 * DeepSeek APIクライアント 
 */
export class DeepSeekClient extends BaseAIClient {
  constructor(apiKey) {
    super(apiKey);
    this.apiUrl = 'https://api.deepseek.com/v1/chat/completions';
  }

  /**
   * DeepSeek APIを使用して問題を生成する
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
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
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
          temperature: 0.7,
          max_tokens: 3000,
        }),
      });

      if (!response.ok) {
        throw new AIError(
          'NETWORK_ERROR',
          `DeepSeek APIエラー: ${response.status}`
        );
      }

      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new AIError(
          'INVALID_RESPONSE',
          'DeepSeek APIからの応答が不完全です'
        );
      }

      // レスポンスをパースして標準フォーマットに変換
      return this._standardizeResponse(data.choices[0].message.content);
    } catch (error) {
      throw this._handleError(error);
    }
  }
}