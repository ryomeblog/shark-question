import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Modal, Portal, SegmentedButtons, Title } from 'react-native-paper';

import AIGenerateTab from '../../components/ai/AIGenerateTab';
import AISettingsModal from '../../components/ai/AISettingsModal';
import ChoiceInput from '../../components/form/ChoiceInput';
import TextInputField from '../../components/form/TextInputField';
import CustomButton from '../../components/ui/CustomButton';

/**
 * 問題フォームモーダル
 * @param {Object} props
 * @param {boolean} props.visible - モーダルの表示状態
 * @param {Object} props.exam - 試験データ
 * @param {Object} props.question - 編集する問題データ（新規の場合はnull）
 * @param {Function} props.onSave - 保存時のコールバック
 * @param {Function} props.onClose - 閉じる時のコールバック
 */
const QuestionFormModal = ({ visible, exam, question, onSave, onSaveMultiple, onClose }) => {
  // タブの状態
  const [activeTab, setActiveTab] = useState('manual');
  const [showAISettings, setShowAISettings] = useState(false);

  // 手動入力フォームの状態
  const [questionText, setQuestionText] = useState('');
  const [detail, setDetail] = useState('');
  const [genre, setGenre] = useState('');
  const [choices, setChoices] = useState([{ id: 1, choice: '', isCorrect: false }]);
  const [errors, setErrors] = useState({});

  // 編集時のデータ設定
  useEffect(() => {
    if (question) {
      setQuestionText(question.question);
      setDetail(question.detail || '');
      setGenre(question.genre);
      setChoices(question.choices);
      setActiveTab('manual'); // 編集時は手動タブを表示
    } else {
      resetForm();
    }
  }, [question]);

  // フォームをリセット
  const resetForm = () => {
    setQuestionText('');
    setDetail('');
    setGenre('');
    setChoices([{ id: 1, choice: '', isCorrect: false }]);
    setErrors({});
  };

  // ジャンル選択用のドロップダウンデータ
  const genreDropdownData =
    exam?.genres.map(g => ({
      label: g.name,
      value: g.name,
    })) || [];

  // 選択肢の変更ハンドラ
  const handleChoiceChange = (id, text) => {
    setChoices(prev => {
      const existingChoice = prev.find(c => c.id === id);
      if (existingChoice) {
        return prev.map(c => (c.id === id ? { ...c, choice: text } : c));
      }
      return [...prev, { id, choice: text, isCorrect: false }];
    });
  };

  // 正解フラグの変更ハンドラ
  const handleCorrectChange = (id, isCorrect) => {
    setChoices(prev => prev.map(c => (c.id === id ? { ...c, isCorrect } : c)));
  };

  // 選択肢の削除ハンドラ
  const handleDeleteChoice = id => {
    setChoices(prev => prev.filter(c => c.id !== id));
  };

  // バリデーション
  const validate = () => {
    const newErrors = {};

    if (!questionText.trim()) {
      newErrors.questionText = '問題文を入力してください';
    }

    if (!genre) {
      newErrors.genre = 'ジャンルを選択してください';
    }

    if (choices.length < 2) {
      newErrors.choices = '少なくとも2つの選択肢を追加してください';
    } else if (!choices.some(c => c.isCorrect)) {
      newErrors.choices = '正解の選択肢を少なくとも1つ設定してください';
    } else if (choices.every(c => c.isCorrect)) {
      newErrors.choices = 'すべての選択肢を正解にすることはできません';
    }
    if (choices.some(c => !c.choice.trim())) {
      newErrors.choices = '空の選択肢が存在します。すべての選択肢にテキストを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 保存処理
  const handleSave = () => {
    if (validate()) {
      onSave({
        question: questionText.trim(),
        detail: detail.trim(),
        genre,
        choices: choices.map(c => ({
          ...c,
          choice: c.choice.trim(),
        })),
      });
    }
  };

  // AI生成完了時の処理
  const handleGenerated = (questions) => {
    if (questions && questions.length > 0) {
      // 生成された全ての問題を整形して一括保存
      const formattedQuestions = questions.map(question => ({
        question: question.question.trim(),
        detail: question.detail ? question.detail.trim() : '',
        genre: question.genre,
        choices: question.choices.map(c => ({
          id: c.id,
          choice: c.choice.trim(),
          isCorrect: c.is_correct || c.isCorrect,
        })),
      }));
      onSaveMultiple(formattedQuestions); // 一括保存用の関数を呼び出し
      onClose(); // 全ての問題を保存したらモーダルを閉じる
    }
  };

  // モーダル本体のレンダリング
  const renderContent = () => {
    if (activeTab === 'ai') {
      return (
        <AIGenerateTab
          exam={exam}
          onGenerate={handleGenerated}
          onSettingsPress={() => setShowAISettings(true)}
        />
      );
    }

    return (
      <>
        <TextInputField
          label="問題文"
          defaultValue={questionText}
          onChangeText={setQuestionText}
          error={errors.questionText}
          placeholder="問題文を入力してください"
          multiline
        />

        <TextInputField
          label="解説（任意）"
          defaultValue={detail}
          onChangeText={setDetail}
          placeholder="解説を入力してください"
          multiline
          numberOfLines={3}
          style={styles.detailInput}
        />

        <View style={styles.dropdownContainer}>
          <Dropdown
            data={genreDropdownData}
            labelField="label"
            valueField="value"
            value={genre}
            onChange={item => setGenre(item.value)}
            placeholder="ジャンルを選択してください"
            style={styles.dropdown}
          />
          {errors.genre && <Text style={styles.errorText}>{errors.genre}</Text>}
        </View>

        <View style={styles.choicesContainer}>
          <Title style={styles.choicesTitle}>選択肢</Title>
          <ChoiceInput
            choices={choices}
            onChoiceChange={handleChoiceChange}
            onCorrectChange={handleCorrectChange}
            onDeleteChoice={handleDeleteChoice}
            maxChoices={8}
          />
          {errors.choices && <Text style={styles.errorText}>{errors.choices}</Text>}
        </View>

        <CustomButton label="保存" onPress={handleSave} mode="contained" style={styles.button} />
      </>
    );
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.container}>
        <ScrollView>
          <Title style={styles.title}>{question ? '問題の編集' : '新規問題の追加'}</Title>

          {!question && ( // 新規追加時のみタブを表示
            <SegmentedButtons
              value={activeTab}
              onValueChange={setActiveTab}
              buttons={[
                { value: 'manual', label: '手動作成' },
                { value: 'ai', label: 'AI生成' },
              ]}
              style={styles.tabs}
            />
          )}

          {renderContent()}

          <CustomButton
            label="キャンセル"
            onPress={onClose}
            mode="outlined"
            style={styles.button}
          />
        </ScrollView>
      </Modal>

      <AISettingsModal
        visible={showAISettings}
        onClose={() => setShowAISettings(false)}
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  title: {
    marginBottom: 16,
  },
  tabs: {
    marginBottom: 16,
  },
  dropdownContainer: {
    marginVertical: 8,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  choicesContainer: {
    marginVertical: 16,
  },
  choicesTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  detailInput: {
    marginTop: 8,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: 4,
  },
});

export default QuestionFormModal;
