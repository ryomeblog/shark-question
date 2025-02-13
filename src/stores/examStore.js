import { makeAutoObservable, runInAction } from "mobx";
import StorageManager from "../utils/storage";

/**
 * 試験データストア
 */
class ExamStore {
  exams = [];
  currentExam = null;
  loading = false;
  lastExamId = null;
  error = null;

  constructor() {
    makeAutoObservable(this);
    this.loadExams();
  }

  /**
   * 試験データの読み込み
   */
  async loadExams() {
    try {
      this.loading = true;
      const exams = await StorageManager.getExams();
      const lastExamId = await StorageManager.getData("lastExamId");
      runInAction(() => {
        this.exams = exams;
        this.loading = false;
        this.lastExamId = lastExamId;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
    }
  }

  /**
   * 試験の追加
   * @param {Object} exam - 試験データ
   */
  async addExam(exam) {
    try {
      const newExam = {
        ...exam,
        id: Date.now(),
        questions: [],
        genres: [],
      };

      const updatedExams = [...this.exams, newExam];
      await StorageManager.saveExams(updatedExams);

      runInAction(() => {
        this.exams = updatedExams;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
    }
  }

  /**
   * 試験の更新
   * @param {Object} exam - 更新する試験データ
   */
  async updateExam(exam) {
    try {
      const index = this.exams.findIndex((e) => e.id === exam.id);
      if (index === -1) throw new Error("試験が見つかりません");

      const updatedExams = [...this.exams];
      updatedExams[index] = exam;

      await StorageManager.saveExams(updatedExams);

      runInAction(() => {
        this.exams = updatedExams;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
    }
  }

  /**
   * 試験の削除
   * @param {number} examId - 削除する試験のID
   */
  async deleteExam(examId) {
    try {
      const updatedExams = this.exams.filter((exam) => exam.id !== examId);
      await StorageManager.saveExams(updatedExams);

      runInAction(() => {
        this.exams = updatedExams;
        if (this.currentExam?.id === examId) {
          this.currentExam = null;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
    }
  }

  /**
   * ジャンルの追加
   * @param {number} examId - 試験ID
   * @param {Object} genre - ジャンルデータ
   */
  async addGenre(examId, genre) {
    try {
      const exam = this.exams.find((e) => e.id === examId);
      if (!exam) throw new Error("試験が見つかりません");

      const newGenre = {
        ...genre,
        id: Date.now(),
      };

      const updatedExam = {
        ...exam,
        genres: [...exam.genres, newGenre],
      };

      await this.updateExam(updatedExam);
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
    }
  }

  /**
   * 問題の追加
   * @param {number} examId - 試験ID
   * @param {Object} question - 問題データ
   */
  async addQuestion(examId, question) {
    try {
      const exam = this.exams.find((e) => e.id === examId);
      if (!exam) throw new Error("試験が見つかりません");

      const newQuestion = {
        ...question,
        id: Date.now(),
      };

      const updatedExam = {
        ...exam,
        questions: [...exam.questions, newQuestion],
      };

      await this.updateExam(updatedExam);
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
    }
  }

  /**
   * ランダムな問題の取得
   * @param {number} examId - 試験ID
   * @param {number} count - 取得する問題数
   * @param {string} [genre] - ジャンル（オプション）
   * @returns {Array} ランダムな問題の配列
   */
  getRandomQuestions(examId, count, genre = null) {
    const exam = this.exams.find((e) => e.id === examId);
    if (!exam) return [];

    let questions = exam.questions;
    if (genre) {
      questions = questions.filter((q) => q.genre === genre);
    }

    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
  }

  /**
   * 最後に選択された試験IDの設定
   * @param {number} examId - 試験ID
   */
  async setLastExamId(examId) {
    try {
      await StorageManager.saveData("lastExamId", examId);
      runInAction(() => {
        this.lastExamId = examId;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
    }
  }

  /**
   * 現在の試験の設定
   * @param {number} examId - 試験ID
   */
  setCurrentExam(examId) {
    const exam = this.exams.find((e) => e.id === examId);
    this.currentExam = exam || null;
  }
}

export default new ExamStore();
