import { setToken, removeToken } from "../services/localStorageService.js";

const authService = {
  login: async (username, password) => {
    try {
      const response = await fetch(
        "http://192.168.56.1:8080/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }

      const data = await response.json();
      if (data.code !== 1000) {
        throw new Error(data.message);
      }

      const token = await setToken(data.result?.token);
      console.log("Token login:", token);
      return data.result;
    } catch (error) {
      console.error("Login failed: " + error.message);
      throw error;
    }
  },

  register: async (username, password, displayName, phone) => {
    try {
      const response = await fetch(
        "http://192.168.56.1:8080/api/v1/accounts/registration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, displayName, phone }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
      const data = await response.json();
      if (data.code !== 1000) {
        throw new Error(data.message);
      }
      const loginResponse = await authService.login(username, password);
      return loginResponse;
    } catch (error) {
      console.error("Registration error:", error.message);
      throw error;
    }
  },
  logout: async (token) => {
    try {
      const response = await fetch(
        "http://192.168.56.1:8080/api/v1/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Logout response error:", errorData);
        throw new Error(errorData.message || response.statusText);
      }

      const data = await response.json();
      if (data.code !== 1000) {
        console.error("Logout API error:", data);
        throw new Error(data.message);
      }

      await removeToken();
      return data.result;
    } catch (error) {
      console.error("Logout error:", error.message);
      throw error;
    }
  },
};

export default authService;
