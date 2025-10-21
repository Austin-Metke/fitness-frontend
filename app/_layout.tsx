import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SQLiteProvider } from "expo-sqlite"
import { useColorScheme } from '@/hooks/useColorScheme';
//import { SessionProvider } from '@/hooks/ctx';
import { initDB } from '@/db/init';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ProgressProvider } from '@/hooks/useProgress';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style = {styles.container}>
      <SQLiteProvider databaseName='flexzone_database' onInit={initDB} >
<<<<<<< HEAD
        <ProgressProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Slot />
          </ThemeProvider>
        </ProgressProvider>
=======
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Slot />
        </ThemeProvider>
>>>>>>> parent of 405d47d (Merge pull request #7 from Austin-Metke/oauthRegistration)
      </SQLiteProvider>
    </GestureHandlerRootView>
    
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
});