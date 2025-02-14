import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * 画面のコンテナコンポーネント
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子要素
 * @param {number} props.padding - パディング（デフォルト: 16）
 * @param {boolean} props.safeArea - SafeAreaViewを使用するかどうか（デフォルト: true）
 */
const ScreenContainer = ({ children, padding = 16, safeArea = true }) => {
  const Container = safeArea ? SafeAreaView : View;

  return <Container style={[styles.container, { padding }]}>{children}</Container>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ScreenContainer;
