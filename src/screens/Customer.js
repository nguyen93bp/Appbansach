// Customer.js
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTabBar from './BottomTabBar';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import UserProfile from './UserProfile';
import FavoritesScreen from './FavoritesScreen';
import { GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import ChatScreen from './ChatScreen';

const Tab = createBottomTabNavigator();

// Define the getCurrentUser function
const getCurrentUser = () => {
  return auth().currentUser;
};

const HomeScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('services')
      .onSnapshot((querySnapshot) => {
        const servicesList = [];
        querySnapshot.forEach((documentSnapshot) => {
          servicesList.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setServices(servicesList);
      });

    const unsubscribeFavorites = firestore()
      .collection('USERS')
      .doc(getCurrentUser()?.email)
      .onSnapshot((doc) => {
        const userFavorites = doc.data()?.favorites || [];
        setFavorites(userFavorites);
      });

    return () => {
      unsubscribe();
      unsubscribeFavorites();
    };
  }, []);

  const navigateToServiceDetail = (service) => {
    navigation.navigate('ServiceDetail', { service });
  };

  const addToCart = (service) => {
    if (!selectedServices.some((selectedService) => selectedService.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
      Alert.alert('Thành công', 'Dịch vụ đã được thêm vào giỏ hàng');
    } else {
      Alert.alert('Thông báo', 'Dịch vụ đã tồn tại trong giỏ hàng.');
    }
  };

  const navigateToCartScreen = () => {
    navigation.navigate('CartScreen', {
      selectedServices,
      setSelectedServices: setSelectedServices,
      reloadCart: reloadCartScreen,
      forceUpdateCart: forceUpdate,
    });
  };

  const reloadCartScreen = () => {
    setForceUpdate((prev) => !prev);
  };

  const isServiceFavorite = (service) => {
    return favorites.some((fav) => fav.id === service.id);
  };

  const toggleFavorite = async (service) => {
    const user = getCurrentUser();
    if (!user) {
      return;
    }

    const userEmail = user.email;

    if (!userEmail) {
      console.error('Email not found for the current user.');
      return;
    }

    const userDocRef = firestore().collection('USERS').doc(userEmail);

    try {
      const userDoc = await userDocRef.get();

      if (!userDoc.exists) {
        await userDocRef.set({ favorites: [] });
      }

      const updatedUserDoc = await userDocRef.get();
      const updatedFavorites = updatedUserDoc.data()?.favorites || [];

      if (isServiceFavorite(service)) {
        const updatedFavorites = favorites.filter((fav) => fav.id !== service.id);
        console.log('Updated Favorites:', updatedFavorites);
        await userDocRef.update({ favorites: updatedFavorites });
      } else {
        const updatedFavorites = [...favorites, service];
        console.log('Updated Favorites:', updatedFavorites);
        await userDocRef.update({ favorites: updatedFavorites });
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => navigateToServiceDetail(item)}
          >
            <View style={styles.serviceInfo}>
              <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
              <View style={styles.serviceText}>
                <Text>{item.name}</Text>
                <Text>{item.money} VND</Text>
              </View>
            </View>
            <View style={styles.iconsContainer}>
              <TouchableOpacity
                style={styles.favoriteIcon}
                onPress={() => toggleFavorite(item)}
              >
                <Ionicons
                  name={isServiceFavorite(item) ? 'heart' : 'heart-outline'}
                  size={21}
                  color="red"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => addToCart(item)}
              >
                <FontAwesome name="shopping-cart" size={20} color="blue" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.cartButton} onPress={navigateToCartScreen}>
        <FontAwesome name="shopping-cart" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const Customer = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: 'darkblue',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{
          iconName: 'home',
        }}
      />
      <Tab.Screen
        name="Yêu thích"
        component={FavoritesScreen}
        options={{
          iconName: 'heart',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          iconName: 'chatbubble-ellipses',
        }}
      />
      <Tab.Screen
        name="Thông tin Người dùng"
        component={UserProfile}
        options={{
          iconName: 'person',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  serviceItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceImage: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
  },
  serviceText: {
    flex: 1,
  },
  addToCartButton: {
    backgroundColor: 'transparent',
    padding: 8,
    marginLeft: -50, // Adjusted marginLeft
  },
  cartButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 50,
    height: 50,
    backgroundColor: 'blue',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  favoriteIcon: {
    marginLeft: -60, // Adjusted marginRight
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#d3d3d3',
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Customer;
