import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton, List } from 'react-native-paper';

/**
 * リストアイテムコンポーネント
 * @param {Object} props
 * @param {string} props.title - アイテムのタイトル
 * @param {string} props.description - アイテムの説明（オプション）
 * @param {string} props.leftIcon - 左側のアイコン（オプション）
 * @param {Array<{icon: string, onPress: Function}>} props.rightIcons - 右側のアイコンボタン配列
 * @param {Function} props.onPress - タップ時のコールバック関数（オプション）
 * @param {Object} props.style - スタイルオブジェクト（オプション）
 */
const ListItem = ({ title, description, leftIcon, rightIcons = [], onPress, style }) => {
  return (
    <List.Item
      title={title}
      description={description}
      left={leftIcon ? props => <List.Icon {...props} icon={leftIcon} /> : null}
      right={() => (
        <React.Fragment>
          {rightIcons.map((iconProps, index) => (
            <IconButton
              key={`${title}-icon-${index}`}
              icon={iconProps.icon}
              onPress={iconProps.onPress}
              size={20}
              style={styles.rightIcon}
            />
          ))}
        </React.Fragment>
      )}
      onPress={onPress}
      style={[styles.item, style]}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  rightIcon: {
    marginHorizontal: 4,
  },
});

export default ListItem;
