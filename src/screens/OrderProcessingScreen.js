import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const OrderProcessingScreen = () => {
  const [bookings, setBookings] = useState([]);

  const navigation = useNavigation();

  const navigateToAdmin = () => {
    navigation.navigate('Admin');
  };

  const navigateToUser = () => {
    navigation.navigate('User');
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const snapshot = await firestore().collection('bookings').orderBy('orderDate', 'desc').get();
        const bookingsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.orderContainer}>
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

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  orderContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 14,
  },
  orderDate: {
    fontSize: 14,
  },
  selectedDate: {
    fontSize: 14,
  },
  selectedTime: {
    fontSize: 14,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default OrderProcessingScreen;
