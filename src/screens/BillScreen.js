import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { billService } from "../services/billService";
import { Icon, Image } from "react-native-elements";
import defaultImage from "../assets/images.jpg";

const BillScreen = ({ route }) => {
  const navigation = useNavigation();
  const {
    tableId,
    tableName,
    selectedFoods: initialSelectedFoods = [],
  } = route.params || {};
  const [selectedFoods, setSelectedFoods] = useState(
    initialSelectedFoods.map((food) => ({ ...food, count: food.count || 1 }))
  );
  const [promotions, setPromotions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInsertBill = async () => {
    setLoading(true);
    try {
      const billRequest = {
        checkOut: new Date().toISOString(),
        status: "COMPLETE",
        table: { id: tableId },
        discount: 0.0,
        totalPrice: selectedFoods.reduce(
          (sum, item) => sum + item.price * item.count,
          0
        ),
      };

      console.log("Sending BillRequest:", billRequest);

      const result = await billService.insertBill(billRequest);
      Alert.alert(
        "Success",
        `Bill inserted successfully for table ${result.tableName}!`
      );

      navigation.navigate("Main", {
        screen: "Phòng bàn",
        params: { tableId, tableName, hasBill: !!result.id },
      });
    } catch (err) {
      setError("Failed to insert bill.");
      console.error("Error inserting bill:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMore = () => {
    navigation.navigate("Food", { tableId, tableName, selectedFoods });
  };

  const handlePayment = () => {
    Alert.alert("Payment", "Payment process initiated.");
  };

  const handleIncreaseQuantity = (foodId) => {
    setSelectedFoods((prevSelectedFoods) =>
      prevSelectedFoods.map((food) => {
        if (food.id === foodId) {
          return { ...food, count: food.count + 1 };
        }
        return food;
      })
    );
  };

  const handleDecreaseQuantity = (foodId) => {
    setSelectedFoods((prevSelectedFoods) =>
      prevSelectedFoods.map((food) => {
        if (food.id === foodId && food.count > 1) {
          return { ...food, count: food.count - 1 };
        }
        return food;
      })
    );
  };

  const handleDeleteItem = (foodId) => {
    setSelectedFoods((prevSelectedFoods) =>
      prevSelectedFoods.filter((food) => food.id !== foodId)
    );
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const renderSelectedFood = ({ item }) => (
    <View style={styles.selectedFoodItem}>
      <Image source={defaultImage} style={styles.foodImage} />
      <View style={styles.foodDetails}>
        <Text style={styles.label}>{item.name}</Text>
        <Text style={styles.label}>{item.price}.000 VND</Text>
      </View>
      <View style={styles.func}>
        <View style={styles.quantityButtons}>
          <TouchableOpacity onPress={() => handleDecreaseQuantity(item.id)}>
            <Icon name="minus" type="font-awesome" color="#000" size={20} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.count}</Text>
          <TouchableOpacity onPress={() => handleIncreaseQuantity(item.id)}>
            <Icon name="plus" type="font-awesome" color="#000" size={20} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
          <Icon name="delete" type="material" color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const totalAmount = selectedFoods.reduce((sum, item) => {
    const discount = promotions[item.id] || 0;
    return sum + item.price * (1 - discount) * item.count;
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flatListContainer}>
        <FlatList
          data={selectedFoods}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSelectedFood}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Text style={styles.totalLabel}>Total: {totalAmount.toFixed(3)} VND</Text>
      <View style={styles.buttonView}>
        <TouchableOpacity style={styles.button} onPress={handleInsertBill}>
          <Text style={styles.buttonText}>Insert Bill</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.buttonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddMore}>
        <Icon name="plus" type="font-awesome" color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    height: "72%",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    marginBottom: 25,
  },
  foodImage: { width: 40, height: 40, marginRight: 10 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 18, marginVertical: 4 },
  selectedFoodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomColor: "#ccc",
  },
  foodDetails: { flex: 1 },
  func: { flexDirection: "row", alignItems: "center" },
  quantityButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 30,
  },
  quantity: { marginHorizontal: 8, fontSize: 16 },
  totalLabel: { fontSize: 18, fontWeight: "bold", marginTop: 16 },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#006BFF",
    borderRadius: 50,
    width: 40,
    height: 40,
    alignSelf: "flex-end",
    top: -110,
    right: 20,
  },
  buttonView: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    backgroundColor: "#005b96",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
    width: "45%",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default BillScreen;
