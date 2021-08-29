import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {  List, StyleSheet,  TextInput, TouchableHighlight, View } from "react-native";
import * as firebase from "firebase";
import { Button, Text, } from "react-native-elements";

export default function SignoutScreen ({ navigation }) {
  const handleLogout = () => {
    firebase.auth().signOut();
    console.log("User "+firebase.auth().currentUser.uid+" logged out");
  };

  return (
    <View style={styles.container}>

    <TouchableHighlight style={styles.spacedinput}>
    <Button
      buttonStyle={styles.button}
      titleStyle={{color: "black"}}
      title="Cerrar sesión"
      onPress={handleLogout}
    />
    </TouchableHighlight>

    <TouchableHighlight style={styles.spacedinput}>
    <Button
      buttonStyle={styles.button}
      titleStyle={{color: "black"}}
      title="Atrás "
      onPress={() => navigation.navigate("Home")}
    />
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
  button: {
    backgroundColor: "#f4d03f",
    width:300, 
    borderRadius: 10, 
    alignSelf: "center",
  }
});
