import { observer } from "mobx-react-lite";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import Header from "../../components/layout/Header";
import ScreenContainer from "../../components/layout/ScreenContainer";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import CustomFAB from "../../components/ui/CustomFAB";
import ListItem from "../../components/ui/ListItem";
import { withStores } from "../../stores";
import QuestionFormModal from "./QuestionFormModal";

/**
 * 問題追加画面
 */
const QuestionAddScreen = observer(({ navigation, route, stores }) => {
  const { examStore } = stores;
  const [selectedExamId, setSelectedExamId] = useState(route.params?.examId);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // 選択中の試験
  const currentExam = examStore.exams.find(
    (exam) => exam.id === selectedExamId,
  );

  // 試験選択用のドロップダウンデータ
  const examDropdownData = examStore.exams.map((exam) => ({
    label: exam.name,
    value: exam.id,
  }));

  // 問題画面への遷移
  const handleGoToQuestions = useCallback(async () => {
    if (currentExam) {
      await examStore.setLastExamId(currentExam.id);
      navigation.navigate("Question", {
        examId: currentExam.id,
      });
    }
  }, [currentExam, navigation, examStore]);

  // 編集ボタンのハンドラ
  const handleEdit = useCallback((question) => {
    setSelectedQuestion(question);
    setShowFormModal(true);
  }, []);

  // 削除ボタンのハンドラ
  const handleDelete = useCallback((question) => {
    setSelectedQuestion(question);
    setShowDeleteDialog(true);
  }, []);

  // 削除の確認
  const handleConfirmDelete = useCallback(async () => {
    if (selectedQuestion && currentExam) {
      const updatedExam = {
        ...currentExam,
        questions: currentExam.questions.filter(
          (q) => q.id !== selectedQuestion.id,
        ),
      };
      await examStore.updateExam(updatedExam);
      setShowDeleteDialog(false);
      setSelectedQuestion(null);
    }
  }, [selectedQuestion, currentExam, examStore]);

  // フォームモーダルの保存
  const handleSave = useCallback(
    async (questionData) => {
      if (!currentExam) return;

      if (selectedQuestion) {
        const updatedExam = {
          ...currentExam,
          questions: currentExam.questions.map((q) =>
            q.id === selectedQuestion.id ? { ...q, ...questionData } : q,
          ),
        };
        await examStore.updateExam(updatedExam);
      } else {
        await examStore.addQuestion(currentExam.id, questionData);
      }
      setShowFormModal(false);
      setSelectedQuestion(null);
    },
    [selectedQuestion, currentExam, examStore],
  );

  return (
    <ScreenContainer>
      <Header
        title="問題追加"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
        rightIcon={currentExam ? "play" : null}
        onRightPress={handleGoToQuestions}
      />

      <View style={styles.content}>
        <Dropdown
          data={examDropdownData}
          labelField="label"
          valueField="value"
          value={selectedExamId}
          onChange={(item) => setSelectedExamId(item.value)}
          placeholder="試験を選択してください"
          style={styles.dropdown}
        />

        {currentExam?.questions.map((question) => (
          <ListItem
            key={question.id}
            title={question.question}
            description={`ジャンル: ${question.genre}`}
            rightIcons={[
              {
                icon: "pencil",
                onPress: () => handleEdit(question),
              },
              {
                icon: "delete",
                onPress: () => handleDelete(question),
              },
            ]}
          />
        ))}
      </View>

      <CustomFAB
        icon="plus"
        onPress={() => {
          if (currentExam) {
            setSelectedQuestion(null);
            setShowFormModal(true);
          }
        }}
        disabled={!currentExam}
      />

      <QuestionFormModal
        visible={showFormModal}
        exam={currentExam}
        question={selectedQuestion}
        onSave={handleSave}
        onClose={() => {
          setShowFormModal(false);
          setSelectedQuestion(null);
        }}
      />

      <ConfirmDialog
        visible={showDeleteDialog}
        title="問題の削除"
        message="この問題を削除してもよろしいですか？"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedQuestion(null);
        }}
      />
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});

export default withStores(QuestionAddScreen);
