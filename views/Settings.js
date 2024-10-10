import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/FireBaseConfig'; // Asegúrate de importar 'auth' correctamente
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(true); // Default oscuro

  // Recuperar el estado de dark mode desde AsyncStorage al cargar la vista
  useEffect(() => {
    const getDarkModePreference = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem('darkMode');
        if (savedDarkMode !== null) {
          setDarkModeEnabled(JSON.parse(savedDarkMode)); // Convertir a booleano
        }
      } catch (error) {
        console.error('Error al recuperar el modo oscuro/claro: ', error);
      }
    };

    getDarkModePreference(); // Llamar a la función para recuperar el valor al montar el componente
  }, []);

  const handleContactUs = () => {
    const phoneNumber = '+542944693478'; // Reemplaza con el número de teléfono deseado
    const url = `https://wa.me/${phoneNumber}?text=Necesito Asesoramiento`;

    Linking.openURL(url).catch((err) => console.error('Error al abrir WhatsApp', err));
  };

  const handleInstagram = () => {
    const url = `https://www.instagram.com/yosoytierra_patagonia/`;

    Linking.openURL(url).catch((err) => console.error('Error al abrir Instagram', err));
  };

  // Función para cerrar sesión utilizando auth de Firebase
  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        Alert.alert('Cierre de sesión', 'Has cerrado sesión correctamente');
        navigation.replace('Login'); // Redirige al usuario a la pantalla de inicio de sesión
      })
      .catch((error) => {
        console.error('Error al cerrar sesión: ', error);
        Alert.alert('Error', 'No se pudo cerrar la sesión. Inténtalo de nuevo.');
      });
  };

  // Manejar el cambio de modo claro/oscuro y guardar en AsyncStorage
  const toggleDarkMode = async (value) => {
    try {
      setDarkModeEnabled(value);
      await AsyncStorage.setItem('darkMode', JSON.stringify(value)); // Guardar valor como string
    } catch (error) {
      console.error('Error al guardar el modo oscuro/claro: ', error);
    }
  };

  // Estilos dinámicos basados en el modo claro/oscuro
  const dynamicStyles = darkModeEnabled ? styles.darkMode : styles.lightMode;

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ScrollView>
        {/* Sección de Cuenta */}
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Cuenta</Text>
          <TouchableOpacity style={[styles.optionButton, dynamicStyles.optionButton]} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="person-circle-outline" size={24} color={darkModeEnabled ? "#8B6A60" : "#000"} />
            <Text style={dynamicStyles.optionText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Sección de Preferencias */}
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Preferencias</Text>
          <View style={[styles.optionButton, dynamicStyles.optionButton]}>
            <Ionicons name="notifications-outline" size={24} color={darkModeEnabled ? "#8B6A60" : "#000"} />
            <Text style={dynamicStyles.optionText}>Notificaciones</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => setNotificationsEnabled(value)}
              thumbColor={notificationsEnabled ? "#8B6A60" : "#aaa"}
            />
          </View>
          <View style={[styles.optionButton, dynamicStyles.optionButton]}>
            <Ionicons name="moon-outline" size={24} color={darkModeEnabled ? "#8B6A60" : "#000"} />
            <Text style={dynamicStyles.optionText}>{darkModeEnabled ? 'Modo Claro' : 'Modo Oscuro'}</Text>
            <Switch
              value={!darkModeEnabled} // Invertir para que al estar apagado sea oscuro
              onValueChange={(value) => toggleDarkMode(!darkModeEnabled)}
              thumbColor={!darkModeEnabled ? "#8B6A60" : "#aaa"}
            />
          </View>
        </View>

        {/* Sección de Soporte */}
        <View style={styles.section}>
          <Text style={dynamicStyles.sectionTitle}>Soporte</Text>
          <TouchableOpacity style={[styles.optionButton, dynamicStyles.optionButton]} onPress={handleContactUs}>
            <Ionicons name="chatbubble-outline" size={24} color={darkModeEnabled ? "#8B6A60" : "#000"} />
            <Text style={dynamicStyles.optionText}>Contáctanos - WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionButton, dynamicStyles.optionButton]} onPress={handleInstagram}>
            <Ionicons name="logo-instagram" size={24} color={darkModeEnabled ? "#8B6A60" : "#000"} />
            <Text style={dynamicStyles.optionText}>Contáctanos - Instagram</Text>
          </TouchableOpacity>
        </View>

        {/* Sección de Cierre de Sesión */}
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <TouchableOpacity style={[styles.optionButton, dynamicStyles.optionButton]} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color={darkModeEnabled ? "#8B6A60" : "red"} />
            <Text style={[dynamicStyles.optionText, { color: 'red' }]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Estilos para modo claro y oscuro
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  // Estilos de modo oscuro
  darkMode: {
    container: {
      backgroundColor: '#2D2D2D',
    },
    sectionTitle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    optionText: {
      color: '#fff',
      fontSize: 16,
      marginLeft: 15,
      flex: 1,
    },
    optionButton: {
      backgroundColor: '#3C3C3C', // Fondo oscuro para los botones en modo oscuro
    },
  },
  // Estilos de modo claro
  lightMode: {
    container: {
      backgroundColor: '#fff',
    },
    sectionTitle: {
      color: '#000',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    optionText: {
      color: '#000',
      fontSize: 16,
      marginLeft: 15,
      flex: 1,
    },
    optionButton: {
      backgroundColor: '#E0E0E0', // Fondo claro para los botones en modo claro
    },
  },
});

export default Settings;
