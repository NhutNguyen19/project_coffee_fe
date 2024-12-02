import { getToken } from "./localStorageService";

export const tableService = {
  getTableFood: async () => {
    try {
      const token = await getToken();
      console.log("Token home:", token);
      const response = await fetch(
        "http://192.168.56.1:8080/api/v1/tables/all",
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
        throw new Error("Error" + errorText || response.statusText);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching table food:", error.message);
      throw error;
    }
  },
};
