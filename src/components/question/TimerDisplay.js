import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

/**
 * タイマー表示コンポーネント
 * @param {Object} props
 * @param {number} props.startTime - 開始時間（ミリ秒）
 * @param {boolean} props.running - タイマーが実行中かどうか
 */
const TimerDisplay = ({ startTime, running }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId;

    if (running) {
      // 10ミリ秒ごとに更新
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        setElapsedTime(currentTime - startTime);
      }, 10);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [running, startTime]);

  // 経過時間をフォーマット（分:秒.ミリ秒）
  const formatTime = ms => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    position: 'absolute',
    right: 16,
    top: 16,
  },
  timer: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'monospace',
  },
});

export default TimerDisplay;
