// UserManagementScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('USERS') // Thay 'users' bằng tên collection chứa thông tin người dùng
      .onSnapshot((querySnapshot) => {
        const userList = [];
        querySnapshot.forEach((documentSnapshot) => {
          userList.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setUsers(userList);
      });

    return () => unsubscribe();
  }, []);

  const navigateToUserDetail = (user) => {
    navigation.navigate('UserDetailScreen', { user });
  };

  const navigateToUserProfile = () => {
    navigation.navigate('UserProfile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách người dùng</Text>
        <TouchableOpacity style={styles.userIcon} onPress={navigateToUserProfile}>
          <Ionicons name="person" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList 
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => navigateToUserDetail(item)}
          >
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
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
  userIcon: {
    position: 'absolute',
    top: -5,
    right: 0,
    width: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
  },
});

export default UserManagementScreen;
