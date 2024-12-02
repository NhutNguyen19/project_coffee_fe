import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Input, Icon } from "react-native-elements";
import authService from "../services/authService"; // Import your authService

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const validateInput = () => {
    if (!username) return "Tài khoản không được để trống.";
    if (!password) return "Mật khẩu không được để trống.";
    if (password.length < 6) return "Mật khẩu phải ít nhất 6 ký tự.";
    if (password !== confirmpassword) return "Mật khẩu không khớp.";
    if (!displayName) return "Họ và tên không được để trống.";
    if (!phone) return "Số điện thoại không được để trống.";
    return null;
  };

  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage(null);

    const validationError = validateInput();
    if (validationError) {
      setErrorMessage(validationError);
      setLoading(false);
      return;
    }

    try {
      await authService.register(username, password, displayName, phone);
      Alert.alert("Đăng ký thành công", "Bạn đã đăng ký thành công!");
      navigation.navigate("Main", { screen: "Phòng bàn" });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          style={{ flexGrow: 1 }}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Đăng ký</Text>

            <Input
              placeholder="Họ và tên"
              placeholderTextColor="gray"
              onChangeText={setDisplayName}
              value={displayName}
              leftIcon={
                <Icon
                  name="account-circle"
                  type="material"
                  size={24}
                  containerStyle={styles.icon}
                />
              }
              inputContainerStyle={styles.inputContainer}
              accessibilityLabel="Display name input"
            />
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
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    name={showPassword ? "visibility-off" : "visibility"}
                    type="material"
                    size={24}
                    color="gray"
                    containerStyle={styles.iconShow}
                  />
                </TouchableOpacity>
              }
              secureTextEntry={!showPassword}
              inputContainerStyle={styles.inputContainer}
              accessibilityLabel="Password input"
            />

            <Input
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="gray"
              onChangeText={setConfirmPassword}
              value={confirmpassword}
              leftIcon={
                <Icon
                  name="lock"
                  type="material"
                  size={24}
                  containerStyle={styles.icon}
                />
              }
              secureTextEntry={!showPassword}
              inputContainerStyle={styles.inputContainer}
              accessibilityLabel="Confirm Password input"
            />

            <Input
              placeholder="Số điện thoại"
              placeholderTextColor="gray"
              onChangeText={setPhone}
              value={phone}
              leftIcon={
                <Icon
                  name="phone"
                  type="material"
                  size={24}
                  containerStyle={styles.icon}
                />
              }
              inputContainerStyle={styles.inputContainer}
              accessibilityLabel="Phone input"
            />

            {errorMessage && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Đăng ký</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>
                Đã có tài khoản?{" "}
                <Text style={{ fontWeight: "bold" }}>Đăng nhập</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    minHeight: 600,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 5,
  },
  iconShow: {
    paddingRight: 10,
  },
  button: {
    backgroundColor: "#00BCD4",
    borderRadius: 5,
    width: "100%",
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
  },
  link: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    paddingBottom: 15,
  },
});

export default RegisterScreen;
