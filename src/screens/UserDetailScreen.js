import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const UserDetailScreen = ({ route, navigation }) => {
  const { user } = route.params;

  const handleEditUser = () => {
    // Navigate to the EditUser screen and pass the user information
    navigation.navigate('EditUser', { user });
  };

  const handleDeleteUser = async () => {
    try {
      // Delete the user from Firestore
      await firestore().collection('USERS').doc(user.id).delete();
      console.log('User successfully deleted from Firestore');
      // Navigate back to the user list screen after successful deletion
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const confirmDeleteUser = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDeleteUser, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Information</Text>
      <View style={styles.userItem}>
        <Text>Name: {user.name}</Text>
        <Text>Email: {user.email}</Text>
        <Text>Phone: {user.phone}</Text>
        <Text>Address: {user.address}</Text>
        <Text>Role: {user.role}</Text>

        {/* Add edit and delete buttons */}
        <TouchableOpacity style={styles.button} onPress={handleEditUser}>
          <Text style={styles.buttonText}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={confirmDeleteUser}>
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userItem: {
    padding: 12,
    backgroundColor: '#eee',
  },
  button: {
    marginTop: 12,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserDetailScreen;
