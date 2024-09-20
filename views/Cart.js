import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingScreen from './LoadingScreen'; // Importa el componente de pantalla de carga
import { db } from '../config/FireBaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';



const Cart = ({ navigation, user }) => {
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]); // Estado para manejar los ítems del carrito
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la pantalla de carga
  
  
  
  const handleDelete = (index) => {
    setIsLoading(true); // Mostrar pantalla de carga

    setTimeout(() => {
      const newItems = [...items];
      newItems.splice(index, 1); // Eliminar el elemento del carrito
      setItems(newItems);
      setIsLoading(false); // Ocultar pantalla de carga
      Alert.alert('Éxito', 'El elemento fue eliminado exitosamente.');
    }, 2000); // Simula un retraso en el proceso de eliminación
  };

  if (isLoading) {
    return <LoadingScreen message="Eliminando elemento..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {items.map((item, index) => (
          <View key={index} style={styles.cartItem}>
            <Image style={styles.productImage} source={require('../assets/hialuronico.png')} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>Serum Facial</Text>
              <Text style={styles.productPrice}>$250.00</Text>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Cantidad:</Text>
                <Text style={styles.quantity}>1</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalPrice}>$250.00</Text>
        </View>
        <TouchableOpacity style={styles.purchaseButton}>
          <Text style={styles.purchaseButtonText}>Realizar Compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2D2D',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 120, // Espacio para que el contenido no quede oculto bajo el botón fijo
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#3C3C3C',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productPrice: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityLabel: {
    color: '#aaa',
  },
  quantity: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: '#8B6A60',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2D2D2D',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#555',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  totalText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  totalPrice: {
    color: '#fff',
    fontWeight: 'bold',
  },
  purchaseButton: {
    backgroundColor: '#8B6A60',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Cart;
