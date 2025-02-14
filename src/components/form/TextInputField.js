import React from 'react';
import { StyleSheet } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

/**
 * テキスト入力フィールドコンポーネント
 * @param {Object} props
 * @param {string} props.label - 入力フィールドのラベル
 * @param {string} props.defaultValue - 初期値
 * @param {Function} props.onChangeText - テキスト変更時の処理
 * @param {string} props.error - エラーメッセージ
 * @param {string} props.placeholder - プレースホルダー
 * @param {boolean} props.multiline - 複数行入力を許可するか
 */
const TextInputField = ({
  label,
  defaultValue = '',
  onChangeText,
  error,
  placeholder,
  multiline = false,
}) => {
  return (
    <>
      <TextInput
        label={label}
        defaultValue={defaultValue}
        onChangeText={onChangeText}
        error={!!error}
        placeholder={placeholder}
        multiline={multiline}
        mode="outlined"
        style={[styles.input, multiline && styles.multilineInput]}
      />
      {error && (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 100,
  },
});

export default TextInputField;
