import { AIError } from './errors';

/**
 * AIクライアントの基底クラス
 * 各AIサービスの共通機能を提供します
 */
export class BaseAIClient {
  constructor(apiKey) {
    if (!apiKey) {
      throw new AIError('API_KEY_INVALID', 'APIキーが設定されていません');
    }
    this.apiKey = apiKey;
  }

  /**
   * 問題を生成する
   * @param {string} prompt - 生成プロンプト
   * @returns {Promise<Object>} - 生成された問題
   * @throws {AIError} - API呼び出しエラー
   */
  async generate(prompt) {
    throw new Error('generate()メソッドを実装してください');
  }

  /**
   * レスポンスを共通フォーマットに変換する
   * @param {Object} response - APIレスポンス
   * @returns {Object} - 標準化されたレスポンス
   * @protected
   */
  _standardizeResponse(response) {
    try {
      if (typeof response === 'string') {
        response = JSON.parse(response);
      }

      // レスポンスの基本構造を確認
      if (!response || !Array.isArray(response.questions)) {
        throw new AIError(
          'INVALID_RESPONSE',
          'AIからの応答が無効な形式です'
        );
      }

      // 各問題のIDをユニークに設定
      const questions = response.questions.map((q, index) => ({
        ...q,
        id: q.id || `q-${Date.now()}-${index}`,
      }));

      return { questions };
    } catch (error) {
      throw new AIError(
        'INVALID_RESPONSE',
        'レスポンスの解析に失敗しました'
      );
    }
  }

  /**
   * ネットワークエラーを適切なAIErrorに変換する
   * @param {Error} error - 発生したエラー
   * @returns {AIError} - 変換されたエラー
   * @protected
   */
  _handleError(error) {
    if (error instanceof AIError) {
      return error;
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
          return new AIError('API_KEY_INVALID', 'APIキーが無効です');
        case 429:
          return new AIError('RATE_LIMIT', 'APIの利用制限に達しました');
        default:
          return new AIError(
            'NETWORK_ERROR',
            `APIエラー: ${error.response.status}`
          );
      }
    }

    return new AIError(
      'NETWORK_ERROR',
      'ネットワークエラーが発生しました'
    );
  }
}