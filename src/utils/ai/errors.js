/**
 * AI機能に関連するエラーを扱うクラス
 */
export class AIError extends Error {
  /**
   * @param {string} code - エラーコード
   * @param {string} message - エラーメッセージ
   */
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

/**
 * AIエラーを処理するユーティリティ関数
 * @param {AIError} error - 処理するエラー
 * @returns {string} - ユーザー向けエラーメッセージ
 */
export const handleAIError = (error) => {
  switch (error.code) {
    case 'API_KEY_INVALID':
      return 'APIキーが無効です。設定を確認してください。';
    case 'NETWORK_ERROR':
      return 'ネットワークエラーが発生しました。接続を確認してください。';
    case 'RATE_LIMIT':
      return 'APIの利用制限に達しました。しばらく待ってから再試行してください。';
    case 'INVALID_RESPONSE':
      return 'AIからの応答が無効です。設定を確認してください。';
    default:
      return 'エラーが発生しました。しばらく待ってから再試行してください。';
  }
};