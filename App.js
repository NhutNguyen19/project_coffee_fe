import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import UserProfile from "./src/screens/ProfileScreen";
import ServeScreen from "./src/screens/ServeScreen";
import FoodListScreen from "./src/screens/FoodListScreen";
import BillScreen from "./src/screens/BillScreen";
import { Header, Icon } from "react-native-elements";
import { View } from "react-native";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={({ route, navigation }) => ({
        drawerIcon: ({ color }) => {
          let iconName;
          if (route.name === "Tài khoản") {
            iconName = "account-circle";
          } else if (route.name === "Phòng bàn") {
            iconName = "table-view";
          }
          return <Icon name={iconName} type="material" color={color} />;
        },
        header: () => (
          <Header
            centerComponent={{
              text: route.name,
              style: { fontSize: 20, fontWeight: "bold", textAlign: "left" },
            }}
            leftComponent={
              <Icon name="menu" onPress={() => navigation.toggleDrawer()} />
            }
            rightComponent={
              <View style={{ flexDirection: "row" }}>
                <Icon
                  name="search"
                  onPress={() => console.log("Search pressed")}
                  containerStyle={{ marginRight: 10 }}
                />
                <Icon
                  name="notifications-none"
                  type="material"
                  onPress={() => console.log("Notification pressed")}
                />
              </View>
            }
            containerStyle={{ backgroundColor: "#fff" }}
          />
        ),
      })}
    >
      <Drawer.Screen name="Tài khoản" component={UserProfile} />
      <Drawer.Screen name="Phòng bàn" component={HomeScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Serve" component={ServeScreen} />
        <Stack.Screen
          name="Food"
          component={FoodListScreen}
          options={({ route }) => ({
            title: route.params?.tableName,
          })}
        />
        <Stack.Screen
          name="BillScreen"
          component={BillScreen}
          options={({ route }) => ({
            title: "Hóa đơn: " + route.params?.tableName,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
