import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './views/Login';  // Vista de inicio de sesión
import RegisterScreen from './views/Register';  // Vista de registro
import HomeScreen from './views/Home';
import CartScreen from './views/Cart';  // Nueva vista de carrito de compras
import ProductDetailScreen from './views/ProductDetail';
import SettingsScreen from './views/Settings';
import EditProfileScreen from './views/EditProfile';

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
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen} 
          options={{
            title: 'Carrito de Compras',
            headerStyle: { backgroundColor: '#2D2D2D' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ headerShown: false }}
        />
         <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
