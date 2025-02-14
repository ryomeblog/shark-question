import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { RadioButton, Text, Title } from 'react-native-paper';

import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import CustomButton from '../../components/ui/CustomButton';

/**
 * 問題モード選択画面
 * @param {Object} props
 * @param {Object} props.exam - 試験データ
 * @param {Function} props.onSelect - モード選択時のコールバック
 * @param {Function} props.onCancel - キャンセル時のコールバック
 */
const QuestionModeSelect = ({ exam, onSelect, onCancel }) => {
  const [mode, setMode] = useState('random');
  const [genre, setGenre] = useState('');
  const [ordered, setOrdered] = useState(false);

  // ジャンル選択用のドロップダウンデータ
  const genreDropdownData =
    exam?.genres.map(g => ({
      label: g.name,
      value: g.name,
    })) || [];

  // 開始ボタンのハンドラ
  const handleStart = () => {
    onSelect(mode, genre, ordered);
  };

  return (
    <ScreenContainer>
      <Header title="出題モード選択" leftIcon="arrow-left" onLeftPress={onCancel} />

      <View style={styles.content}>
        <Title style={styles.sectionTitle}>出題モード</Title>

        <RadioButton.Group onValueChange={value => setMode(value)} value={mode}>
          <View style={styles.radioItem}>
            <RadioButton value="random" />
            <Text>ランダム10問</Text>
          </View>

          <View style={styles.radioItem}>
            <RadioButton value="all" />
            <Text>全問チャレンジ</Text>
          </View>

          <View style={styles.radioItem}>
            <RadioButton value="wrong" />
            <Text>間違えた問題のみ</Text>
          </View>
        </RadioButton.Group>

        {mode === 'all' && (
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>出題順序</Title>
            <RadioButton.Group
              onValueChange={value => setOrdered(value === 'ordered')}
              value={ordered ? 'ordered' : 'random'}
            >
              <View style={styles.radioItem}>
                <RadioButton value="random" />
                <Text>ランダム</Text>
              </View>

              <View style={styles.radioItem}>
                <RadioButton value="ordered" />
                <Text>順番通り</Text>
              </View>
            </RadioButton.Group>
          </View>
        )}

        <View style={styles.section}>
          <Title style={styles.sectionTitle}>ジャンル選択（任意）</Title>
          <Dropdown
            data={genreDropdownData}
            labelField="label"
            valueField="value"
            value={genre}
            onChange={item => setGenre(item.value)}
            placeholder="すべてのジャンル"
            style={styles.dropdown}
          />
          <Text style={styles.hint}>
            ※ジャンルを選択すると、そのジャンルの問題のみが出題されます
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton label="開始" onPress={handleStart} mode="contained" style={styles.button} />

          <CustomButton
            label="キャンセル"
            onPress={onCancel}
            mode="outlined"
            style={styles.button}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  section: {
    marginTop: 24,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 32,
  },
  button: {
    marginBottom: 16,
  },
});

export default QuestionModeSelect;
