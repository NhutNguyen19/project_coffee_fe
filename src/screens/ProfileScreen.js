import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { userService } from "../services/userService";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await userService.getMyInfo();
        console.log("Response:", response);

        if (!response || response.code !== 1000) {
          throw new Error(response.message || "No user information found.");
        }

        setUserInfo(response.result);
      } catch (err) {
        console.error("Error fetching user info:", err);
        Alert.alert(
          "Error",
          err.message || "An error occurred while fetching user info."
        );
        setError(err.message || "An error occurred while fetching user info.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>
      {userInfo ? (
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Họ và tên: {userInfo.displayName}</Text>
          <Text style={styles.label}>Tài khoản: {userInfo.username}</Text>
          <Text style={styles.label}>Số điện thoại: {userInfo.phone}</Text>
        </View>
      ) : (
        <Text>Thông tin cá nhân không tồn tại.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default UserProfile;
