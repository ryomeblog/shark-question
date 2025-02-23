import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';

/**
 * 履歴の一覧表示コンポーネント
 * @param {Object} props
 * @param {Array} props.histories - 履歴データの配列
 * @param {Function} props.onPress - 履歴項目タップ時のコールバック
 */
const HistoryList = ({ histories, onPress }) => {
  const theme = useTheme();

  // 時間のフォーマット（分と秒）
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}分${seconds}秒`;
  };

  // 正答率の計算
  const calculatePercentage = (correct, total) => {
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  const renderHistoryItem = (history) => {
    const percentage = calculatePercentage(history.correctAnswers, history.totalQuestions);
    const date = format(new Date(history.timestamp), 'yyyy/MM/dd HH:mm', { locale: ja });

    return (
      <List.Item
        key={history.id}
        title={date}
        description={`${history.totalQuestions}問中${history.correctAnswers}問正解 (${percentage}%)\n所要時間：${formatTime(history.totalTime)}`}
        left={props => (
          <View style={styles.percentageContainer}>
            <Text style={[styles.percentageText, { color: theme.colors.primary }]}>
              {percentage}%
            </Text>
          </View>
        )}
        onPress={() => onPress(history)}
        style={styles.listItem}
      />
    );
  };

  return (
    <View style={styles.container}>
      {histories.length > 0 ? (
        histories.map(renderHistoryItem)
      ) : (
        <Text style={styles.emptyText}>履歴がありません</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  percentageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#757575',
  },
});

export default HistoryList;