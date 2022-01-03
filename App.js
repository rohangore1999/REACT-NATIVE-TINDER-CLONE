import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from './hooks/useAuth';
import StackNavigator from './StackNavigator';

// to hide the warnings
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      {/* AuthProvider is the Context API >>> High Order Components */}
      {/* it is wrapping the its child components so that parent inject all the auth to children */}
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({})
