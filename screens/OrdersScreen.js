import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import * as firebase from "firebase";

export default function OrdersScreen () {
  const handleLogout = () => {
    firebase.auth().signOut();
    console.log("User "+firebase.auth().currentUser.uid+" logged out");
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.spacedinput}>
      <Button title="Logout" onPress={handleLogout} />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingVertical: "50%",
    alignItems: 'center',
  },
  spacedinput: {
    margin: 5,
    width: 300
  },
});
