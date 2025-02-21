import { makeAutoObservable, runInAction } from 'mobx';
import StorageManager from '../utils/storage';

/**
 * 進捗データストア
 */
class ProgressStore {
  wrongAnswers = [];
  answerHistory = [];
  isInitialized = false;
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
    this.initialize();
  }

  /**
   * ストアの初期化
   */
  async initialize() {
    if (this.isInitialized) return;
    try {
      this.loading = true;
      const progress = await StorageManager.getProgress();
      runInAction(() => {
        this.wrongAnswers = progress.wrongAnswers || [];
        this.answerHistory = progress.answerHistory || [];
        this.isInitialized = true;
        this.loading = false;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.wrongAnswers = [];
        this.answerHistory = [];
        this.isInitialized = true;
        this.loading = false;
        this.error = error.message;
      });
    }
  }

  /**
   * 進捗データの読み込み（再読み込み用）
   */
  async loadProgress() {
    try {
      this.loading = true;
      const progress = await StorageManager.getProgress();
      runInAction(() => {
        this.wrongAnswers = progress.wrongAnswers || [];
        this.answerHistory = progress.answerHistory || [];
        this.loading = false;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
    }
  }

  /**
   * 不正解の問題を記録
   * @param {number} examId - 試験ID
   * @param {number} questionId - 問題ID
   */
  async addWrongAnswer(examId, questionId) {
    try {
      const wrongAnswer = {
        examId,
        questionId,
        timestamp: Date.now(),
      };

      const updatedWrongAnswers = [...this.wrongAnswers, wrongAnswer];
      await this.saveProgress(updatedWrongAnswers, this.answerHistory);

      runInAction(() => {
        this.wrongAnswers = updatedWrongAnswers;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
    }
  }

  /**
   * 解答履歴の追加
   * @param {Object} history - 解答履歴データ
   */
  async addAnswerHistory(history) {
    try {
      const newHistory = {
        ...history,
        timestamp: Date.now(),
      };

      const updatedHistory = [...this.answerHistory, newHistory];
      await this.saveProgress(this.wrongAnswers, updatedHistory);

      runInAction(() => {
        this.answerHistory = updatedHistory;
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
    }
  }

  /**
   * 指定した試験の間違えた問題のIDリストを取得
   * @param {number} examId - 試験ID
   * @returns {Array<number>} 問題IDの配列
   */
  getWrongQuestionIds(examId) {
    return [
      ...new Set(this.wrongAnswers.filter(wa => wa.examId === examId).map(wa => wa.questionId)),
    ];
  }

  /**
   * 進捗データの保存
   * @param {Array} wrongAnswers - 不正解の問題リスト
   * @param {Array} answerHistory - 解答履歴リスト
   */
  async saveProgress(wrongAnswers, answerHistory) {
    try {
      await StorageManager.saveProgress({
        wrongAnswers,
        answerHistory,
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
      throw error;
    }
  }

  /**
   * 進捗データのクリア
   */
  async clearProgress() {
    try {
      await this.saveProgress([], []);
      runInAction(() => {
        this.wrongAnswers = [];
        this.answerHistory = [];
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
    }
  }
}

// シングルトンインスタンスをエクスポート
const progressStore = new ProgressStore();
export { progressStore };
