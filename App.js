import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, LogBox } from "react-native";
import * as firebase from "firebase";
import { FIREBASE_CONFIG } from "./config.js";

import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";

LogBox.ignoreLogs(["Setting a timer"]);

try {
  firebase.initializeApp(FIREBASE_CONFIG);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error("Firebase initialization error raised", err.stack);
  }
}

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
    <View style={styles.container}>

    {user ? (
      <HomeScreen />
    ) : (
      <LoginScreen />
    )}
    </View>
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
