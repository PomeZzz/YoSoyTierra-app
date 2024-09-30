import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Añadido 'setDoc' para guardar en Firestore
import { db } from '../config/FireBaseConfig';
import LoadingScreen from './LoadingScreen';

const ProductDetail = ({ route, navigation }) => {
  const { productId } = route.params; // Obtener productId de los parámetros de navegación
  const [product, setProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la pantalla de carga
  const maxQuantity = 10;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'Sliders', productId); // Referencia al documento de Firestore
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct(productSnap.data()); // Almacenar los datos del producto
        } else {
          Alert.alert('Error', 'Producto no encontrado');
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        Alert.alert('Error', 'Hubo un problema al obtener los detalles del producto');
      } finally {
        setIsLoading(false); // Ocultar pantalla de carga cuando los datos se hayan cargado
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      // Referencia a la colección 'Cart' con un ID de usuario simulado, puedes usar un ID dinámico
      const cartRef = doc(db, 'cart', '123'); // Modifica 'user_cart' con el ID del usuario actual
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        // Si el carrito ya existe, actualiza los productos
        const existingCart = cartSnap.data().items || [];
        const newCart = [...existingCart, { productId, quantity: selectedQuantity }];
        await setDoc(cartRef, { items: newCart });
      } else {
        // Si no existe el carrito, lo crea con el primer producto
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
    <View style={styles.container}>
      <Image
        source={{ uri: product.imageUrl }} // Usar la URL de la imagen del producto
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
      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <Text style={styles.sectionTitle}>Cantidad</Text>
        <View style={styles.quantityContainer}>
          {[...Array(maxQuantity)].map((_, index) => (
            <TouchableOpacity
              key={index + 1}
              style={[
                styles.quantityButton,
                selectedQuantity === index + 1 && styles.selectedQuantityButton,
              ]}
              onPress={() => setSelectedQuantity(index + 1)}
            >
              <Text
                style={[
                  styles.quantityText,
                  selectedQuantity === index + 1 && styles.selectedQuantityText,
                ]}
              >
                {index + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.productInfo}>
          {product.about}
        </Text>
        <Text style={styles.totalPrice}>Precio Total: ${product.price * selectedQuantity}</Text>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Agregar al Carro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
  },
  scrollViewContent: {
    paddingBottom: 20,
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
    backgroundColor: '#2D2D2D',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, // Para superponerlo ligeramente sobre la imagen
  },
  productName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  productDescription: {
    color: '#aaa',
    marginTop: 5,
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#fff',
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
    backgroundColor: '#3C3C3C',
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
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
    color: '#aaa',
    marginTop: 10,
    lineHeight: 20,
  },
  totalPrice: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  addToCartButton: {
    backgroundColor: '#8B6A60',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProductDetail;
