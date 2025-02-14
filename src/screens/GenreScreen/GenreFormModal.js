import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Modal, Portal } from 'react-native-paper';

import TextInputField from '../../components/form/TextInputField';
import CustomButton from '../../components/ui/CustomButton';

/**
 * ジャンルフォームモーダル
 * @param {Object} props
 * @param {boolean} props.visible - モーダルの表示状態
 * @param {Object} props.genre - 編集するジャンルデータ（新規の場合はnull）
 * @param {Function} props.onSave - 保存時のコールバック
 * @param {Function} props.onClose - 閉じる時のコールバック
 */
const GenreFormModal = ({ visible, genre, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});

  // 編集時のデータ設定
  useEffect(() => {
    if (genre) {
      setName(genre.name);
    } else {
      setName('');
    }
    setErrors({});
  }, [genre]);

  // バリデーション
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'ジャンル名を入力してください';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 保存処理
  const handleSave = () => {
    if (validate()) {
      onSave({
        name: name.trim(),
      });
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.container}>
        <TextInputField
          label="ジャンル名"
          defaultValue={genre?.name || ''}
          onChangeText={setName}
          error={errors.name}
          placeholder="ジャンル名を入力してください"
        />

        <CustomButton label="保存" onPress={handleSave} mode="contained" style={styles.button} />

        <CustomButton label="キャンセル" onPress={onClose} mode="outlined" style={styles.button} />
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  button: {
    marginTop: 16,
  },
});

export default GenreFormModal;
