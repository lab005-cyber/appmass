import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { store } from './app/store';
import { RootNavigator } from './app/navigation/RootNavigator';
import client from './app/lib/appwrite';

export default function App() {
  useEffect(() => {
    client.ping().then(() => {
      console.log('[appmass] Appwrite connected successfully');
    }).catch((err) => {
      console.warn('[appmass] Appwrite ping failed:', err.message);
    });
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}
