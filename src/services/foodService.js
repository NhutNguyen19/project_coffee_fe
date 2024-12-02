import { getToken } from "./localStorageService";

export const foodService = {
  getAllFoods: async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `http://192.168.56.1:8080/api/v1/foods/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching food data: " + error.message);
      throw error;
    }
  },
};
