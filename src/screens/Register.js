import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useMyContextController, register } from "../context"; // Import the register function

export default Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const [controller, dispatch] = useMyContextController(); // Use the context controller

  const onRegisterSubmit = () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    // Call the register function from the context
    register(email, password, name, navigation, dispatch);

  };
  

  return (
    <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
          alignSelf: "center",
          color: "blue",
          marginBottom: 30,
        }}
      >
        Đăng Ký
      </Text>
      {/* Registration Fields */}
      <TextInput
        placeholder="Họ và tên"
        value={name}
        onChangeText={setName}
        style={{
          margin: 10,
        }}
        mode="outlined"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          margin: 10,
        }}
        mode="outlined"
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={{
          margin: 10,
        }}
        mode="outlined"
      />
      <TextInput
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        style={{
          margin: 10,
        }}
        mode="outlined"
      />
      

      <Button
        mode="contained-tonal"
        onPress={onRegisterSubmit}
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
        Đăng Ký
      </Button>
    </View>
  );
};
