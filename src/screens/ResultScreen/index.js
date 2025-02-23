import { observer } from 'mobx-react-lite';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Divider, Text, Title } from 'react-native-paper';

import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import ResultPieChart from '../../components/result/ResultPieChart';
import CustomButton from '../../components/ui/CustomButton';
import ListItem from '../../components/ui/ListItem';
import { useStores } from '../../stores';

/**
 * 結果画面
 */
const ResultScreen = observer(({ navigation, route }) => {
  const { examStore, progressStore } = useStores();
  const { examId, results, mode } = route.params;
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  // 結果を保存
  React.useEffect(() => {
    const saveResult = async () => {
      await progressStore.addResultHistory({
        examId,
        totalQuestions: results.length,
        correctAnswers: results.filter(r => r.isCorrect).length,
        totalTime: results.reduce((sum, r) => sum + r.timeSpent, 0),
        mode,
      });
    };
    saveResult();
  }, [examId, results, mode, progressStore]);

  // 問題の選択状態を切り替える
  const toggleQuestionDetail = questionId => {
    setSelectedQuestionIds(prevIds => {
      if (prevIds.includes(questionId)) {
        // 既に選択されている場合は削除
        return prevIds.filter(id => id !== questionId);
      } else {
        // 選択されていない場合は追加
        return [...prevIds, questionId];
      }
    });
  };

  // 現在の試験
  const currentExam = examStore.exams.find(exam => exam.id === examId);

  // 結果のサマリー
  const summary = useMemo(() => {
    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);
    const averageTime = Math.round(totalTime / totalQuestions);

    return {
      totalQuestions,
      correctAnswers,
      totalTime,
      averageTime,
    };
  }, [results]);

  // 時間のフォーマット（分:秒.ミリ秒）
  const formatTime = ms => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  // 問題の再チャレンジ
  const handleRetryAll = () => {
    navigation.replace('Question', {
      examId,
      mode: 'random',
    });
  };

  // 間違えた問題の再チャレンジ
  const handleRetryWrong = () => {
    navigation.replace('Question', {
      examId,
      mode: 'wrong',
    });
  };

  // ホームに戻る
  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <ScreenContainer>
      <Header title="結果" leftIcon="home" onLeftPress={handleGoHome} />

      <ScrollView style={styles.content}>
        <View style={styles.summaryContainer}>
          <Title style={styles.examName}>{currentExam?.name}</Title>

          <ResultPieChart
            correctCount={summary.correctAnswers}
            totalCount={summary.totalQuestions}
            size={180}
          />

          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>合計時間</Text>
            <Title style={styles.timeValue}>{formatTime(summary.totalTime)}</Title>
            <Text style={styles.timeSubtext}>平均 {formatTime(summary.averageTime)} / 問</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <Title style={styles.sectionTitle}>問題一覧</Title>

        {results.map((result, index) => {
          const question = currentExam?.questions.find(q => q.id === result.questionId);
          if (!question) return null;

          const isSelected = selectedQuestionIds.includes(question.id);

          return (
            <View key={`result-${index}`}>
              <ListItem
                title={question.question}
                description={`時間: ${formatTime(result.timeSpent)}`}
                leftIcon={result.isCorrect ? 'check-circle' : 'close-circle'}
                onPress={() => toggleQuestionDetail(question.id)}
                style={[
                  styles.itemContainer,
                  styles.resultItem,
                  result.isCorrect ? styles.correctItem : styles.incorrectItem,
                ]}
              />
              {isSelected && (
                <View
                  style={[
                    styles.detailContainer,
                    result.isCorrect ? styles.correctDetail : styles.incorrectDetail,
                  ]}
                >
                  <Text style={styles.questionText}>{question.question}</Text>
                  <View style={styles.choicesContainer}>
                    {question.choices.map((choice, choiceIndex) => (
                      <Text
                        key={`choice-${choiceIndex}`}
                        style={[styles.choiceText, choice.isCorrect && styles.correctChoiceText]}
                      >{`${choiceIndex + 1}. ${choice.choice}`}</Text>
                    ))}
                  </View>
                  {question.detail && (
                    <>
                      <Title style={styles.detailTitle}>解説</Title>
                      <Text style={styles.detailText}>{question.detail}</Text>
                    </>
                  )}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.buttonContainer}>
          <CustomButton
            label="もう一度チャレンジ"
            onPress={handleRetryAll}
            mode="contained"
            icon="reload"
            style={styles.button}
          />

          <CustomButton
            label="間違えた問題にチャレンジ"
            onPress={handleRetryWrong}
            mode="contained-tonal"
            icon="alert-circle"
            style={styles.button}
          />

          <CustomButton
            label="ホームに戻る"
            onPress={handleGoHome}
            mode="outlined"
            icon="home"
            style={styles.button}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  summaryContainer: {
    padding: 16,
  },
  examName: {
    fontSize: 24,
    textAlign: 'center',
    color: '#000000',
    marginBottom: 24,
  },
  timeContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  timeLabel: {
    fontSize: 16,
    color: '#000000',
  },
  timeValue: {
    fontSize: 28,
    marginVertical: 4,
    color: '#000000',
  },
  timeSubtext: {
    fontSize: 14,
    color: '#000000',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 16,
    color: '#000000',
  },
  itemContainer: {
    overflow: 'hidden',
  },
  resultItem: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  correctItem: {
    backgroundColor: '#e8f5e9',
  },
  incorrectItem: {
    backgroundColor: '#ffebee',
  },
  detailContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
  },
  correctDetail: {
    backgroundColor: '#e8f5e9',
    borderColor: '#81c784',
    borderWidth: 1,
  },
  incorrectDetail: {
    backgroundColor: '#ffebee',
    borderColor: '#e57373',
    borderWidth: 1,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
  },
  choicesContainer: {
    marginBottom: 16,
  },
  choiceText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#000000',
  },
  correctChoiceText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  detailText: {
    color: '#000000',
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    marginBottom: 16,
  },
});

export default ResultScreen;
