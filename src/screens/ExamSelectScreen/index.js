import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, List, Text } from 'react-native-paper';

import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import CustomButton from '../../components/ui/CustomButton';
import { withStores } from '../../stores';

/**
 * 試験選択画面
 */
const ExamSelectScreen = observer(({ navigation, stores }) => {
  const { examStore } = stores;

  // 試験を選択した時の処理
  const handleExamSelect = async examId => {
    // 前回の試験IDを保存
    await examStore.setLastExamId(examId);

    // 問題画面に遷移
    navigation.navigate('Question', {
      examId,
      mode: 'random', // デフォルトモード
    });
  };

  // 試験管理画面への遷移
  const handleManageExams = () => {
    navigation.navigate('Exam');
  };

  return (
    <ScreenContainer>
      <Header title="試験を選択" leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} />

      <View style={styles.content}>
        {examStore.exams.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>試験が登録されていません</Text>
            <CustomButton
              icon="plus-circle"
              label="試験を登録する"
              onPress={handleManageExams}
              mode="contained"
              style={styles.button}
            />
          </View>
        ) : (
          <View>
            {examStore.exams.map((exam, index) => (
              <React.Fragment key={exam.id}>
                <List.Item
                  title={exam.name}
                  description={`問題数: ${exam.questions.length}問`}
                  onPress={() => handleExamSelect(exam.id)}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                />
                {index < examStore.exams.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    color: '#000000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#000000',
  },
  button: {
    width: '100%',
    marginVertical: 8,
  },
});

export default withStores(ExamSelectScreen);
