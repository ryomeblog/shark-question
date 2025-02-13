import React from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

/**
 * フローティングアクションボタンコンポーネント
 * @param {Object} props
 * @param {string} props.icon - アイコン名
 * @param {Function} props.onPress - ボタンを押した時の処理
 * @param {string} props.label - ツールチップに表示するラベル（オプション）
 */
const CustomFAB = ({ icon, onPress, label }) => {
  return (
    <FAB
      icon={icon}
      onPress={onPress}
      label={label}
      style={styles.fab}
      color="#fff"
      animated={true}
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6200ee",
  },
});

export default CustomFAB;
