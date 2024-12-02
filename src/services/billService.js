import { getToken } from "./localStorageService";

export const billService = {
  insertBill: async (billRequest) => {
    try {
      const token = await getToken();
      const response = await fetch(
        "http://192.168.56.1:8080/api/v1/bills/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(billRequest),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `Failed to insert bill: ${errorData.message || response.statusText}`
        );
        throw new Error(errorData.message || response.statusText);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error inserting bill:", error);
      throw error;
    }
  },
  checkOut: async (billId) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `http://192.168.56.1:8080/api/v1/bills/checkout/${billId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to checkout bill");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error checking out bill:", error);
      throw error;
    }
  },
};
