import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import authService from "../services/authService";
import { Icon, Input } from "react-native-elements";
import { setToken } from "../services/localStorageService";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username) {
      setErrorMessage("Tài khoản không được để trống.");
      return;
    }

    if (!password) {
      setErrorMessage("Mật khẩu không được để trống.");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("Mật khẩu phải trên 8 ký tự.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await authService.login(username, password);
      navigation.navigate("Main", { screen: "Phòng bàn" });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate("Register");
  };

  const handleForgotPassword = () => {
    Alert.alert("Chức năng chưa được triển khai.");
  };

  const validatePassword = (password) => {
    const passwordRegex = /.{5,}/; // Ensure password is at least 8 characters
    return passwordRegex.test(password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Đăng nhập</Text>
        <Input
          placeholder="Tài khoản"
          placeholderTextColor="gray"
          onChangeText={setUserName}
          value={username}
          leftIcon={
            <Icon
              name="person"
              type="material"
              size={24}
              containerStyle={styles.icon}
            />
          }
          inputContainerStyle={styles.inputContainer}
          leftIconContainerStyle={styles.leftIconContainer}
          accessibilityLabel="Username input"
        />
        <Input
          placeholder="Mật khẩu"
          placeholderTextColor="gray"
          onChangeText={setPassword}
          value={password}
          leftIcon={
            <Icon
              name="lock"
              type="material"
              size={24}
              containerStyle={styles.icon}
            />
          }
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? "visibility-off" : "visibility"}
                type="material"
                size={24}
                color="gray"
                containerStyle={styles.iconShow}
              />
            </TouchableOpacity>
          }
          inputContainerStyle={styles.inputContainer}
          leftIconContainerStyle={styles.leftIconContainer}
          secureTextEntry={!showPassword}
          accessibilityLabel="Password input"
        />
        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.link}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.link}>
              Chưa có tài khoản?{" "}
              <Text style={{ fontWeight: "bold" }}>Đăng ký ngay</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    padding: 15,
  },
  inputContainer: {
    borderWidth: 1,
    paddingLeft: 5,
    borderColor: "#d3d3d3",
    borderRadius: 5,
    marginBottom: 5,
  },
  iconShow: {
    paddingRight: 10,
  },
  leftIconContainer: {
    marginRight: 5,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#00BCD4",
    borderRadius: 5,
    width: "94%",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
    paddingVertical: 10,
  },
  linkContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
  },
  link: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
    paddingVertical: 5,
  },
});

export default LoginScreen;
