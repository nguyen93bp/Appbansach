// ForgotPassword.js
import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import auth from '@react-native-firebase/auth';

export default ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const onResetPasswordSubmit = async () => {
    if (!email.trim()) {
      // Show alert if email is empty
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email.');
      return;
    }

    try {
      // Send password reset email
      await auth().sendPasswordResetEmail(email);
      
      // Show success notification
      Alert.alert('Thành công', 'Kiểm tra email để đặt lại mật khẩu.');

      // Navigate back to the login screen
      navigation.navigate("Login");
    } catch (error) {
      console.error('Lỗi đặt lại mật khẩu:', error.message);
      // Show error notification
      Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          alignSelf: "center",
          color: "blue",
          marginBottom: 30,
        }}
      >
        Quên Mật Khẩu
      </Text>
      <Text
        style={{
          fontSize: 16,
          alignSelf: "center",
          marginVertical: 10,
        }}
      >
        Nhập email của bạn để đặt lại mật khẩu
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          margin: 10,
        }}
        mode="outlined"
      />

      <Button
        mode="contained-tonal"
        onPress={onResetPasswordSubmit}
        style={{
          margin: 10,
          padding: 5,
          backgroundColor: "darkblue",
        }}
        labelStyle={{
          fontSize: 20,
          color: "white",
        }}
      >
        Đặt Lại Mật Khẩu
      </Button>
    </View>
  );
};
