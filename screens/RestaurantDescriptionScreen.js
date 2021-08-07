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
  ActivityIndicator,
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
  const [restaurant, setRestaurant] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    firebase.firestore().collection("restaurants").doc(current_id).get()
        .then(snapshot => {
          setRestaurant(snapshot.data()); 
          setIsLoading(false); 
          setKeyWords(snapshot.data().keyWords)
        })
  },[])

  
  const handleChipPress = (chip) => {
    if (restaurant.restaurantName !== null && !keyWords.includes(chip) && !keyWords.includes(restaurant.restaurantName)) {
      setKeyWords((oldArray) => [...keyWords, chip, restaurant.restaurantName].filter(obj=>obj))
    }
    if (restaurant.restaurantName !== null && keyWords.includes(chip) && !keyWords.includes(restaurant.restaurantName)){
      setKeyWords((oldArray) => [...keyWords, restaurant.restaurantName].filter(obj=>obj))
    }
    if (restaurant.restaurantName !== null && !keyWords.includes(chip) && keyWords.includes(restaurant.restaurantName)){
      setKeyWords((oldArray) => [...keyWords, chip ].filter(obj=>obj))
    }
    if (restaurant.restaurantName !== null && keyWords.includes(chip) && keyWords.includes(restaurant.restaurantName)) {
      setKeyWords((keyWords) => keyWords.filter((keyWord) => keyWord !== chip).filter(obj=>obj))
    }
    else {
      return
    }
  };

  const updateRestaurantKeyWords = async () => {
    if (keyWords.length > 0) {

      firebase
        .firestore()
        .collection("restaurants")
        .doc(firebase.auth().currentUser.uid)
        .update({
          keyWords: keyWords
        })
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
      <Text>{restaurant.keyWords}</Text>
      {isLoading && <ActivityIndicator />}
      {!isLoading && typeof(keyWords) !== "undefined" && <View style={styles.hori_container}>
        {DATA.map((item) => (
          <Chip
            title={item.title}
            titleStyle={{ fontSize: 10 }}
            type={keyWords.includes(item.title) ? "solid" : "outline"}
            containerStyle={{ margin: 5 }}
            onPress={() => handleChipPress(item.title)}
            key={item.title}
          />
        ))}
      </View>
      }
      {!isLoading && typeof(keyWords) == "undefined" && <View style={styles.hori_container}>
        {DATA.map((item) => (
          <Chip
            title={item.title}
            titleStyle={{ fontSize: 10 }}
            type={"outline"}
            containerStyle={{ margin: 5 }}
            onPress={() => handleChipPress(item.title)}
            key={item.title}
          />
        ))}
      </View>
      }

      <TouchableHighlight style={styles.spacedinput}>
        <Button title="save" onPress={updateRestaurantKeyWords} />
      </TouchableHighlight>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  hori_container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  spacedinput: {
    margin: 10,
    width: 300,
  },
});
