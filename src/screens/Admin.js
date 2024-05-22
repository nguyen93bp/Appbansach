import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTabBar from './BottomTabBar';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import UserManagementScreen from './UserManagementScreen';
import { GiftedChat } from 'react-native-gifted-chat';
import auth from '@react-native-firebase/auth';
import MessageListScreen from './MessageListScreen';

const Tab = createBottomTabNavigator();

const ServiceScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);

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

    return () => unsubscribe();
  }, []);

  const navigateToAddNewService = () => {
    navigation.navigate('AddNewService');
  };

  const navigateToUserProfile = () => {
    navigation.navigate('UserProfile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách sản phẩm</Text>
        <TouchableOpacity style={styles.userIcon} onPress={navigateToUserProfile}>
          <Ionicons name="person" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => navigation.navigate('ServiceDetail', { service: item })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
            <View>
              <Text>{item.name}</Text>
              <Text>{item.money} VND</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={navigateToAddNewService}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const OrderProcessingScreen = ({ route }) => {
  // Kiểm tra nếu route.params không xác định, gán selectedServices và totalPrice một giá trị mặc định
  const { selectedServices = [], totalPrice = 0 } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin đơn hàng</Text>
      <FlatList
        data={selectedServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.serviceItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
            <View>
              <Text>{item.name}</Text>
              <Text>{item.money} VND</Text>
            </View>
          </View>
        )}
      />
      <Text style={styles.totalText}>Tổng tiền: {totalPrice}.000 VND</Text>
    </View>
  );
};


const Admin = () => {
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
        name="Quản lý sản phẩm"
        component={ServiceScreen}
        options={{
          iconName: 'home',
        }}
      />
      <Tab.Screen
        name="Quản lý Người dùng"
        component={UserManagementScreen}
        options={{
          iconName: 'people',
        }}
      />
      <Tab.Screen
        name="Xử lý đơn hàng"
        component={OrderProcessingScreen}
        options={{
          iconName: 'cart',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={MessageListScreen}
        options={{
          iconName: 'chatbubble-ellipses',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userIcon: {
    position: 'absolute',
    top: -5,
    right: 0,
    width: 30,
  },
  serviceItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#eee',
  },
  addButton: {
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
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  serviceImage: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    borderRadius: 8,
  },
});

export default Admin;
