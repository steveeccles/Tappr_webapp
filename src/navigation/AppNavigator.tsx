import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BottomTabs from './BottomTabs';
import { getCurrentUser, onAuthStateChanged } from '../services/auth';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AppProvider } from '../contexts/AppContext';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={user ? 'Main' : 'SignIn'}
          screenOptions={{
            headerShown: false,
          }}
        >
          {user ? (
            <Stack.Screen 
              name="Main" 
              component={BottomTabs} 
              options={{ 
                headerShown: false,
              }} 
            />
          ) : (
            <>
              <Stack.Screen 
                name="SignIn" 
                component={SignInScreen} 
                options={{ 
                  title: 'Sign In',
                  headerShown: false
                }} 
              />
              <Stack.Screen 
                name="SignUp" 
                component={SignUpScreen} 
                options={{ 
                  title: 'Sign Up',
                  headerShown: false
                }} 
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default AppNavigator; 