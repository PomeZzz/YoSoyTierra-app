import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert, FlatList, ActivityIndicator, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingScreen from './LoadingScreen'; // Importa el componente de pantalla de carga
import { db } from '../config/FireBaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';



const Cart = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);

      try {
        const cartRef = doc(db, 'cart', '123'); // Modifica 'user_cart' con el ID del usuario actual
        const cartSnap = await getDoc(cartRef);

        if (cartSnap.exists()) {
          const cartData = cartSnap.data().items || [];

          // Cargar detalles de los productos desde 'Sliders'
          const fetchedItems = await Promise.all(
            cartData.map(async (cartItem) => {
              const productRef = doc(db, 'Sliders', cartItem.productId);
              const productSnap = await getDoc(productRef);
              if (productSnap.exists()) {
                return { ...productSnap.data(), quantity: cartItem.quantity };
              }
            })
          );

          setItems(fetchedItems);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        Alert.alert('Error', 'Hubo un problema al obtener los productos del carrito.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleDelete = async (index) => {
    setIsLoading(true);

    try {
      const cartRef = doc(db, 'cart', '123'); // Modifica 'user_cart' con el ID del usuario actual
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const currentCart = cartSnap.data().items || [];
        currentCart.splice(index, 1); // Eliminar el producto del carrito
        await setDoc(cartRef, { items: currentCart });
        setItems(currentCart); // Actualizar el estado del carrito
      }

      Alert.alert('Éxito', 'El producto fue eliminado exitosamente.');
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
      Alert.alert('Error', 'Hubo un problema al eliminar el producto del carrito.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Text>Carrito de Compras</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View>
              <Text>{item.name} - Cantidad: {item.quantity}</Text>
              <Button title="Eliminar" onPress={() => handleDelete(index)} />
            </View>
          )}
        />
      )}
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
