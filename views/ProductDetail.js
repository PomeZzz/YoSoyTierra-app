import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { db } from '../config/FireBaseConfig';
import { getAuth } from 'firebase/auth'; 
import LoadingScreen from './LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para manejar el almacenamiento del modo oscuro

const ProductDetail = ({ route, navigation }) => {
  const { productId } = route.params; 
  const [product, setProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true); 
  const [darkModeEnabled, setDarkModeEnabled] = useState(true); // Estado para el modo oscuro
  const maxQuantity = 10;
  const auth = getAuth(); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'Sliders', productId); 
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct(productSnap.data()); 
        } else {
          Alert.alert('Error', 'Producto no encontrado');
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        Alert.alert('Error', 'Hubo un problema al obtener los detalles del producto');
      } finally {
        setIsLoading(false); 
      }
    };

    fetchProduct();
  }, [productId]);

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

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      const user = auth.currentUser; 
      if (!user) {
        Alert.alert('Error', 'Debes iniciar sesión para agregar productos al carrito.');
        setIsLoading(false);
        return;
      }

      const uid = user.uid; 

      const cartRef = doc(db, 'cart', uid); 
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const existingCart = cartSnap.data().items || [];
        const newCart = [...existingCart, { productId, quantity: selectedQuantity }];
        await setDoc(cartRef, { items: newCart });
      } else {
        await setDoc(cartRef, { items: [{ productId, quantity: selectedQuantity }] });
      }

      Alert.alert('Éxito', 'Producto agregado al carrito exitosamente.');
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      Alert.alert('Error', 'Hubo un problema al agregar el producto al carrito.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Cargando detalles del producto..." />;
  }

  if (!product) {
    return null;
  }

  return (
    <View style={[styles.container, darkModeEnabled ? styles.darkContainer : styles.lightContainer]}>
      <Image
        source={{ uri: product.imageUrl }} 
        style={styles.productImage}
      />
      <View style={styles.backAndCartContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={[styles.detailsContainer, darkModeEnabled ? styles.darkDetailsContainer : styles.lightDetailsContainer]}>
        <Text style={[styles.productName, darkModeEnabled ? styles.darkText : styles.lightText]}>{product.name}</Text>
        <Text style={[styles.productDescription, darkModeEnabled ? styles.darkText : styles.lightText]}>{product.description}</Text>
        <Text style={[styles.sectionTitle, darkModeEnabled ? styles.darkText : styles.lightText]}>Cantidad</Text>
        <View style={styles.quantityContainer}>
          {[...Array(maxQuantity)].map((_, index) => (
            <TouchableOpacity
              key={index + 1}
              style={[
                styles.quantityButton,
                selectedQuantity === index + 1 && styles.selectedQuantityButton,
                darkModeEnabled ? styles.darkQuantityButton : styles.lightQuantityButton
              ]}
              onPress={() => setSelectedQuantity(index + 1)}
            >
              <Text
                style={[
                  styles.quantityText,
                  selectedQuantity === index + 1 && styles.selectedQuantityText,
                  darkModeEnabled ? styles.darkText : styles.lightText
                ]}
              >
                {index + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.productInfo, darkModeEnabled ? styles.darkText : styles.lightText]}>
          {product.about}
        </Text>
        <Text style={[styles.totalPrice, darkModeEnabled ? styles.darkText : styles.lightText]}>
          Precio Total: ${product.price * selectedQuantity}
        </Text>
        <TouchableOpacity style={[styles.addToCartButton, darkModeEnabled ? styles.darkCartButton : styles.lightCartButton]} onPress={handleAddToCart}>
          <Text style={darkModeEnabled ? styles.darkCartText : styles.lightCartText}>Agregar al Carrito</Text>
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
    backgroundColor: '#1B1B1B',
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  productImage: {
    width: '100%',
    height: 300,
  },
  backAndCartContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
  },
  detailsContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, 
  },
  darkDetailsContainer: {
    backgroundColor: '#2D2D2D',
  },
  lightDetailsContainer: {
    backgroundColor: '#F5F5F5',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  productDescription: {
    marginTop: 5,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  darkQuantityButton: {
    backgroundColor: '#3C3C3C',
  },
  lightQuantityButton: {
    backgroundColor: '#E6E6E6',
  },
  selectedQuantityButton: {
    backgroundColor: '#8B6A60',
  },
  quantityText: {
    color: '#fff',
  },
  selectedQuantityText: {
    fontWeight: 'bold',
  },
  productInfo: {
    marginTop: 10,
    lineHeight: 20,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  addToCartButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  darkCartButton: {
    backgroundColor: '#8B6A60',
  },
  lightCartButton: {
    backgroundColor: '#F0F0F0',
  },
  darkCartText: {
    color: '#FFFFFF',
  },
  lightCartText: {
    color: '#333333',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#333333',
  },
});

export default ProductDetail;
