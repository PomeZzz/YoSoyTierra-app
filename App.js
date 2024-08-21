import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './views/Login';  // Vista de inicio de sesión
import RegisterScreen from './views/Register';  // Vista de registro

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
  <Stack.Screen 
    name="Login" 
    component={LoginScreen} 
    options={{ headerShown: false }}
  />
  <Stack.Screen 
    name="Register" 
    component={RegisterScreen} 
    options={{ headerShown: false }}
  />
</Stack.Navigator>

    </NavigationContainer>
  );
}