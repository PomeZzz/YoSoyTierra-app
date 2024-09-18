import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/FireBaseConfig'; // Asegúrate de que auth esté correctamente configurado

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Definir el correo del administrador
  const adminEmail = "Admin@gmail.com";

  const handleLogin = () => {
    console.log("Intentando iniciar sesión con:", { email, password }); // Muestra los valores de email y password

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Inicio de sesión exitoso:", user); // Muestra el usuario autenticado

        // Verifica si el email del usuario es el del administrador
        if (email === adminEmail) {
          console.log("Redirigiendo a AdminHome.js");
          navigation.navigate('AdminHome'); // Redirige a la pantalla de administrador
        } else {
          console.log("Redirigiendo a Home.js");
          navigation.navigate('Home'); // Redirige a la pantalla de usuario normal
        }
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error); // Muestra el error si ocurre
        Alert.alert('Error de inicio de sesión', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logo.jpg')}
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
        value={email}
        onChangeText={text => setEmail(text)} // Actualiza el valor del email
      />

      <TextInput
        style={styles.input}
        placeholder="Introduce tu contraseña"
        placeholderTextColor="#B6A99A"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)} // Actualiza el valor de la contraseña
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
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
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 15,
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
    fontWeight: 'bold',
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
