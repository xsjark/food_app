import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import * as firebase from "firebase";

import RestaurantFlatList from "../components/RestaurantFlatList";

export default function HomeScreen() {
  const handleLogout = () => {
    firebase.auth().signOut();
    console.log("User "+firebase.auth().currentUser.uid+" logged out");
  };

  return (
    <View style={styles.container}>
      <RestaurantFlatList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: 'center',
  },
  spacedinput: {
    margin: 5,
    width: 300
  },
});
