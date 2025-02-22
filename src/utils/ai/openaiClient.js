import OpenAI from 'openai';
import { BaseAIClient } from './baseClient';
import { AIError } from './errors';

/**
 * OpenAI APIクライアント
 */
export class OpenAIClient extends BaseAIClient {
  constructor(apiKey) {
    super(apiKey);
    this.client = new OpenAI({
      apiKey: this.apiKey
    });
  }

  /**
   * OpenAI APIを使用して問題を生成する
   * @param {string} prompt - 生成プロンプト
   * @returns {Promise<Object>} - 生成された問題
   * @throws {AIError} - API呼び出しエラー
   */
  async generate(prompt) {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini-2024-07-18',
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
        response_format: { type: 'json_object' }
      });

      if (!response.choices?.[0]?.message?.content) {
        throw new AIError(
          'INVALID_RESPONSE',
          'OpenAI APIからの応答が不完全です'
        );
      }

      // レスポンスをパースして標準フォーマットに変換
      const content = response.choices[0].message.content;
      return this._standardizeResponse(content);
    } catch (error) {
      if (error.response) {
        throw new AIError(
          'API_ERROR',
          `OpenAI API error: ${error.response.data.error.message}`
        );
      }
      throw this._handleError(error);
    }
  }

  /**
   * エラーを標準形式に変換する
   * @private
   */
  _handleError(error) {
    if (error instanceof AIError) {
      return error;
    }
    return new AIError('UNKNOWN_ERROR', error.message);
  }

  /**
   * レスポンスを標準形式に変換する
   * @private
   */
  _standardizeResponse(content) {
    try {
      const parsed = JSON.parse(content);
      return {
        raw: parsed,
        text: content,
      };
    } catch (error) {
      throw new AIError('INVALID_JSON', '不正なJSONレスポンスです');
    }
  }
}