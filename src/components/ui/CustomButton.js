import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

/**
 * カスタムボタンコンポーネント
 * @param {Object} props
 * @param {string} props.label - ボタンのラベル
 * @param {Function} props.onPress - ボタンを押した時の処理
 * @param {('contained'|'outlined'|'text')} props.mode - ボタンのモード
 * @param {string} props.icon - アイコン名
 * @param {boolean} props.disabled - 無効状態
 */
const CustomButton = ({ label, onPress, mode = 'contained', icon, disabled = false }) => {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      icon={icon}
      disabled={disabled}
      style={styles.button}
      labelStyle={styles.label}
    >
      {label}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default CustomButton;
