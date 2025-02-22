import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Chip, Text, Title } from 'react-native-paper';

import { aiStore } from '../../stores/aiStore';
import { AIClientFactory } from '../../utils/ai/clientFactory';
import TextInputField from '../form/TextInputField';
import CustomButton from '../ui/CustomButton';

/**
 * AI生成タブ
 * @param {Object} props
 * @param {Object} props.exam - 試験データ
 * @param {Function} props.onGenerate - 生成完了時のコールバック
 * @param {Function} props.onSettingsPress - 設定ボタン押下時のコールバック
 */
const AIGenerateTab = ({ exam, onGenerate, onSettingsPress }) => {
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // キーワードを追加
  const handleAddKeyword = () => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword && !keywords.includes(trimmedKeyword)) {
      setKeywords([...keywords, trimmedKeyword]);
      setKeyword('');
    }
  };

  // キーワードを削除
  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };

  // 問題を生成
  const handleGenerate = async () => {
    if (keywords.length === 0) {
      setError('キーワードを1つ以上入力してください');
      return;
    }

    if (!aiStore.settings?.apiKey && aiStore.settings?.modelType !== 'Ollama') {
      setError('APIキーが設定されていません');
      return;
    }

    try {
      setIsGenerating(true);
      setError('');
      
      const resultText = await aiStore.generateQuestions(exam.name, keywords);
      const result = JSON.parse(resultText.text);
      console.log('問題生成結果:', JSON.stringify(result, null, 2));
      onGenerate(result.questions);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Title>AI問題生成</Title>
          <CustomButton
            label="AI設定"
            onPress={onSettingsPress}
            mode="outlined"
            icon="cog"
          />
        </View>

        <View style={styles.modelInfo}>
          <Text>使用モデル: {AIClientFactory.getModelDisplayName(aiStore.settings?.modelType)}</Text>
        </View>

        <View style={styles.keywordInput}>
          <TextInputField
            label="キーワード"
            value={keyword}
            onChangeText={setKeyword}
            placeholder="キーワードを入力"
            onSubmitEditing={handleAddKeyword}
          />
          <CustomButton
            label="追加"
            onPress={handleAddKeyword}
            mode="contained"
            disabled={!keyword.trim()}
            style={styles.addButton}
          />
        </View>

        <View style={styles.keywordList}>
          {keywords.map((k, index) => (
            <Chip
              key={index}
              onClose={() => handleRemoveKeyword(k)}
              style={styles.chip}
            >
              {k}
            </Chip>
          ))}
        </View>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <View style={styles.generateSection}>
          {isGenerating ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>問題を生成中...</Text>
            </View>
          ) : (
            <CustomButton
              label="問題を生成"
              onPress={handleGenerate}
              mode="contained"
              icon="robot"
              disabled={keywords.length === 0}
              style={styles.generateButton}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modelInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  keywordInput: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  addButton: {
    marginLeft: 8,
    marginTop: 6,
  },
  keywordList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    margin: 4,
  },
  generateSection: {
    marginTop: 24,
  },
  generateButton: {
    padding: 8,
  },
  loading: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#B00020',
    marginTop: 8,
  },
});

export default AIGenerateTab;