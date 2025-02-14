import React, { useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Card, Text, Title } from 'react-native-paper';

/**
 * 結果表示カードコンポーネント
 * @param {Object} props
 * @param {boolean} props.correct - 正解かどうか
 * @param {string} props.message - 表示メッセージ
 * @param {number} props.timeSpent - 解答にかかった時間（ミリ秒）
 */
const ResultCard = ({ correct, message = '', timeSpent }) => {
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    // アニメーションの実行
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // 3秒後にフェードアウト
    const timer = setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const formatTime = ms => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}秒`;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Card style={[styles.card, correct ? styles.correctCard : styles.incorrectCard]}>
        <Card.Content>
          <Title style={styles.result}>{correct ? '正解！' : '不正解...'}</Title>
          {message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>回答時間：</Text>
            <Text style={styles.timeValue}>{formatTime(timeSpent)}</Text>
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    width: '80%',
    elevation: 8,
  },
  correctCard: {
    backgroundColor: '#4caf50',
  },
  incorrectCard: {
    backgroundColor: '#f44336',
  },
  result: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 8,
  },
  message: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  timeLabel: {
    color: '#fff',
    marginRight: 4,
  },
  timeValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ResultCard;
