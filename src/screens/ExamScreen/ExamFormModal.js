import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Modal, Portal } from "react-native-paper";

import TextInputField from "../../components/form/TextInputField";
import CustomButton from "../../components/ui/CustomButton";

/**
 * 試験フォームモーダル
 * @param {Object} props
 * @param {boolean} props.visible - モーダルの表示状態
 * @param {Object} props.exam - 編集する試験データ（新規の場合はnull）
 * @param {Function} props.onSave - 保存時のコールバック
 * @param {Function} props.onClose - 閉じる時のコールバック
 */
const ExamFormModal = ({ visible, exam, onSave, onClose }) => {
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [errors, setErrors] = useState({});

  // 編集時のデータ設定
  useEffect(() => {
    if (exam) {
      setName(exam.name);
      setDetail(exam.detail);
    } else {
      setName("");
      setDetail("");
    }
    setErrors({});
  }, [exam]);

  // バリデーション
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "試験名を入力してください";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 保存処理
  const handleSave = () => {
    if (validate()) {
      onSave({
        name: name.trim(),
        detail: detail.trim(),
      });
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.container}
      >
        <TextInputField
          label="試験名"
          defaultValue={exam?.name || ""}
          onChangeText={setName}
          error={errors.name}
          placeholder="試験名を入力してください"
        />

        <TextInputField
          label="詳細"
          defaultValue={exam?.detail || ""}
          onChangeText={setDetail}
          error={errors.detail}
          placeholder="試験の詳細を入力してください"
          multiline
        />

        <CustomButton
          label="保存"
          onPress={handleSave}
          mode="contained"
          style={styles.button}
        />

        <CustomButton
          label="キャンセル"
          onPress={onClose}
          mode="outlined"
          style={styles.button}
        />
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  button: {
    marginTop: 16,
  },
});

export default ExamFormModal;
