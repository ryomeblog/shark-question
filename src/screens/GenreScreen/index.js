import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import Header from '../../components/layout/Header';
import ScreenContainer from '../../components/layout/ScreenContainer';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import CustomFAB from '../../components/ui/CustomFAB';
import ListItem from '../../components/ui/ListItem';
import { useStores } from '../../stores';
import GenreFormModal from './GenreFormModal';

/**
 * ジャンル管理画面
 */
const GenreScreen = observer(({ navigation, route }) => {
  const { examStore } = useStores();
  const [selectedExamId, setSelectedExamId] = useState(route.params?.examId);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  // 選択中の試験
  const currentExam = examStore.exams.find(exam => exam.id === selectedExamId);

  // 試験選択用のドロップダウンデータ
  const examDropdownData = examStore.exams.map(exam => ({
    label: exam.name,
    value: exam.id,
  }));

  // 編集ボタンのハンドラ
  const handleEdit = useCallback(genre => {
    setSelectedGenre(genre);
    setShowFormModal(true);
  }, []);

  // 削除ボタンのハンドラ
  const handleDelete = useCallback(genre => {
    setSelectedGenre(genre);
    setShowDeleteDialog(true);
  }, []);

  // 削除の確認
  const handleConfirmDelete = useCallback(async () => {
    if (selectedGenre && currentExam) {
      const updatedExam = {
        ...currentExam,
        genres: currentExam.genres.filter(g => g.id !== selectedGenre.id),
      };
      await examStore.updateExam(updatedExam);
      setShowDeleteDialog(false);
      setSelectedGenre(null);
    }
  }, [selectedGenre, currentExam, examStore]);

  // フォームモーダルの保存
  const handleSave = useCallback(
    async genreData => {
      if (!currentExam) return;

      if (selectedGenre) {
        const updatedExam = {
          ...currentExam,
          genres: currentExam.genres.map(g =>
            g.id === selectedGenre.id ? { ...g, ...genreData } : g,
          ),
        };
        await examStore.updateExam(updatedExam);
      } else {
        await examStore.addGenre(currentExam.id, genreData);
      }
      setShowFormModal(false);
      setSelectedGenre(null);
    },
    [selectedGenre, currentExam, examStore],
  );

  return (
    <ScreenContainer>
      <Header title="ジャンル管理" leftIcon="arrow-left" onLeftPress={() => navigation.goBack()} />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Dropdown
          data={examDropdownData}
          labelField="label"
          valueField="value"
          value={selectedExamId}
          onChange={item => setSelectedExamId(item.value)}
          placeholder="試験を選択してください"
          style={styles.dropdown}
        />

        {currentExam?.genres.map(genre => (
          <ListItem
            key={genre.id}
            title={genre.name}
            rightIcons={[
              {
                icon: 'pencil',
                onPress: () => handleEdit(genre),
              },
              {
                icon: 'delete',
                onPress: () => handleDelete(genre),
              },
            ]}
          />
        ))}
      </ScrollView>

      <CustomFAB
        icon="plus"
        onPress={() => {
          if (currentExam) {
            setSelectedGenre(null);
            setShowFormModal(true);
          }
        }}
        disabled={!currentExam}
      />

      <GenreFormModal
        visible={showFormModal}
        genre={selectedGenre}
        onSave={handleSave}
        onClose={() => {
          setShowFormModal(false);
          setSelectedGenre(null);
        }}
      />

      <ConfirmDialog
        visible={showDeleteDialog}
        title="ジャンルの削除"
        message="このジャンルを削除してもよろしいですか？"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedGenre(null);
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
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});

export default GenreScreen;
