import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { tableService } from "../services/tableService";
import { useNavigation, useRoute } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Tất cả");

  const targetTableName = "Mang Về";
  const { tableName: updatedTableName, hasBill } = route.params || {};

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      try {
        const data = await tableService.getTableFood();
        console.log("Data fetched from API:", data);

        if (Array.isArray(data.result)) {
          const uniqueTables = Array.from(
            new Set(data.result.map((table) => table.id))
          ).map((id) => data.result.find((table) => table.id === id));

          const targetTable = uniqueTables.find(
            (table) => table.name === targetTableName
          );
          const filteredTables = uniqueTables.filter(
            (table) => table.name !== targetTableName
          );

          // Set the tables with the target table first if it exists
          setTables(
            targetTable ? [targetTable, ...filteredTables] : uniqueTables
          );
        }
      } catch (err) {
        setError("Failed to load table data.");
        console.error("Error fetching table data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, []);

  const getTableBackgroundColor = (tableName) => {
    if (updatedTableName === tableName && hasBill) {
      return { backgroundColor: "green" };
    }
    return {};
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const renderTableItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.tableItem, getTableBackgroundColor(item.name)]}
      onPress={() => {
        navigation.navigate("Food", { tableId: item.id, tableName: item.name });
      }}
    >
      <Text style={styles.tableId}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {["Tất cả", "Sử dụng", "Còn trống"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={
          activeTab === "Tất cả"
            ? tables
            : tables.filter((table) => table.status === activeTab)
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTableItem}
        numColumns={2}
        contentContainerStyle={styles.tableList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#f8f8f8",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: "#fff",
    marginTop: 5,
  },
  tab: {
    padding: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "blue",
  },
  tabText: {
    fontSize: 16,
    color: "#000",
  },
  activeTabText: {
    color: "blue",
  },
  tableList: {
    alignItems: "center",
  },
  tableItem: {
    backgroundColor: "#fff",
    padding: 35,
    borderRadius: 8,
    marginHorizontal: 5,
    marginVertical: 5,
    alignItems: "center",
    width: "47%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  tableId: {
    fontSize: 16,
    fontWeight: "bold",
  },
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

export default HomeScreen;
