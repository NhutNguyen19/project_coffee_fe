import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { foodService } from "../services/foodService";
import { Image } from "react-native-elements";
import defaultImage from "../assets/images.jpg";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";

const FoodListScreen = ({ route }) => {
  const navigation = useNavigation();
  const {
    tableId,
    tableName,
    selectedFoods: initialSelectedFoods = [],
  } = route.params || {};
  const [foods, setFoods] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState(initialSelectedFoods);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await foodService.getAllFoods();
        console.log("Select food");
        setFoods(data.result);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };
    fetchFoods();
  }, []);

  const handleViewCart = () => {
    navigation.navigate("BillScreen", { tableId, tableName, selectedFoods });
  };

  // const handleViewCart = () => {
  //   navigation.navigate("BillScreen", { tableName, selectedFoods: foods });
  // };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleViewCart}>
          <Icon name="shopping-cart" type="font-awesome" color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedFoods]);

  const handleFoodSelect = (food) => {
    setSelectedFoods((prevSelectedFoods) => {
      const foodIndex = prevSelectedFoods.findIndex(
        (item) => item.id === food.id
      );
      if (foodIndex !== -1) {
        const updatedFoods = [...prevSelectedFoods];
        updatedFoods[foodIndex] = {
          ...updatedFoods[foodIndex],
          count: updatedFoods[foodIndex].count + 1,
        };
        return updatedFoods;
      } else {
        return [...prevSelectedFoods, { ...food, count: 1 }];
      }
    });
  };

  const filteredFoods =
    selectedCategory === "Tất cả"
      ? foods
      : foods.filter((food) => food.category.name === selectedCategory);

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={styles.foodItem}
      onPress={() => handleFoodSelect(item)}
    >
      <Image source={defaultImage} style={styles.foodImage} />
      <View style={styles.item}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodPrice}>{item.price}.000 VND</Text>
      </View>
    </TouchableOpacity>
  );

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const renderCategoryButton = (category) => (
    <Text
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category ? styles.selectedCategoryButton : null,
      ]}
      onPress={() => handleCategoryPress(category)}
    >
      {category}
    </Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        {["Tất cả", "Các loại nước", "Món ăn", "Vật tư"].map(
          renderCategoryButton
        )}
      </View>
      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFoodItem}
        contentContainerStyle={styles.foodList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  categoryButton: {
    fontSize: 18,
    color: "#666",
    padding: 5,
    fontWeight: "bold",
  },
  selectedCategoryButton: {
    color: "white",
    fontWeight: "bold",
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#005b96",
  },
  foodItem: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 8,
    marginVertical: 6,
    flexDirection: "row",
  },
  foodImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 12,
  },
  foodName: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  foodPrice: {
    fontSize: 16,
    color: "black",
    paddingVertical: 10,
  },
  foodList: {
    paddingBottom: 100,
  },
});

export default FoodListScreen;
