import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Modal, Portal, Text, Title } from 'react-native-paper';

import { aiStore } from '../../stores/aiStore';
import { AIClientFactory } from '../../utils/ai/clientFactory';
import TextInputField from '../form/TextInputField';
import CustomButton from '../ui/CustomButton';

/**
 * AI設定モーダル
 * @param {Object} props
 * @param {boolean} props.visible - モーダルの表示状態
 * @param {Function} props.onClose - 閉じるときのコールバック
 */
const AISettingsModal = ({ visible, onClose }) => {
  // 設定状態
  const [modelType, setModelType] = useState('OpenAI');
  const [apiKey, setApiKey] = useState('');
  const [errors, setErrors] = useState({});

  // 初期設定の読み込み
  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  // 設定を読み込む
  const loadSettings = async () => {
    if (aiStore.settings) {
      setModelType(aiStore.settings.modelType);
      setApiKey(aiStore.settings.apiKey);
    }
  };

  // バリデーション
  const validate = () => {
    const newErrors = {};

    if (!modelType) {
      newErrors.modelType = 'モデルを選択してください';
    }

    if (!apiKey.trim() && modelType !== 'Ollama') {
      newErrors.apiKey = 'APIキーを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 保存処理
  const handleSave = async () => {
    if (validate()) {
      await aiStore.updateSettings({
        modelType,
        apiKey: apiKey.trim(),
      });
      onClose();
    }
  };

  // モデル選択用のデータ
  const modelOptions = AIClientFactory.getAvailableModels().map(model => ({
    label: AIClientFactory.getModelDisplayName(model),
    value: model,
  }));

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.container}>
        <Title style={styles.title}>AI設定</Title>

        <View style={styles.modelSection}>
          <Text style={styles.sectionTitle}>使用するAIモデル</Text>
          <Dropdown
            data={modelOptions}
            labelField="label"
            valueField="value"
            value={modelType}
            onChange={item => {
              setModelType(item.value);
              // Ollamaの場合はAPIキーをクリア
              if (item.value === 'Ollama') {
                setApiKey('');
              }
            }}
            style={styles.dropdown}
          />
          {errors.modelType && (
            <Text style={styles.errorText}>{errors.modelType}</Text>
          )}
        </View>

        {modelType !== 'Ollama' && (
          <View style={styles.apiKeySection}>
            <TextInputField
              label="APIキー"
              defaultValue={apiKey}
              onChangeText={setApiKey}
              error={errors.apiKey}
              placeholder="APIキーを入力してください"
              secureTextEntry={true}
            />
          </View>
        )}

        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            {AIClientFactory.getModelDescription(modelType)}
          </Text>
        </View>

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
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    marginBottom: 16,
  },
  modelSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  apiKeySection: {
    marginBottom: 16,
  },
  descriptionSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    marginTop: 8,
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: 4,
  },
});

export default AISettingsModal;