import 'react-native-gesture-handler';
import React from "react";
import MyNavigation from "./src/MyNavigation";
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native';

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1  }}>
        <MyNavigation />
      </SafeAreaView>
    </PaperProvider>
  ); 
}