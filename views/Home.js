import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/FireBaseConfig';

const Home = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Popular'); // Pestaña por defecto
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  // Cargar las categorías desde Firestore
  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    const snapshot = await getDocs(collection(db, 'Categorias'));
    const categories = [];
    snapshot.forEach((doc) => {
      categories.push(doc.data()); // Almacenar el campo name de cada categoría
    });
    setCategoryList(categories);
  };

  // Función para cargar sliders de una categoría específica
  const GetSliders = async (category) => {
    const q = query(collection(db, 'Sliders'), where('category', '==', category)); // Filtrar sliders por categoría
    const snapshot = await getDocs(q);
    const sliders = [];
    snapshot.forEach((doc) => {
      sliders.push(doc.data());
    });
    setSliderList(sliders);
  };

  // Cargar sliders según la categoría seleccionada
  useEffect(() => {
    GetSliders(selectedTab); // Filtrar sliders por la categoría seleccionada
  }, [selectedTab]);

  // Renderizar el contenido de los productos
  const renderContent = () => {
    return (
      <View style={styles.products}>
        {sliderList.map((item, index) => (
          <View key={index} style={styles.productCard}>
            <Image
              style={styles.productImage}
              source={{ uri: item.imageUrl }} // item.imageUrl es la URL de la imagen en Firestore
            />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDesc}>{item.description}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            >
              <Text>🛒</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Image style={styles.headerImage} source={require('../assets/banner.jpeg')} />
      </View>

      {/* Renderizado del menú dinámico */}
      <View style={styles.menu}>
        {categoryList.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuButton, selectedTab === category.name && styles.activeButton]}
            onPress={() => setSelectedTab(category.name)} // Cambia la categoría al presionar
          >
            <Text style={styles.menuText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderContent()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2D2D',
  },
  header: {
    height: 240,
    backgroundColor: '#333',
    position: 'relative',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 50,
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: '#E6E6E6',
    padding: 10,
    borderRadius: 10,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#2D2D2D',
  },
  menuButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#8B6A60',
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#2D2C2B',
    borderWidth: 1,
    borderColor: '#8B6A60',
  },
  menuText: {
    color: '#fff',
  },
  products: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  productCard: {
    width: '45%',
    backgroundColor: '#3C3C3C',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  productName: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
  },
  productDesc: {
    color: '#aaa',
    marginTop: 5,
  },
  productPrice: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 5,
  },
  cartButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#8B6A60',
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default Home;
