import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// スクリーンをインポート
import ExamScreen from "../screens/ExamScreen";
import ExamSelectScreen from "../screens/ExamSelectScreen";
import ExportImportScreen from "../screens/ExportImportScreen";
import GenreScreen from "../screens/GenreScreen";
import HomeScreen from "../screens/HomeScreen";
import QuestionAddScreen from "../screens/QuestionAddScreen";
import QuestionScreen from "../screens/QuestionScreen";
import ResultScreen from "../screens/ResultScreen";

const Stack = createNativeStackNavigator();

/**
 * アプリケーションのメインナビゲーター
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Exam" component={ExamScreen} />

        <Stack.Screen name="ExamSelect" component={ExamSelectScreen} />

        <Stack.Screen name="Genre" component={GenreScreen} />

        <Stack.Screen name="QuestionAdd" component={QuestionAddScreen} />

        <Stack.Screen
          name="Question"
          component={QuestionScreen}
          options={{
            animation: "fade",
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{
            animation: "fade",
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="ExportImport"
          component={ExportImportScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
