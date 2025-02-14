import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox, IconButton, TextInput } from 'react-native-paper';

/**
 * 選択肢入力コンポーネント
 * @param {Object} props
 * @param {Array<{id: number, choice: string, isCorrect: boolean}>} props.choices - 選択肢配列
 * @param {Function} props.onChoiceChange - 選択肢テキスト変更時の処理
 * @param {Function} props.onCorrectChange - 正解フラグ変更時の処理
 * @param {Function} props.onDeleteChoice - 選択肢削除時の処理
 * @param {number} props.maxChoices - 最大選択肢数（デフォルト: 8）
 */
const ChoiceInput = ({
  choices,
  onChoiceChange,
  onCorrectChange,
  onDeleteChoice,
  maxChoices = 8,
}) => {
  return (
    <View style={styles.container}>
      {choices.map((choice, index) => (
        <View key={choice.id} style={styles.choiceRow}>
          <TextInput
            mode="outlined"
            defaultValue={choice.choice}
            onChangeText={text => onChoiceChange(choice.id, text)}
            placeholder={`選択肢 ${index + 1}`}
            style={styles.input}
          />
          <View style={styles.actions}>
            <Checkbox
              status={choice.isCorrect ? 'checked' : 'unchecked'}
              onPress={() => onCorrectChange(choice.id, !choice.isCorrect)}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => onDeleteChoice(choice.id)}
              disabled={choices.length <= 1}
            />
          </View>
        </View>
      ))}
      {choices.length < maxChoices && (
        <IconButton
          icon="plus-circle"
          size={24}
          onPress={() => onChoiceChange(Date.now(), '')}
          style={styles.addButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  choiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    alignSelf: 'center',
    margin: 8,
  },
});

export default ChoiceInput;
