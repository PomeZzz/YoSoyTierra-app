import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Para la navegación

export default function RegisterScreen() {
  const navigation = useNavigation(); // Hook para la navegación

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
  {/*      <Text style={styles.backText}>asd</Text>  Este es un simple botón de retroceso */}
      </TouchableOpacity>

      <Text style={styles.title}>Registro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#B6A99A"
      />

      <TextInput
        style={styles.input}
        placeholder="hey@gmail.com"
        placeholderTextColor="#B6A99A"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Introduce tu contraseña"
        placeholderTextColor="#B6A99A"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        placeholderTextColor="#B6A99A"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Crear Cuenta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
          ¿Ya tienes cuenta? <Text style={styles.loginLink}>Inicia Sesión</Text>
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginLeft: 10,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 30,
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
  loginText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  loginLink: {
    color: '#B6A99A',
    fontWeight: 'bold',
  },
});
