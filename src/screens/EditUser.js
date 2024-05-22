// EditUser.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const EditUser = ({ route, navigation }) => {
  const { user } = route.params;

  const [editedUser, setEditedUser] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
  });

  const handleUpdateUser = async () => {
    try {
      // Cập nhật thông tin người dùng trong Firestore
      await firestore().collection('USERS').doc(user.id).update(editedUser);

      console.log('Chi tiết người dùng đã được cập nhật thành công trong Firestore');
      Alert.alert('Success', 'Chi tiết người dùng đã được cập nhật thành công trong Firestore');
      // Quay lại màn hình chi tiết người dùng sau khi cập nhật thành công
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa thông tin người dùng</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên"
        value={editedUser.name}
        onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={editedUser.email}
        onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={editedUser.phone}
        onChangeText={(text) => setEditedUser({ ...editedUser, phone: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={editedUser.address}
        onChangeText={(text) => setEditedUser({ ...editedUser, address: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Vai trò"
        value={editedUser.role}
        onChangeText={(text) => setEditedUser({ ...editedUser, role: text })}
      />
      <Button title="Cập nhật" onPress={handleUpdateUser} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default EditUser;
