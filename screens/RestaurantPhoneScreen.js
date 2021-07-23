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

export default function RestaurantPhoneScreen({ navigation }) {
  const current_id = firebase.auth().currentUser.uid;
  const [restaurantPhone, setRestaurantPhone] = useState("");

  const updateRestaurantPhone = async () => {
    if (restaurantPhone.length > 0) {
      firebase
        .firestore()
        .collection("restaurants")
        .doc(firebase.auth().currentUser.uid)
        .update({
          restaurantPhone: restaurantPhone,
        })
        .then(() => navigation.navigate("Profile"))
        .catch((error) => {
          alert("Error creating restaurant phone: ", error);
        });
      alert("Restaurant phone" + firebase.auth().currentUser.uid + " created");
    } else {
      alert("Enter your restaurant's phone");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.spacedinput}
        placeholder="Restaurant phone number"
        value={restaurantPhone}
        onChangeText={(restaurantPhone) => setRestaurantPhone(restaurantPhone)}
        keyboardType={"numeric"}
      />

      <TouchableHighlight style={styles.spacedinput}>
        <Button title="save" onPress={updateRestaurantPhone} />
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
