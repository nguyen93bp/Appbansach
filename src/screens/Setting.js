import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useMyContextController, logout } from '../context';

const Setting = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  useEffect(() => {
    if (userLogin == null) navigation.navigate('Login');
  }, [userLogin]);

  const onSubmit = () => {
    logout(dispatch);
  };

  return (
    <View style={styles.container}>
      
      <Button
        style={styles.editProfileButton}
        mode="contained"
        onPress={() => navigation.navigate('EditProfile')}
      >
        Sửa thông tin
      </Button>
      <Button
        style={styles.logoutButton}
        mode="contained"
        onPress={onSubmit}
      >
        Đăng Xuất
      </Button>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logoutButton: {
    backgroundColor: 'blue',
    marginBottom: 20,
  },
  editProfileButton: {
    backgroundColor: 'blue', // Adjust the color as needed
    marginBottom: 20,
  },
});

export default Setting;
