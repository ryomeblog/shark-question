import React from "react";
import { StyleSheet } from "react-native";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";

/**
 * 確認ダイアログコンポーネント
 * @param {Object} props
 * @param {boolean} props.visible - ダイアログの表示状態
 * @param {string} props.title - ダイアログのタイトル
 * @param {string} props.message - ダイアログのメッセージ
 * @param {Function} props.onConfirm - 確認ボタンを押した時の処理
 * @param {Function} props.onCancel - キャンセルボタンを押した時の処理
 */
const ConfirmDialog = ({ visible, title, message, onConfirm, onCancel }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={styles.dialog}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>キャンセル</Button>
          <Button onPress={onConfirm} mode="contained">
            確認
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 8,
  },
});

export default ConfirmDialog;
