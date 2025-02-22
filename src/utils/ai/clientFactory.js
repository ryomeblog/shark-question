import { ClaudeClient } from './claudeClient';
import { DeepSeekClient } from './deepseekClient';
import { AIError } from './errors';
import { OllamaClient } from './ollamaClient';
import { OpenAIClient } from './openaiClient';

/**
 * AIモデルの種類
 * @typedef {'OpenAI' | 'Claude' | 'Ollama' | 'DeepSeek'} ModelType
 */

/**
 * AIクライアントを生成するファクトリークラス
 */
export class AIClientFactory {
  /**
   * モデルタイプに応じたAIクライアントを生成する
   * @param {ModelType} modelType - AIモデルの種類
   * @param {string} apiKey - APIキー
   * @returns {BaseAIClient} - AIクライアントインスタンス
   * @throws {AIError} - 不正なモデルタイプの場合
   */
  static createClient(modelType, apiKey) {
    switch (modelType) {
      case 'OpenAI':
        return new OpenAIClient(apiKey);
      case 'Claude':
        return new ClaudeClient(apiKey);
      case 'Ollama':
        return new OllamaClient(apiKey);
      case 'DeepSeek':
        return new DeepSeekClient(apiKey);
      default:
        throw new AIError(
          'INVALID_MODEL',
          `不正なモデルタイプです: ${modelType}`
        );
    }
  }

  /**
   * 利用可能なモデルタイプの一覧を取得する
   * @returns {ModelType[]} - モデルタイプの配列
   */
  static getAvailableModels() {
    return ['OpenAI', 'Claude', 'Ollama', 'DeepSeek'];
  }

  /**
   * モデルの表示名を取得する
   * @param {ModelType} modelType - モデルタイプ
   * @returns {string} - モデルの表示名
   */
  static getModelDisplayName(modelType) {
    const displayNames = {
      OpenAI: 'OpenAI GPT-4',
      Claude: 'Anthropic Claude',
      Ollama: 'Ollama (ローカル)',
      DeepSeek: 'DeepSeek Chat',
    };
    return displayNames[modelType] || modelType;
  }

  /**
   * モデルの説明を取得する
   * @param {ModelType} modelType - モデルタイプ
   * @returns {string} - モデルの説明
   */
  static getModelDescription(modelType) {
    const descriptions = {
      OpenAI: 'OpenAIのGPT-4o-miniモデルを使用して高品質な問題を生成します',
      Claude: 'Anthropicのクロード3を使用して正確な問題を生成します',
      Ollama: 'ローカル環境で動作する軽量なAIモデルを使用します',
      DeepSeek: 'DeepSeekの言語モデルを使用して問題を生成します',
    };
    return descriptions[modelType] || '';
  }
}