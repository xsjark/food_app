import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Appearance,
  Button,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import * as firebase from "firebase";
import { Text, Chip, Input } from "react-native-elements";

const DATA = [
  {
    title: "Chifa",
  },
  {
    title: "Almuerzos",
  },
  {
    title: "Secos",
  },
  {
    title: "Pizza",
  },
  {
    title: "Hamburguesas",
  },
  {
    title: "Hot-dogs",
  },
  {
    title: "Alitas",
  },
  {
    title: "Costillas",
  },
  {
    title: "Pinchos",
  },
  {
    title: "Vegetariana",
  },
  {
    title: "Vegana",
  },
  {
    title: "Mariscos",
  },
  {
    title: "Encebollado",
  },
];

export default function RestaurantPhoneScreen({ navigation }) {
  const current_id = firebase.auth().currentUser.uid;
  const [keyWords, setKeyWords] = useState([]);

  const handleChipPress = (chip) => {
    setKeyWords((oldArray) => [...keyWords, chip]);
    if (keyWords.includes(chip)) {
      setKeyWords((keyWords) => keyWords.filter((keyWord) => keyWord !== chip));
    }
  };

  const updateRestaurantKeyWords = async () => {
    if (keyWords.length > 0) {
      firebase
        .firestore()
        .collection("restaurants")
        .doc(firebase.auth().currentUser.uid)
        .update({
          keyWords: keyWords,
        })
        .then(() => navigation.navigate("Profile"))
        .catch((error) => {
          alert("Error creating restaurant keywords: ", error);
        });
      alert(
        "Restaurant keywords " + firebase.auth().currentUser.uid + " created"
      );
    } else {
      alert("Enter your restaurant's keywords");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.hori_container}>
        {DATA.map((item) => (
          <Chip
            title={item.title}
            titleStyle={{ fontSize: 10 }}
            type={keyWords.includes(item.title) ? "solid" : "outline"}
            containerStyle={{ margin: 5 }}
            onPress={() => handleChipPress(item.title)}
          />
        ))}
      </View>

      <TouchableHighlight style={styles.spacedinput}>
        <Button title="save" onPress={updateRestaurantKeyWords} />
      </TouchableHighlight>
      <TouchableHighlight style={styles.spacedinput}>
        <Button title="back" onPress={() => navigation.navigate("Profile")} />
      </TouchableHighlight>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingVertical: "70%",
    alignItems: "center",
  },
  hori_container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 50,
  },
  spacedinput: {
    margin: 5,
    width: 300,
  },
});
