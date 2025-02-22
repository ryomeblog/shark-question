/**
 * プロンプトを管理するクラス
 */
export class PromptManager {
  /**
   * 問題生成用のプロンプトを生成する
   * @param {string} examName - 試験名
   * @param {string[]} keywords - キーワードリスト
   * @returns {string} - 生成されたプロンプト
   */
  static generatePrompt(examName, keywords) {
    return `あなたはこれから${examName}の試験の問題を考えます。
以下のキーワードを使って、問題を10問考えてください。

${keywords.map(k => `- ${k}`).join('\n')}

あなたは必ず以下のJSON形式で返信してください。

{
  "questions": [
    {
      "id": "exam-01",
      "question": "問題文",
      "genre": "ジャンル名",
      "detail": "解説（任意）",
      "choices": [
        {
          "id": "1",
          "choice": "選択肢1",
          "is_correct": true
        },
        {
          "id": "2",
          "choice": "選択肢2",
          "is_correct": false
        }
      ]
    }
  ]
}

制約事項:
- choices内の要素の選択肢は最大8つまでとしてください
- choices内のis_correctは複数trueとなって良いです
- is_correctがtrueの場合、正解とします`;
  }

  /**
   * プロンプトのバリデーションを行う
   * @param {string} prompt - 検証するプロンプト
   * @returns {boolean} - プロンプトが有効な場合はtrue
   */
  static validatePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
      return false;
    }
    
    // 必要な要素が含まれているか確認
    const requiredElements = [
      'questions',
      'id',
      'question',
      'genre',
      'choices',
      'is_correct'
    ];
    
    return requiredElements.every(element => prompt.includes(element));
  }

  /**
   * AIからのレスポンスを検証する
   * @param {Object} response - AIからのレスポンス
   * @returns {boolean} - レスポンスが有効な場合はtrue
   */
  static validateResponse(response) {
    try {
      // 基本構造の確認
      if (!response || !Array.isArray(response.questions)) {
        return false;
      }

      // 各問題のバリデーション
      return response.questions.every(q => {
        // 必須フィールドの存在確認
        if (!q.id || !q.question || !q.genre || !Array.isArray(q.choices)) {
          return false;
        }

        // 選択肢のバリデーション
        if (q.choices.length < 2 || q.choices.length > 8) {
          return false;
        }

        // 各選択肢のバリデーション
        return q.choices.every(c => {
          return (
            c.id &&
            typeof c.choice === 'string' &&
            typeof c.is_correct === 'boolean'
          );
        });
      });
    } catch (error) {
      return false;
    }
  }
}