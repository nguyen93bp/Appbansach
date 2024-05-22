import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMyContextController, logout } from '../context';

const UserProfile = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  // Kiểm tra xem userLogin có giá trị không null
  if (!userLogin) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Thông tin cá nhân</Text>
        <Text>Vui lòng đăng nhập để xem thông tin cá nhân.</Text>
      </View>
    );
  }

  const navigateToSetting = () => {
    navigation.navigate('Setting');
  };

  const goBack = () => {
    // Sử dụng navigation để quay lại màn hình trước đó
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>
      <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>Tên: {userLogin.name}</Text>
        <Text style={styles.userInfoText}>Email: {userLogin.email}</Text>
        <Text style={styles.userInfoText}>Số điện thoại: {userLogin.phone}</Text>
        <Text style={styles.userInfoText}>Địa chỉ: {userLogin.address}</Text>
        <Text style={styles.userInfoText}>Vai trò: {userLogin.role}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={navigateToSetting}>
        <Text style={styles.buttonText}>Cài đặt</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={goBack}>
        <Text style={styles.buttonText}>Quay lại</Text>
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
  userInfo: {
    marginBottom: 16,
  },
  userInfoText: {
    marginBottom: 8,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'blue',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserProfile;
