import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Title } from 'react-native-paper';

import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import QuestionCard from '../../components/question/QuestionCard';
import ResultCard from '../../components/question/ResultCard';
import TimerDisplay from '../../components/question/TimerDisplay';
import { withStores } from '../../stores';
import QuestionModeSelect from './QuestionModeSelect';

/**
 * 問題画面
 */
const QuestionScreen = observer(({ navigation, route, stores }) => {
  const { examStore, progressStore } = stores;
  const { examId, genre, mode = 'random', ordered = false } = route.params || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState([]);
  const [showModeSelect, setShowModeSelect] = useState(!mode);

  // 現在の試験
  const currentExam = examStore.exams.find(exam => exam.id === examId);

  // 問題の取得
  useEffect(() => {
    if (currentExam && mode && !showModeSelect) {
      let selectedQuestions;

      switch (mode) {
        case 'wrong':
          const wrongQuestionIds = progressStore.getWrongQuestionIds(examId);
          selectedQuestions = currentExam.questions.filter(q => wrongQuestionIds.includes(q.id));
          break;

        case 'all':
          selectedQuestions = [...currentExam.questions];
          if (!ordered) {
            selectedQuestions.sort(() => 0.5 - Math.random());
          }
          break;

        case 'random':
        default:
          selectedQuestions = examStore.getRandomQuestions(examId, 10, genre);
          break;
      }

      setQuestions(selectedQuestions);
      setCurrentIndex(0);
      setStartTime(Date.now());
      setTimerRunning(true);
      setResults([]);
    }
  }, [currentExam, mode, genre, ordered, showModeSelect]);

  // 回答処理
  const handleAnswer = useCallback(
    async selectedChoices => {
      const question = questions[currentIndex];
      const timeSpent = Date.now() - startTime;
      setTimerRunning(false);

      // 正解判定
      const correctChoices = question.choices.filter(c => c.isCorrect).map(c => c.id);

      const isCorrect =
        selectedChoices.length === correctChoices.length &&
        selectedChoices.every(id => correctChoices.includes(id));

      // 結果の記録
      const result = {
        examId,
        questionId: question.id,
        isCorrect,
        timeSpent,
        timestamp: Date.now(),
      };

      await progressStore.addAnswerHistory(result);
      if (!isCorrect) {
        await progressStore.addWrongAnswer(examId, question.id);
      }

      setResults([...results, result]);
      setShowResult(true);

      // 3秒後に次の問題へ
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setStartTime(Date.now());
          setTimerRunning(true);
          setShowResult(false);
        } else {
          // 全問終了
          navigation.replace('Result', {
            examId,
            results: [...results, result],
          });
        }
      }, 3000);
    },
    [currentIndex, questions, startTime, results],
  );

  // モード選択完了
  const handleModeSelect = useCallback((selectedMode, selectedGenre, isOrdered) => {
    navigation.setParams({
      mode: selectedMode,
      genre: selectedGenre,
      ordered: isOrdered,
    });
    setShowModeSelect(false);
  }, []);

  if (showModeSelect) {
    return (
      <QuestionModeSelect
        exam={currentExam}
        onSelect={handleModeSelect}
        onCancel={() => navigation.goBack()}
      />
    );
  }

  return (
    <ScreenContainer>
      <Header
        title={currentExam?.name || '問題'}
        leftIcon="close"
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <View style={styles.timerContainer}>
          <TimerDisplay startTime={startTime} running={timerRunning} />
        </View>

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent}>
          {questions[currentIndex] && (
            <QuestionCard
              question={questions[currentIndex]}
              onAnswer={handleAnswer}
              showResult={showResult}
            />
          )}

          {showResult && results[currentIndex] && (
            <ResultCard
              correct={results[currentIndex].isCorrect}
              timeSpent={results[currentIndex].timeSpent}
            />
          )}
        </ScrollView>

        <View style={styles.progress}>
          <Title>
            {currentIndex + 1} / {questions.length}
          </Title>
        </View>
      </View>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 80,
    flexGrow: 1,
  },
  timerContainer: {
    position: 'absolute',
    top: -70,
    right: 15,
    zIndex: 1,
  },
  progress: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 4,
  },
});

export default withStores(QuestionScreen);
