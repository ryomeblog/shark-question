import * as Clipboard from 'expo-clipboard';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';

import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { withStores } from '../../stores';
import {
  compressAndEncode,
  decodeAndDecompress,
  validateImportData,
} from '../../utils/exportImport';

/**
 * JSONエクスポート/インポート画面
 */
const ExportImportScreen = observer(({ stores, navigation }) => {
  const { examStore } = stores;
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [exportedData, setExportedData] = useState('');
  const [importData, setImportData] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogExam, setDialogExam] = useState(null);

  /**
   * 試験データをエクスポートする
   */
  const handleExport = useCallback(async () => {
    if (!selectedExamId) {
      return;
    }

    try {
      const exam = examStore.exams.find(e => e.id === selectedExamId);
      if (!exam) return;

      const encoded = compressAndEncode(exam);
      setExportedData(encoded);
    } catch (error) {
      console.error('エクスポートエラー:', error);
    }
  }, [selectedExamId, examStore.exams]);

  /**
   * エクスポートデータをクリップボードにコピーする
   */
  const handleCopy = useCallback(async () => {
    if (exportedData) {
      await Clipboard.setStringAsync(exportedData);
    }
  }, [exportedData]);

  /**
   * データをインポートする
   */
  const handleImport = useCallback(() => {
    try {
      if (!importData) return;

      const decodedData = decodeAndDecompress(importData);

      if (!validateImportData(decodedData)) {
        return;
      }

      setDialogExam(decodedData);
      setShowDialog(true);
    } catch (error) {
      console.error('インポートエラー:', error);
    }
  }, [importData]);

  /**
   * インポートを確定する
   */
  const handleConfirmImport = useCallback(() => {
    if (dialogExam) {
      examStore.addExam(dialogExam);
      setImportData('');
      setDialogExam(null);
    }
    setShowDialog(false);
  }, [dialogExam, examStore]);

  return (
    <ScreenContainer>
      <Header
        title="JSONエクスポート/インポート"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>エクスポート</Text>
          <View style={styles.examSelect}>
            {examStore.exams.map(exam => (
              <Button
                key={exam.id}
                mode={selectedExamId === exam.id ? 'contained' : 'outlined'}
                onPress={() => setSelectedExamId(exam.id)}
                style={styles.examButton}
              >
                {exam.name}
              </Button>
            ))}
          </View>
          <Button
            mode="contained"
            onPress={handleExport}
            disabled={!selectedExamId}
            style={styles.button}
          >
            エクスポート
          </Button>
          {exportedData ? (
            <View style={styles.resultContainer}>
              <Text style={styles.text}>エクスポートデータ:</Text>
              <TextInput
                mode="outlined"
                value={exportedData}
                multiline
                numberOfLines={4}
                editable={false}
                style={styles.textInput}
              />
              <Button mode="contained" onPress={handleCopy} style={styles.button}>
                クリップボードにコピー
              </Button>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>インポート</Text>
          <TextInput
            mode="outlined"
            label="インポートするデータを入力"
            value={importData}
            onChangeText={setImportData}
            multiline
            numberOfLines={4}
            style={styles.textInput}
          />
          <Button
            mode="contained"
            onPress={handleImport}
            disabled={!importData}
            style={styles.button}
          >
            インポート
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>確認</Dialog.Title>
          <Dialog.Content>
            <Text>
              試験「{dialogExam?.name}」をインポートしますか？{'\n'}
              問題数: {dialogExam?.questions?.length || 0}
              {'\n'}
              ジャンル数: {dialogExam?.genres?.length || 0}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>キャンセル</Button>
            <Button onPress={handleConfirmImport}>インポート</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  examSelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  examButton: {
    margin: 4,
  },
  resultContainer: {
    marginTop: 16,
  },
  textInput: {
    marginVertical: 8,
  },
  button: {
    marginTop: 8,
  },
  text: {
    color: '#000000',
  },
});

export default withStores(ExportImportScreen);
