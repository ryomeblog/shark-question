import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import HistoryList from '../../components/result/HistoryList';
import ResultPieChart from '../../components/result/ResultPieChart';
import { useStores } from '../../stores';

/**
 * 履歴画面
 */
const HistoryScreen = observer(({ navigation }) => {
  const { examStore, progressStore } = useStores();
  const [selectedExamId, setSelectedExamId] = useState(null);

  // 選択中の試験
  const currentExam = examStore.exams.find(exam => exam.id === selectedExamId);

  // 試験選択用のドロップダウンデータ
  const examDropdownData = examStore.exams.map(exam => ({
    label: exam.name,
    value: exam.id,
  }));

  // 選択された試験の統計情報を取得
  const examStats = selectedExamId ? progressStore.getExamStats(selectedExamId) : null;

  // 選択された試験の履歴を取得
  const histories = selectedExamId ? progressStore.getResultHistories(selectedExamId) : [];

  // 履歴項目タップ時のハンドラ
  const handleHistoryPress = (history) => {
    // TODO: 結果詳細画面への遷移を実装
    // navigation.navigate('ResultDetail', {
    //   examId: history.examId,
    //   historyId: history.id,
    // });
  };

  return (
    <ScreenContainer>
      <Header
        title="履歴"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        {/* 試験選択ドロップダウン */}
        <Dropdown
          data={examDropdownData}
          labelField="label"
          valueField="value"
          value={selectedExamId}
          onChange={item => setSelectedExamId(item.value)}
          placeholder="試験を選択してください"
          style={styles.dropdown}
        />

        {/* 正答率円グラフ */}
        {examStats && (
          <View style={styles.chartContainer}>
            <ResultPieChart
              correctCount={examStats.correctAnswers}
              totalCount={examStats.totalAnswered}
              size={180}
            />
          </View>
        )}

        {/* 履歴一覧 */}
        <View style={styles.listContainer}>
          <HistoryList
            histories={histories}
            onPress={handleHistoryPress}
          />
        </View>
      </View>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  listContainer: {
    flex: 1,
  },
});

export default HistoryScreen;