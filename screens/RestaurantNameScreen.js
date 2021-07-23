import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Appearance,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import * as firebase from "firebase";

export default function RestaurantNameScreen({ navigation }) {
  const current_id = firebase.auth().currentUser.uid;
  const [restaurantName, setRestaurantName] = useState("");

  const updateRestaurantName = async () => {
    if (restaurantName.length > 0) {
      firebase
        .firestore()
        .collection("restaurants")
        .doc(firebase.auth().currentUser.uid)
        .update({
          restaurantName: restaurantName,
        })
        .then(() => navigation.navigate("Profile"))
        .catch((error) => {
          alert("Error creating restaurant: ", error);
        });
      alert("Restaurant " + firebase.auth().currentUser.uid + " created");
    } else {
      alert("Enter your restaurant's name");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.spacedinput}
        placeholder="Restaurant name"
        value={restaurantName}
        onChangeText={(restaurantName) => setRestaurantName(restaurantName)}
      />

      <TouchableHighlight style={styles.spacedinput}>
        <Button title="save" onPress={updateRestaurantName} />
      </TouchableHighlight>
      <TouchableHighlight style={styles.spacedinput}>
        <Button title="back" onPress={() => navigation.navigate("Profile")} />
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
    alignItems: "center",
  },
  spacedinput: {
    margin: 5,
    width: 300,
  },
});
