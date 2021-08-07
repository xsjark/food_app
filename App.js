import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, LogBox } from "react-native";
import * as firebase from "firebase";
import { FIREBASE_CONFIG } from "./config.js";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignOutScreen from "./screens/SignOutScreen";

LogBox.ignoreLogs(["Setting a timer"]);

try {
  firebase.initializeApp(FIREBASE_CONFIG);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error("Firebase initialization error raised", err.stack);
  }
}

const Stack = createStackNavigator();
const RestaurantStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Restaurant = () => (
  <RestaurantStack.Navigator>
  <RestaurantStack.Screen
    name="Profile"
    component={ProfileScreen}
    options={{ headerShown: false , title: "My restaurant"}}
  />
  </RestaurantStack.Navigator>
)

const UserStack = () => (
  <Drawer.Navigator>
    <Drawer.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: true, title: "Home" }}
    />
    <Drawer.Screen
      name="My restaurant"
      component={Restaurant}
      options={{ headerShown: true }}
    />
    <Drawer.Screen
      name="Sign out"
      component={SignOutScreen}
      options={{ headerShown: false }}
    />
  </Drawer.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  });

  return (
    <NavigationContainer>
      {user ? <UserStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
