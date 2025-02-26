import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import CustomFAB from '../../components/ui/CustomFAB';
import ListItem from '../../components/ui/ListItem';
import { useStores } from '../../stores';
import ExamFormModal from './ExamFormModal';

/**
 * 試験管理画面
 */
const ExamScreen = observer(({ navigation }) => {
  const { examStore } = useStores();
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // 編集ボタンのハンドラ
  const handleEdit = useCallback(exam => {
    setSelectedExam(exam);
    setShowFormModal(true);
  }, []);

  // 削除ボタンのハンドラ
  const handleDelete = useCallback(exam => {
    setSelectedExam(exam);
    setShowDeleteDialog(true);
  }, []);

  // 削除の確認
  const handleConfirmDelete = useCallback(async () => {
    if (selectedExam) {
      await examStore.deleteExam(selectedExam.id);
      setShowDeleteDialog(false);
      setSelectedExam(null);
    }
  }, [selectedExam, examStore]);

  // フォームモーダルの保存
  const handleSave = useCallback(
    async examData => {
      if (selectedExam) {
        await examStore.updateExam({
          ...selectedExam,
          ...examData,
        });
      } else {
        await examStore.addExam(examData);
      }
      setShowFormModal(false);
      setSelectedExam(null);
    },
    [selectedExam, examStore],
  );

  return (
    <ScreenContainer>
      <Header title="試験管理" leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {examStore.exams.map(exam => (
          <ListItem
            key={exam.id}
            title={exam.name}
            description={exam.detail}
            rightIcons={[
              {
                icon: 'pencil',
                onPress: () => handleEdit(exam),
              },
              {
                icon: 'delete',
                onPress: () => handleDelete(exam),
              },
            ]}
          />
        ))}
      </ScrollView>

      <CustomFAB
        icon="plus"
        onPress={() => {
          setSelectedExam(null);
          setShowFormModal(true);
        }}
      />

      <ExamFormModal
        visible={showFormModal}
        exam={selectedExam}
        onSave={handleSave}
        onClose={() => {
          setShowFormModal(false);
          setSelectedExam(null);
        }}
      />

      <ConfirmDialog
        visible={showDeleteDialog}
        title="試験の削除"
        message="この試験を削除してもよろしいですか？"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedExam(null);
        }}
      />
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
});

export default ExamScreen;
