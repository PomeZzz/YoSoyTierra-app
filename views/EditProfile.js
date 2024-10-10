import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, updatePassword, updateEmail } from 'firebase/auth'; // Importamos updateEmail
import { db } from '../config/FireBaseConfig'; // Importa la configuración de Firebase
import LoadingScreen from './LoadingScreen'; // Importa la pantalla de carga

const EditProfile = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la pantalla de carga
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        Alert.alert('Error', 'El usuario no está autenticado.');
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid); // Asume que los datos del usuario están en la colección 'users'
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setName(userData.name || '');
          setEmail(userData.email || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Hubo un problema al obtener los datos del usuario.');
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSaveChanges = async () => {
    if (password && password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true); // Muestra la pantalla de carga

    try {
      // Actualizar el nombre en Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name,
        email, // Actualiza el email en Firestore también
      });

      // Actualizar el email en Firebase Auth
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Si el usuario ingresó una nueva contraseña, actualizarla en Firebase Auth
      if (password) {
        await updatePassword(user, password);
        Alert.alert('Éxito', 'Tu perfil y contraseña han sido actualizados.');
      } else {
        Alert.alert('Éxito', 'Tu perfil ha sido actualizado.');
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert(
          'Error de seguridad',
          'Debes volver a iniciar sesión para cambiar tu correo electrónico o contraseña.'
        );
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'El correo electrónico no es válido.');
      } else if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'El correo electrónico ya está en uso.');
      } else {
        Alert.alert('Error', 'Hubo un problema al actualizar tu perfil.');
      }
    } finally {
      setIsLoading(false); // Oculta la pantalla de carga
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Guardando cambios..." />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="arrow-back-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Editar Perfil</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu nombre"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu nueva contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Confirmar Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirma tu nueva contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2D2D2D',
  },
  homeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#3C3C3C',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#8B6A60',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;
