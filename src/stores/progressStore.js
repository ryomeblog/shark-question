import { makeAutoObservable, runInAction } from 'mobx';
import StorageManager from '../utils/storage';

/**
 * 進捗データストア
 */
class ProgressStore {
  wrongAnswers = [];
  answerHistory = [];
  resultHistory = [];  // 結果履歴を追加
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
        this.resultHistory = progress.resultHistory || [];  // 結果履歴の初期化
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
        this.resultHistory = progress.resultHistory || [];
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
  async saveProgress(wrongAnswers, answerHistory, resultHistory = this.resultHistory) {
  try {
    await StorageManager.saveProgress({
      wrongAnswers,
      answerHistory,
      resultHistory,
    });
  } catch (error) {
    runInAction(() => {
      this.error = error.message;
    });
    throw error;
  }
}

/**
 * 結果履歴の追加
 * @param {Object} result - 結果データ
 * @param {number} result.examId - 試験ID
 * @param {number} result.totalQuestions - 総問題数
 * @param {number} result.correctAnswers - 正解数
 * @param {number} result.totalTime - 所要時間
 * @param {Object} result.mode - 解答モード
 */
async addResultHistory(result) {
  try {
    const newResult = {
      id: Date.now(),
      timestamp: Date.now(),
      ...result,
    };

    const updatedHistory = [...this.resultHistory, newResult];
    await this.saveProgress(this.wrongAnswers, this.answerHistory, updatedHistory);

    runInAction(() => {
      this.resultHistory = updatedHistory;
      this.error = null;
    });
  } catch (error) {
    runInAction(() => {
      this.error = error.message;
    });
  }
}

/**
 * 試験IDに基づく結果履歴の取得
 * @param {number} examId - 試験ID
 * @returns {Array} 結果履歴の配列
 */
getResultHistories(examId) {
  return this.resultHistory
    .filter(result => result.examId === examId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * 試験の統計情報を取得
 * @param {number} examId - 試験ID
 * @returns {Object} 統計情報
 */
getExamStats(examId) {
  const histories = this.getResultHistories(examId);
  if (histories.length === 0) {
    return {
      totalAnswered: 0,
      correctAnswers: 0,
      averageTime: 0,
    };
  }

  const totalAnswered = histories.reduce((sum, h) => sum + h.totalQuestions, 0);
  const correctAnswers = histories.reduce((sum, h) => sum + h.correctAnswers, 0);
  const averageTime = histories.reduce((sum, h) => sum + h.totalTime, 0) / histories.length;

  return {
    totalAnswered,
    correctAnswers,
    averageTime,
  };
}

  /**
   * 進捗データのクリア
   */
  async clearProgress() {
    try {
      await this.saveProgress([], [], []);
      runInAction(() => {
        this.wrongAnswers = [];
        this.answerHistory = [];
        this.resultHistory = [];
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
    }
  }

  /**
   * 試験IDに基づく進捗データのクリア
   * @param {number} examId - 試験ID
   */
  async clearProgressByExamId(examId) {
    try {
      const filteredWrongAnswers = this.wrongAnswers.filter(wa => wa.examId !== examId);
      const filteredAnswerHistory = this.answerHistory.filter(ah => ah.examId !== examId);
      const filteredResultHistory = this.resultHistory.filter(rh => rh.examId !== examId);

      await this.saveProgress(
        filteredWrongAnswers,
        filteredAnswerHistory,
        filteredResultHistory
      );

      runInAction(() => {
        this.wrongAnswers = filteredWrongAnswers;
        this.answerHistory = filteredAnswerHistory;
        this.resultHistory = filteredResultHistory;
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
