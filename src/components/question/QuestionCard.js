import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Paragraph, Title } from 'react-native-paper';

/**
 * 問題カードコンポーネント
 * @param {Object} props
 * @param {Object} props.question - 問題データ
 * @param {Function} props.onAnswer - 回答時の処理
 * @param {boolean} props.showResult - 結果を表示するかどうか
 */
const QuestionCard = ({ question, onAnswer, showResult = false }) => {
  const [selectedChoices, setSelectedChoices] = useState([]);

  const handleChoicePress = choiceId => {
    setSelectedChoices(prev => {
      const isSelected = prev.includes(choiceId);
      if (isSelected) {
        return prev.filter(id => id !== choiceId);
      } else {
        return [...prev, choiceId];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedChoices.length > 0) {
      onAnswer(selectedChoices);
      setSelectedChoices([]);
    }
  };

  const getChoiceStyle = choice => {
    if (!showResult) {
      return selectedChoices.includes(choice.id) ? styles.selectedChoice : {};
    }

    if (choice.isCorrect) {
      return styles.correctChoice;
    }

    return selectedChoices.includes(choice.id) ? styles.incorrectChoice : {};
  };

  const renderChoice = choice => (
    <View key={choice.id} style={styles.choiceWrapper}>
      <Button
        mode="outlined"
        onPress={() => handleChoicePress(choice.id)}
        style={[styles.choice, getChoiceStyle(choice)]}
        disabled={showResult}
        contentStyle={styles.choiceContent}
      >
        <View style={styles.choiceInner}>
          <Text style={styles.choiceText} ellipsizeMode="clip" numberOfLines={0}>
            {choice.choice}
          </Text>
        </View>
      </Button>
    </View>
  );

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.questionHeader}>
          <Title style={styles.questionTitle}>{question.question}</Title>
          <Paragraph style={styles.genre}>ジャンル: {question.genre}</Paragraph>
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.choices}>{question.choices.map(renderChoice)}</View>
        </ScrollView>
      </Card.Content>
      {!showResult && (
        <Card.Actions style={styles.actions}>
          <Button mode="contained" onPress={handleSubmit} disabled={selectedChoices.length === 0}>
            回答する
          </Button>
        </Card.Actions>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    elevation: 4,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  cardContent: {
    flex: 1,
    paddingBottom: 0,
  },
  questionHeader: {
    paddingBottom: 16,
  },
  questionTitle: {
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  genre: {
    marginTop: 4,
    color: '#000000',
  },
  choices: {
    marginTop: 16,
    paddingBottom: 16,
  },
  choiceWrapper: {
    marginVertical: 8,
  },
  choice: {
    minHeight: 48,
    borderRadius: 8,
  },
  choiceContent: {
    height: 'auto',
    minHeight: 48,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  choiceInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
  choiceText: {
    flex: 1,
    textAlign: 'left',
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
  },
  selectedChoice: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  correctChoice: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  incorrectChoice: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  actions: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 'auto',
  },
});

export default QuestionCard;
