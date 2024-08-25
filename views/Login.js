import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación

export default function LoginScreen() {
    const navigation = useNavigation(); // Usa el hook para obtener el objeto de navegación
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logo.jpg')} // Ruta relativa a la carpeta assets
        style={styles.logo}
      />
      <Text style={styles.title}>Inicio de sesión</Text>
      <Text style={styles.subtitle}>
        Inicia sesión con tu cuenta de <Text style={styles.boldText}>YoSoyTierra</Text>.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="hey@tumail.com"
        placeholderTextColor="#B6A99A"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Introduce tu contraseña"
        placeholderTextColor="#B6A99A"
        secureTextEntry
      />

      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.button}>
        <Text style={styles.buttonText}>Inicia Sesión</Text>
      </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>
                ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrate</Text>
            </Text>
        </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1A1A1A',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    logo: {
      width: 150, // Ajusta según la imagen real
      height: 150, // Ajusta según la imagen real
      marginBottom: 20,
      borderRadius:15,
    },
    title: {
      fontSize: 24,
      color: '#FFFFFF',
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: '#FFFFFF',
      marginBottom: 30,
      textAlign: 'center',
    },
    boldText: {
      fontWeight: 'bold', // Estilo para poner el texto en negrita
    },
    input: {
      width: '100%',
      height: 50,
      borderColor: '#B6A99A',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 20,
      color: '#FFFFFF',
      backgroundColor: '#333333',
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: '#8E5B41',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    registerText: {
      color: '#FFFFFF',
      fontSize: 14,
    },
    registerLink: {
      color: '#B6A99A',
      fontWeight: 'bold',
    },
  });