import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/Dashboard';
import ChatsListScreen from '../screens/ChatsList';
import ProfileScreen from '../screens/Profile';
import DatesScreen from '../screens/Dates';
import SettingsScreen from '../screens/Settings';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme } from '../styles/theme';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.lightGray,
        tabBarStyle: { 
          backgroundColor: theme.colors.white, 
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: theme.layout.tabBarHeight,
          paddingBottom: 8,
          paddingTop: 8,
          ...theme.shadows.sm,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'circle';
          switch (route.name) {
            case 'Home':
              iconName = 'grid';
              break;
            case 'Chats':
              iconName = 'message-circle';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            case 'Dates':
              iconName = 'calendar';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Chats" component={ChatsListScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Home" component={DashboardScreen} options={{ title: 'Dashboard', headerShown: false }} />
      <Tab.Screen name="Dates" component={DatesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
} 