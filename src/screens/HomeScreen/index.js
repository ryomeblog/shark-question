import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Title } from 'react-native-paper';

import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import CustomButton from '../../components/ui/CustomButton';
import { useStores } from '../../stores';

/**
 * ホーム画面
 */
const HomeScreen = observer(({ navigation }) => {
  // メニューボタンの設定
  const { examStore } = useStores();

  // 前回の試験から開始
  const handleLastExam = () => {
    navigation.navigate('Question', {
      examId: examStore.lastExamId,
      mode: 'random',
    });
  };

  const menuButtons = [
    {
      icon: 'book-open-variant',
      label: '問題を解く',
      onPress: () => navigation.navigate('ExamSelect'),
    },
    {
      icon: 'pencil',
      label: '問題を追加',
      onPress: () => navigation.navigate('QuestionAdd'),
    },
    {
      icon: 'tag-multiple',
      label: 'ジャンル管理',
      onPress: () => navigation.navigate('Genre'),
    },
    {
      icon: 'clipboard-list',
      label: '試験管理',
      onPress: () => navigation.navigate('Exam'),
    },
    {
      icon: 'database-import-outline',
      label: 'データ管理',
      onPress: () => navigation.navigate('ExportImport'),
    },
  ];

  return (
    <ScreenContainer>
      <Header title="問題集" />
      <View style={styles.content}>
        <Title style={styles.title}>メニュー</Title>
        <View style={styles.buttonContainer}>
          {menuButtons.map((button, index) => (
            <CustomButton
              key={`menu-button-${index}`}
              icon={button.icon}
              label={button.label}
              onPress={button.onPress}
              mode="contained"
              style={styles.button}
            />
          ))}
          <CustomButton
            icon="history"
            label="前回の試験から開始"
            onPress={handleLastExam}
            mode="outlined"
            style={[styles.button, styles.lastExamButton]}
            disabled={!examStore.lastExamId}
          />
        </View>
      </View>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#000000',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    marginVertical: 8,
  },
  lastExamButton: {
    marginTop: 16,
  },
});

export default HomeScreen;
