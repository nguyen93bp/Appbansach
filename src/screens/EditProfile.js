// EditProfile.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useMyContextController } from '../context';
import firestore from '@react-native-firebase/firestore';

const EditProfile = ({ navigation }) => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  // State to store the edited profile information
  const [editedProfile, setEditedProfile] = useState({
    name: userLogin.name,
    email: userLogin.email,
    phone: userLogin.phone,
    address: userLogin.address,
  });

  const handleSave = async () => {
    try {
      // Update user information in Firestore
      await firestore().collection('USERS').doc(userLogin.email).update(editedProfile);

      console.log('Profile information updated successfully in Firestore and context');
      Alert.alert('Success', 'Thông tin người dùng đã được cập nhật thành công trên hệ thống, vui lòng đăng nhập lại để load dữ liệu sửa đổi.');

      // Navigate back to the user profile screen
      navigation.goBack();
    } catch (error) {
      console.error('Error updating user information:', error);
      Alert.alert('Error', 'Có lỗi xảy ra khi cập nhật thông tin người dùng');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sửa thông tin cá nhân</Text>
      <Text>Tên:</Text>
      <TextInput
        style={styles.input}
        value={editedProfile.name}
        onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
      />
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={editedProfile.email}
        onChangeText={(text) => setEditedProfile({ ...editedProfile, email: text })}
      />
      <Text>Số điện thoại:</Text>
      <TextInput
        style={styles.input}
        value={editedProfile.phone}
        onChangeText={(text) => setEditedProfile({ ...editedProfile, phone: text })}
      />
      <Text>Địa chỉ:</Text>
      <TextInput
        style={styles.input}
        value={editedProfile.address}
        onChangeText={(text) => setEditedProfile({ ...editedProfile, address: text })}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Lưu thông tin</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  button: {
    marginTop: 16,
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default EditProfile;
