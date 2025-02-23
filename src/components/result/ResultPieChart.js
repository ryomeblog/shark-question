import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';

/**
 * 結果の円グラフコンポーネント
 * @param {Object} props
 * @param {number} props.correctCount - 正解数
 * @param {number} props.totalCount - 総問題数
 * @param {number} [props.size=200] - グラフのサイズ
 * @param {boolean} [props.showLabel=true] - ラベルの表示フラグ
 */
const ResultPieChart = ({ correctCount, totalCount, size = 200, showLabel = true }) => {
  // グラフの設定値
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // 正答率の計算
  const percentage = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* 背景の円 */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* 進捗を示す円 */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#2196F3"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={[styles.labelContainer, { width: size, height: size }]}>
        <Text variant="headlineLarge" style={styles.percentageText}>
          {Math.round(percentage)}%
        </Text>
        {showLabel && (
          <>
            <Text variant="bodyMedium" style={styles.countText}>
              {correctCount} / {totalCount}
            </Text>
            <Text variant="bodySmall" style={styles.labelText}>
              正解率
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  countText: {
    color: '#757575',
    marginTop: 4,
  },
  labelText: {
    color: '#757575',
    marginTop: 2,
  },
});

export default ResultPieChart;