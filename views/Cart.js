import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, Alert, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../config/FireBaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true); // Por defecto, modo oscuro

  // Obtener el usuario autenticado
  const auth = getAuth();
  const user = auth.currentUser;

  // Recuperar la preferencia de modo claro/oscuro desde AsyncStorage
  useEffect(() => {
    const getDarkModePreference = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem('darkMode');
        if (savedDarkMode !== null) {
          setDarkModeEnabled(JSON.parse(savedDarkMode));
        }
      } catch (error) {
        console.error('Error al recuperar el modo oscuro/claro: ', error);
      }
    };

    getDarkModePreference();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        Alert.alert('Error', 'El usuario no está autenticado.');
        return;
      }

      setIsLoading(true);

      try {
        // Utiliza el uid del usuario autenticado para obtener su carrito único
        const cartRef = doc(db, 'cart', user.uid);
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

          // Calcular el precio total
          const total = fetchedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          setTotalPrice(total);
        } else {
          setItems([]);
          setTotalPrice(0);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        Alert.alert('Error', 'Hubo un problema al obtener los productos del carrito.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [user]);

  const handleDelete = async (index) => {
    if (!user) {
      Alert.alert('Error', 'El usuario no está autenticado.');
      return;
    }

    setIsLoading(true);

    try {
      const cartRef = doc(db, 'cart', user.uid);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const currentCart = cartSnap.data().items || [];
        currentCart.splice(index, 1); // Eliminar el producto del carrito
        await setDoc(cartRef, { items: currentCart });
        setItems(currentCart);

        const updatedItems = currentCart.map(async (cartItem) => {
          const productRef = doc(db, 'Sliders', cartItem.productId);
          const productSnap = await getDoc(productRef);
          return { ...productSnap.data(), quantity: cartItem.quantity };
        });
        const newTotal = (await Promise.all(updatedItems)).reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(newTotal);
      }

      Alert.alert('Éxito', 'El producto fue eliminado exitosamente.');
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
      Alert.alert('Error', 'Hubo un problema al eliminar el producto del carrito.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    const phoneNumber = '+542944693478'; // Reemplaza con tu número de teléfono
    const orderSummary = items.map(item => `Producto: ${item.name} - Cantidad: ${item.quantity} - Subtotal: $${item.price * item.quantity}`).join('\n');
    const message = `Hola, me gustaría realizar el siguiente pedido:\n\n${orderSummary}\n\nPrecio Total: $${totalPrice}`;
    
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Abrir WhatsApp con el mensaje preformateado
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir WhatsApp.');
    });
  };

  return (
    <View style={[styles.container, darkModeEnabled ? styles.darkContainer : styles.lightContainer]}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#8B6A60" />
      ) : (
        <FlatList
          contentContainerStyle={styles.scrollViewContent}
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={[styles.cartItem, darkModeEnabled ? styles.darkCartItem : styles.lightCartItem]}>
              <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={[styles.productName, darkModeEnabled ? styles.darkText : styles.lightText]}>{item.name}</Text>
                <Text style={[styles.productPrice, darkModeEnabled ? styles.darkText : styles.lightText]}>Cantidad: {item.quantity}</Text>
                <Text style={[styles.productPrice, darkModeEnabled ? styles.darkText : styles.lightText]}>Precio Unitario: ${item.price}</Text>
                <Text style={[styles.productPrice, darkModeEnabled ? styles.darkText : styles.lightText]}>Subtotal: ${item.price * item.quantity}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <View style={[styles.fixedButtonContainer, darkModeEnabled ? styles.darkFixedButtonContainer : styles.lightFixedButtonContainer]}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalText, darkModeEnabled ? styles.darkText : styles.lightText]}>Precio Total:</Text>
          <Text style={[styles.totalPrice, darkModeEnabled ? styles.darkText : styles.lightText]}>${totalPrice}</Text>
        </View>
        <TouchableOpacity style={styles.purchaseButton} onPress={handleCheckout}>
          <Text style={styles.purchaseButtonText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#2D2D2D',
  },
  lightContainer: {
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Espacio para que el contenido no quede oculto bajo el botón fijo
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  darkCartItem: {
    backgroundColor: '#3C3C3C',
  },
  lightCartItem: {
    backgroundColor: '#fff',
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
    fontWeight: 'bold',
  },
  productPrice: {
    marginTop: 5,
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#8B6A60',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
  },
  darkFixedButtonContainer: {
    backgroundColor: '#2D2D2D',
    borderTopColor: '#555',
  },
  lightFixedButtonContainer: {
    backgroundColor: '#fff',
    borderTopColor: '#ddd',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  totalText: {
    fontWeight: 'bold',
  },
  totalPrice: {
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
