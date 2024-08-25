import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Home = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Popular');

  const renderContent = () => {
    switch (selectedTab) {
      case 'Nuevo':
        return (
          <View style={styles.products}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <View key={item} style={styles.productCard}>
                <Image
                  style={styles.productImage}
                  source={require('../assets/hialuronico.png')}
                />
                <Text style={styles.productName}>Producto Nuevo {item}</Text>
                <Text style={styles.productDesc}>Descripción del producto nuevo</Text>
                <Text style={styles.productPrice}>$300.00</Text>
                <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('ProductDetail')}><Text>🛒</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        );
      case 'Recomendado':
        return (
          <View style={styles.products}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <View key={item} style={styles.productCard}>
                <Image
                  style={styles.productImage}
                  source={require('../assets/hialuronico.png')}
                />
                <Text style={styles.productName}>Producto Recomendado {item}</Text>
                <Text style={styles.productDesc}>Descripción del producto recomendado</Text>
                <Text style={styles.productPrice}>$350.00</Text>
                <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('ProductDetail')}><Text>🛒</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        );
      case 'Popular':
      default:
        return (
          <View style={styles.products}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <View key={item} style={styles.productCard}>
                <Image
                  style={styles.productImage}
                  source={require('../assets/hialuronico.png')}
                />
                <Text style={styles.productName}>Serum Facial</Text>
                <Text style={styles.productDesc}>Lorem das dassada</Text>
                <Text style={styles.productPrice}>$250.00</Text>
                <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('ProductDetail')}><Text>🛒</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="cart-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Image
          style={styles.headerImage}
          source={require('../assets/banner.jpeg')}
        />
      </View>
      <View style={styles.menu}>
        <TouchableOpacity 
          style={[styles.menuButton, selectedTab === 'Popular' && styles.activeButton]} 
          onPress={() => setSelectedTab('Popular')}
        >
          <Text style={styles.menuText}>Popular</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuButton, selectedTab === 'Nuevo' && styles.activeButton]} 
          onPress={() => setSelectedTab('Nuevo')}
        >
          <Text style={styles.menuText}>Nuevo</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuButton, selectedTab === 'Recomendado' && styles.activeButton]} 
          onPress={() => setSelectedTab('Recomendado')}
        >
          <Text style={styles.menuText}>Recomendado</Text>
        </TouchableOpacity>
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
    height: 240, // Altura ajustada para el header completo
    backgroundColor: '#333',
    position: 'relative',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 50,  // Desplaza los botones hacia abajo
    zIndex: 10,  // Asegura que los botones estén por encima de la imagen
  },
  iconButton: {
    backgroundColor: '#E6E6E6',
    padding: 10,
    borderRadius: 10,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',  // Asegura que la imagen esté debajo de los botones
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
    borderColor: '#8B6A60'

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
