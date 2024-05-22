import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleSignUp = async () => {
    // Reset previous error messages
    setFullNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate input fields
    if (!fullName.trim()) {
      setFullNameError('Vui lòng nhập họ và tên.');
      return;
    }

    if (!email.trim()) {
      setEmailError('Vui lòng nhập email.');
      return;
    }

    if (!password.trim()) {
      setPasswordError('Vui lòng nhập mật khẩu.');
      return;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Vui lòng nhập xác nhận mật khẩu.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Save user information to Firestore
      const USERS = firestore().collection('USERS');
      USERS.doc(email).set({
        address: '',
        email: email,
        name: fullName,
        phone: '',
        role: 'customer',
      });

      // Show success notification
      Alert.alert('Thành công', 'Tài khoản được tạo thành công!');
    } catch (error) {
      console.error('Lỗi đăng ký:', error.message);
      // Show error notification
      Alert.alert('Lỗi', 'Đã xảy ra lỗi đăng ký. Vui lòng thử lại.');
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.registrationText}>Đăng Ký</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Họ và tên</Text>
        <TextInput
          placeholder="Nhập họ và tên"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
          style={styles.input}
        />
        {!!fullNameError && <Text style={styles.errorMessage}>{fullNameError}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          placeholder="Nhập email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        {!!emailError && <Text style={styles.errorMessage}>{emailError}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Mật khẩu</Text>
        <TextInput
          placeholder="Nhập mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
        />
        {!!passwordError && <Text style={styles.errorMessage}>{passwordError}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
        <TextInput
          placeholder="Nhập xác nhận mật khẩu"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          style={styles.input}
        />
        {!!confirmPasswordError && <Text style={styles.errorMessage}>{confirmPasswordError}</Text>}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Quay lại" onPress={handleGoBack} color="#555" />
        <Button title="Đăng Ký" onPress={handleSignUp} color="#007BFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  registrationText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 18,
    color: 'black',
    marginBottom: 5,
    textAlign: 'left',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  errorMessage: {
    color: 'red',
    marginTop: 5,
  },
});

export default SignupScreen;
