import AsyncStorage from "@react-native-async-storage/async-storage";

export const KEY_TOKEN = "accessToken";

export const setToken = async (token) => {
  try {
    if (token) {
      await AsyncStorage.setItem(KEY_TOKEN, token); // Use AsyncStorage
      return token; // Return the token
    }
  } catch (error) {
    console.error("Error setting token:", error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(KEY_TOKEN);
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(KEY_TOKEN);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};
