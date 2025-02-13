import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Paragraph, Title } from "react-native-paper";

/**
 * 問題カードコンポーネント
 * @param {Object} props
 * @param {Object} props.question - 問題データ
 * @param {Function} props.onAnswer - 回答時の処理
 * @param {boolean} props.showResult - 結果を表示するかどうか
 */
const QuestionCard = ({ question, onAnswer, showResult = false }) => {
  const [selectedChoices, setSelectedChoices] = useState([]);

  const handleChoicePress = (choiceId) => {
    setSelectedChoices((prev) => {
      const isSelected = prev.includes(choiceId);
      if (isSelected) {
        return prev.filter((id) => id !== choiceId);
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

  const getChoiceStyle = (choice) => {
    if (!showResult) {
      return selectedChoices.includes(choice.id) ? styles.selectedChoice : {};
    }

    if (choice.isCorrect) {
      return styles.correctChoice;
    }

    return selectedChoices.includes(choice.id) ? styles.incorrectChoice : {};
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{question.question}</Title>
        <Paragraph style={styles.genre}>ジャンル: {question.genre}</Paragraph>
        <View style={styles.choices}>
          {question.choices.map((choice) => (
            <Button
              key={choice.id}
              mode="outlined"
              onPress={() => handleChoicePress(choice.id)}
              style={[styles.choice, getChoiceStyle(choice)]}
              disabled={showResult}
            >
              {choice.choice}
            </Button>
          ))}
        </View>
      </Card.Content>
      {!showResult && (
        <Card.Actions>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={selectedChoices.length === 0}
          >
            回答する
          </Button>
        </Card.Actions>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  genre: {
    marginTop: 8,
    color: "#666",
  },
  choices: {
    marginTop: 16,
  },
  choice: {
    marginVertical: 8,
    borderRadius: 8,
  },
  selectedChoice: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
  },
  correctChoice: {
    backgroundColor: "#e8f5e9",
    borderColor: "#4caf50",
  },
  incorrectChoice: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
  },
});

export default QuestionCard;
