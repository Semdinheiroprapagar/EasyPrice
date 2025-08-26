import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import {
  LoginScreen,
  ProductFormScreen,
  SavedProductsScreen,
  CalculationsScreen,
} from '../screens';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  ProductForm: { productId?: string };
};

export type MainTabParamList = {
  Products: undefined;
  AddProduct: undefined;
  Calculations: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const { currentTheme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Products') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'AddProduct') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Calculations') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: currentTheme.colors.primary,
        tabBarInactiveTintColor: currentTheme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: currentTheme.colors.card,
          borderTopColor: currentTheme.colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: currentTheme.colors.background,
          borderBottomColor: currentTheme.colors.border,
        },
        headerTintColor: currentTheme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
        },
      })}
    >
      <Tab.Screen 
        name="Products" 
        component={SavedProductsScreen}
        options={{ title: 'Produtos' }}
      />
      <Tab.Screen 
        name="AddProduct" 
        component={ProductFormScreen}
        options={{ title: 'Adicionar' }}
      />
      <Tab.Screen 
        name="Calculations" 
        component={CalculationsScreen}
        options={{ title: 'Cálculos' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Config.' }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { currentTheme } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: currentTheme === currentTheme,
        colors: {
          primary: currentTheme.colors.primary,
          background: currentTheme.colors.background,
          card: currentTheme.colors.card,
          text: currentTheme.colors.text,
          border: currentTheme.colors.border,
          notification: currentTheme.colors.accent,
        },
      }}
    >
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: currentTheme.colors.background,
            borderBottomColor: currentTheme.colors.border,
          },
          headerTintColor: currentTheme.colors.text,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17,
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ProductForm" 
          component={ProductFormScreen}
          options={{ 
            title: 'Cadastro de Produto',
            presentation: 'modal'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};