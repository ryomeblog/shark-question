/**
 * ナビゲーションのパラメータ型定義
 * @typedef {Object} RootStackParamList
 * @property {undefined} Home - ホーム画面
 * @property {undefined} Exam - 試験画面
 * @property {Object} Genre - ジャンル画面
 * @property {number} Genre.examId - 試験ID
 * @property {Object} QuestionAdd - 問題追加画面
 * @property {number} QuestionAdd.examId - 試験ID
 * @property {Object} Question - 問題画面
 * @property {number} Question.examId - 試験ID
 * @property {string} [Question.genre] - ジャンル（オプション）
 * @property {('random'|'all'|'wrong')} [Question.mode] - 出題モード
 * @property {boolean} [Question.ordered] - 順序通りに出題するかどうか
 * @property {Object} Result - 結果画面
 * @property {number} Result.examId - 試験ID
 * @property {Array} Result.results - 解答結果の配列
 */

/**
 * @type {RootStackParamList}
 */
export const ROOT_STACK_PARAM_LIST = {
  Home: undefined,
  Exam: undefined,
  Genre: { examId: 0 },
  QuestionAdd: { examId: 0 },
  Question: {
    examId: 0,
    genre: undefined,
    mode: undefined,
    ordered: false,
  },
  Result: {
    examId: 0,
    results: [],
  },
};
