import { getToken } from "./localStorageService";

export const userService = {
  getMyInfo: async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        "http://192.168.56.1:8080/api/v1/accounts/my-info",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(errorText || response.statusText);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching my info:", error.message);
      throw error;
    }
  },
};
