import AsyncStorage from "@react-native-async-storage/async-storage";

// ストレージのキー定数
export const STORAGE_KEYS = {
  EXAM_STORE: "@exam_store",
  USER_PROGRESS: "@user_progress",
};

/**
 * AsyncStorageを使用したデータ永続化ユーティリティ
 */
class StorageManager {
  /**
   * データを保存
   * @param {string} key - ストレージキー
   * @param {any} value - 保存するデータ
   */
  static async saveData(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    }
  }

  /**
   * データを取得
   * @param {string} key - ストレージキー
   * @returns {Promise<any>} 保存されているデータ
   */
  static async getData(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Error reading data:", error);
      throw error;
    }
  }

  /**
   * 試験データの保存
   * @param {Array} exams - 試験データの配列
   */
  static async saveExams(exams) {
    await this.saveData(STORAGE_KEYS.EXAM_STORE, { Exam: exams });
  }

  /**
   * 試験データの取得
   * @returns {Promise<Array>} 試験データの配列
   */
  static async getExams() {
    const data = await this.getData(STORAGE_KEYS.EXAM_STORE);
    return data?.Exam || [];
  }

  /**
   * 進捗データの保存
   * @param {Object} progress - 進捗データ
   */
  static async saveProgress(progress) {
    await this.saveData(STORAGE_KEYS.USER_PROGRESS, progress);
  }

  /**
   * 進捗データの取得
   * @returns {Promise<Object>} 進捗データ
   */
  static async getProgress() {
    const data = await this.getData(STORAGE_KEYS.USER_PROGRESS);
    return data || { wrongAnswers: [], answerHistory: [] };
  }

  /**
   * ストレージの初期化
   */
  static async initializeStorage() {
    try {
      await this.saveExams([]);
      await this.saveProgress({
        wrongAnswers: [],
        answerHistory: [],
      });
    } catch (error) {
      console.error("Error initializing storage:", error);
      throw error;
    }
  }

  /**
   * データの存在確認
   * @returns {Promise<boolean>} データが存在するかどうか
   */
  static async hasData() {
    try {
      const exams = await this.getExams();
      return exams.length > 0;
    } catch {
      return false;
    }
  }
}

export default StorageManager;
