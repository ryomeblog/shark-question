import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

/**
 * ヘッダーコンポーネント
 * @param {Object} props
 * @param {string} props.title - ヘッダーのタイトル
 * @param {React.ReactNode} props.leftIcon - 左側のアイコン
 * @param {React.ReactNode} props.rightIcon - 右側のアイコン
 * @param {Function} props.onLeftPress - 左側のアイコンを押した時の処理
 * @param {Function} props.onRightPress - 右側のアイコンを押した時の処理
 */
const Header = ({ title, leftIcon, rightIcon, onLeftPress, onRightPress }) => {
  return (
    <Appbar.Header style={styles.header}>
      {leftIcon && <Appbar.Action icon={leftIcon} onPress={onLeftPress} color="#fff" />}
      <Appbar.Content title={title} titleStyle={styles.title} />
      {rightIcon && <Appbar.Action icon={rightIcon} onPress={onRightPress} color="#fff" />}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 4,
    backgroundColor: '#6200ee',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;
