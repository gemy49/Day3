import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, ActivityIndicator,
  TouchableOpacity, ImageBackground, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProductListScreen() {
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(5);
  const [isVertical, setIsVertical] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (append = false) => {
    setLoading(true);
    try {
      const res = await fetch(`https://dummyjson.com/products?limit=${limit}`);
      const json = await res.json();
      setProducts(append ? [...products, ...json.products] : json.products);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [limit]);

  const loadMore = () => {
    if (isVertical && !loading) {
      setLimit(limit + 10);
    }
  };

  const Header = () => (
    <>
      <View style={styles.header}>
        <Ionicons name="menu" size={28} color="black" />
        <Text style={styles.headerTitle}>GemStore</Text>
        <Icon name="notifications-outline" size={30} color="#000" />
      </View>
      <View style={styles.iconRow}>
        {[
          <FontAwesome5 name="venus" size={24} color="black" />,
          <FontAwesome5 name="mars" size={24} color="black" />,
          <FontAwesome5 name="glasses" size={24} color="black" />,
          <MaterialCommunityIcons name="lipstick" size={24} color="black" />
        ].map((icon, index) => (
          <View key={index} style={styles.iconCircle}>{icon}</View>
        ))}
      </View>
      <ImageBackground
        source={require('../assets/banner.png')}
        style={styles.banner}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={styles.bannerContent}>
          <Text style={styles.bannerText}>Autumn</Text>
          <Text style={styles.bannerSubText}>Collection</Text>
          <Text style={styles.bannerSubText}>2022</Text>
        </View>
      </ImageBackground>
      <TouchableOpacity
        onPress={() => {
          setIsVertical(!isVertical);
          setLimit(isVertical ? 5 : 10);
        }}
      >
        <View style={styles.featuredHeader}>
          <Text style={styles.featuredTitle}>Featured Products</Text>
          <Text style={styles.featuredLink}>
            {isVertical ? 'Back to Horizontal' : 'Show all'}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );

  const ProductCard = ({ item }) => (
    <View style={[styles.card, { width: isVertical ? '90%' : 200 }]}> 
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.price}$</Text>
    </View>
  );

  return isVertical ? (
    <ScrollView 
      contentContainerStyle={{ paddingBottom: 30 }}
      onScroll={() => {
        const isEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
        if (isEnd) loadMore();
      }}
      scrollEventThrottle={400}
    >
      <Header />
      {products.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
      {loading && <ActivityIndicator />}
    </ScrollView>
  ) : (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView horizontal contentContainerStyle={{ padding: 10 }}>
        {products.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </ScrollView>
      {loading && <ActivityIndicator />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
     justifyContent: 'space-between', 
     alignItems: 'center',
      paddingHorizontal: 10, 
      paddingTop: 40
  },
  headerTitle: { 
    fontSize: 24,
     fontWeight: 'bold'
     },
  iconRow: {
    flexDirection: 'row',
     justifyContent: 'space-between', 
     alignItems: 'center',
      paddingHorizontal: 30, 
      paddingVertical: 20
  },
  iconCircle: {
    width: 50,
     height: 50,
      borderRadius: 25,
       backgroundColor: 'lightgray', 
       justifyContent: 'center',
        alignItems: 'center',
         marginHorizontal: 5
  },
  banner: {
    width: '95%',
     height: 200,
      marginVertical: 30,
       justifyContent: 'center',
        alignItems: 'flex-start',
         alignSelf: 'center'
  },
  bannerContent: {
     alignItems: 'center',
      paddingHorizontal: 30 
    },
  bannerText: { 
    fontSize: 26,
     fontWeight: 'bold',
      color: 'white', 
      textAlign: 'center' 
    },
  bannerSubText: { 
    fontSize: 16,
     color: 'white',
      textAlign: 'center'
     },
  featuredHeader: {
    flexDirection: 'row',
     padding: 20,
      borderTopLeftRadius: 10, 
      borderTopRightRadius: 10,
       justifyContent: 'space-between',
        alignItems: 'center'
  },
  featuredTitle: { 
    fontSize: 18,
     fontWeight: 'bold' 
    },
  featuredLink: {
     fontSize: 15,
      fontWeight: 'bold',
       color: 'gray'
       },
  card: {
    height: 200,
     margin: 10,
      backgroundColor: 'lightgray',
       padding: 10, borderRadius: 10,
        alignItems: 'center',
         justifyContent: 'center',
          alignSelf: 'center'
  },
  image: {
     width: 180,
      height: 120,
       borderRadius: 8 
      }
       ,
  title: {
     marginTop: 10, fontWeight: 'bold', textAlign: 'center' },
  subtitle: {
     marginTop: 10,
     fontWeight: 'bold',
     alignSelf: 'flex-start' }
});
