import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Appearance,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
  KeyboardAvoidingView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import * as firebase from "firebase";
import { Button, Text, Chip, Input } from "react-native-elements";

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

const keyWordArray = [
  "Chifa",
  "Almuerzos",
  "Secos",
  "Pizza",
  "Hamburguesas",
  "Hot-dogs",
  "Alitas",
  "Costillas",
  "Pinchos",
  "Vegetariana",
  "Vegana",
  "Mariscos",
  "Encebollado",
];

export default function RestaurantPhoneScreen({ navigation }) {

  const current_id = firebase.auth().currentUser.uid;
  const [keyWords, setKeyWords] = useState([]);
  const [restaurant, setRestaurant] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    firebase.firestore().collection("restaurants").doc(current_id).get()
        .then(snapshot => {
          setRestaurant(snapshot.data()); 
          setIsLoading(false); 
          setKeyWords(snapshot.data().keyWords)
        })
  },[restaurant.restaurantName])

  
  const handleChipPress = (chip) => {
    if (restaurant.restaurantName !== null && !keyWords.includes(chip)) {
      setKeyWords((oldArray) => [...keyWords, chip].filter(obj=>obj))
    }
    if (restaurant.restaurantName !== null){
      setKeyWords((oldArray) => [...keyWords, chip ].filter(obj=>obj))
    }
    if (restaurant.restaurantName !== null && keyWords.includes(chip) ) {
      setKeyWords((keyWords) => keyWords.filter((keyWord) => keyWord !== chip).filter(obj=>obj))
    }
   
    else {
      return
    }
  };

  const handleFirstChipPress = (chip) => {
    setKeyWords(chip)
  }

  const updateRestaurantKeyWords = async () => {
    if (keyWords.length > 0) {

      firebase
        .firestore()
        .collection("restaurants")
        .doc(firebase.auth().currentUser.uid)
        .update({
          keyWords: keyWords.filter((item) => keyWordArray.includes(item))
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
      {isLoading && <ActivityIndicator />}
      {restaurant.restaurantName && <View style={styles.hori_container}>
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
        <Button
              containerStyle={{width:"90%", marginTop: 20, marginBottom: 20, marginHorizontal: "5%", borderRadius: 10, }}
              buttonStyle={{backgroundColor: "#f4d03f"}}
              titleStyle={{  color: "black" }}
              raised
              title="Guardar" 
              onPress={updateRestaurantKeyWords} 
        />

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
  button: {
    backgroundColor: "#f4d03f",
    width:300, 
    marginTop: 20, 
    borderRadius: 10, 
    alignSelf: "center",
    color: "black"
  }
});
