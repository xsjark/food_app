import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import * as firebase from "firebase";

export default function HomeScreen() {
  const handleLogout = () => {
    firebase.auth().signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.spacedinput}> Home Screen </Text>
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
  },
  spacedinput: {
    margin: 5,
    width: 300
  },
});
