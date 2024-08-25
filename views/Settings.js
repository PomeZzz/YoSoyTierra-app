import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Settings = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  
  const handleContactUs = () => {
    const phoneNumber = '+542944693478'; // Reemplaza con el número de teléfono deseado
    const url = `https://wa.me/${phoneNumber}?text=Necesito Asesoramiento`;
    
    Linking.openURL(url).catch((err) => console.error('Error al abrir WhatsApp', err));
  };

  const handleInstagram = () => {
    const url = `https://www.instagram.com/yosoytierra_patagonia/`;
    
    Linking.openURL(url).catch((err) => console.error('Error al abrir Instagram', err));
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Sección de Cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="person-circle-outline" size={24} color="#8B6A60" />
            <Text style={styles.optionText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Sección de Preferencias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          <View style={styles.optionButton}>
            <Ionicons name="notifications-outline" size={24} color="#8B6A60" />
            <Text style={styles.optionText}>Notificaciones</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => setNotificationsEnabled(value)}
              thumbColor={notificationsEnabled ? "#8B6A60" : "#aaa"}
            />
          </View>
          <View style={styles.optionButton}>
            <Ionicons name="moon-outline" size={24} color="#8B6A60" />
            <Text style={styles.optionText}>Modo Oscuro</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={(value) => setDarkModeEnabled(value)}
              thumbColor={darkModeEnabled ? "#8B6A60" : "#aaa"}
            />
          </View>
        </View>

        {/* Sección de Soporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>
          <TouchableOpacity style={styles.optionButton} onPress={handleContactUs}>
            <Ionicons name="chatbubble-outline" size={24} color="#8B6A60" />
            <Text style={styles.optionText}>Contáctanos - WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={handleInstagram}>
            <Ionicons name="logo-instagram" size={24} color="#8B6A60" />
            <Text style={styles.optionText}>Contáctanos - Instagram</Text>
          </TouchableOpacity>
        </View>

        {/* Sección de Legal */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity style={styles.optionButton} onPress={() => {}}>
            <Ionicons name="document-text-outline" size={24} color="#8B6A60" />
            <Text style={styles.optionText}>Términos de Servicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => {}}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#8B6A60" />
            <Text style={styles.optionText}>Política de Privacidad</Text>
          </TouchableOpacity>
        </View> */}

        {/* Sección de Cierre de Sesión */}
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <TouchableOpacity style={styles.optionButton} onPress={() => {}}>
            <Ionicons name="log-out-outline" size={24} color="#8B6A60" />
            <Text style={[styles.optionText, { color: 'red' }]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2D2D',
    paddingTop: 40,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#3C3C3C',
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
});

export default Settings;
