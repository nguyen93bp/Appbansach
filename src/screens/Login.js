import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useMyContextController, login, register } from "../context";
import { TouchableOpacity } from "react-native-gesture-handler";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [showPassword, setShowPassword] = useState(false);
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  useEffect(() => {
    if (userLogin != null) {
      if (userLogin.role === "admin") navigation.navigate("Admin");
      else navigation.navigate("Customer");
    }
  }, [userLogin]);

  const onLoginSubmit = () => {
    login(dispatch, email, password);
  };

  const onForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        style={styles.input}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        mode="outlined"
      />

      <Button
        mode="contained"
        onPress={onLoginSubmit}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Đăng Nhập
      </Button>

      <Text style={styles.registerText}>
        Chưa có tài khoản?{" "}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate("SignupScreen")}
        >
          Đăng ký ngay!
        </Text>
      </Text>

      <TouchableOpacity onPress={onForgotPassword}>
        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "blue",
    marginBottom: 30,
  },
  input: {
    marginVertical: 10,
    width: "100%",
  },
  button: {
    marginVertical: 10,
    padding: 5,
    backgroundColor: "darkblue",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
  registerText: {
    fontSize: 20,
    alignSelf: "center",
    marginVertical: 10,
    color: "black",
  },
  registerLink: {
    color: "darkblue",
    fontWeight: "bold",
  },
  forgotPassword: {
    fontSize: 16,
    alignSelf: "center",
    marginVertical: 10,
    color: "blue",
  },
});

export default Login;
