import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, createRef } from "react";
import {
  Button,
  List,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  RefreshControl,
  ScrollView,
} from "react-native";
import * as firebase from "firebase";
import { Input, Card, Chip } from "react-native-elements";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const newRestaurantNameInput = React.createRef();
const newRestaurantPhoneInput = React.createRef();

export default function ProfileScreen({ navigation }) {
  const current_id = firebase.auth().currentUser.uid;
  const [restaurant, setRestaurant] = useState([]);
  const [newRestaurantName, setNewRestaurantName] = useState("");
  const [newRestaurantPhone, setNewRestaurantPhone] = useState("");
  const [newRestaurantKeyWords, setNewRestaurantKeyWords] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);


  const updateRestaurantName = async () => {
    if (newRestaurantName.length > 0 && restaurant.keyWords.length > 0) {
      firebase
        .firestore()
        .collection("restaurants")
        .doc(firebase.auth().currentUser.uid)
        .update({
          restaurantName: newRestaurantName,
        })
        .then(() =>
        firebase
          .firestore()
          .collection("restaurants")
          .doc(firebase.auth().currentUser.uid)
          .update({
            keyWords: restaurant.keyWords.concat(newRestaurantName).filter((item) => item !== restaurant.restaurantName),
          })
      )
        .catch((error) => {
          alert("Error updating restaurant name: ", error);
        });
      alert("Restaurant name " + firebase.auth().currentUser.uid + " updated");
    } else {
      alert("Enter your restaurant's new name");
    }
  };

  const updateRestaurantPhone = async () => {
    if (newRestaurantPhone.length > 0 ) {
      firebase
        .firestore()
        .collection("restaurants")
        .doc(firebase.auth().currentUser.uid)
        .update({
          restaurantPhone: newRestaurantPhone,
        })
        .catch((error) => {
          alert("Error updating restaurant phone: ", error);
        });
      alert("Restaurant phone" + firebase.auth().currentUser.uid + " updated");
    } else {
      alert("Enter your restaurant's new phone");
    }
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("restaurants")
      .doc(current_id)
      .get()
      .then((snapshot) => setRestaurant(snapshot.data()));
  },[]);

  const handleLogout = () => {
    firebase.auth().signOut();
    console.log("User " + firebase.auth().currentUser.uid + " logged out");
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    firebase
      .firestore()
      .collection("restaurants")
      .doc(current_id)
      .get()
      .then((snapshot) => setRestaurant(snapshot.data()));
      newRestaurantNameInput.current.clear();
      newRestaurantPhoneInput.current.clear();
    wait(2000)
    .then(() => setRefreshing(false));
  }, []);


  return (
    <View style={styles.container}>
    <ScrollView
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  }
  >
      <Card containerStyle={styles.spaced}>
        <Card.Title>Restaurant name</Card.Title>
        <Card.Divider />
        <Input
          placeholder={restaurant.restaurantName}
          leftIcon={{ type: "entypo", name: "shop" }}
          value={newRestaurantName}
          onChangeText={(newRestaurantName) => setNewRestaurantName(newRestaurantName)}
          ref={newRestaurantNameInput}
        />
        <TouchableHighlight>
          <Button
            style={styles.spaced}
            title="Save"
            onPress={() => {updateRestaurantName(); newRestaurantNameInput.current.clear();}}
          />
        </TouchableHighlight>
      </Card>

      <Card containerStyle={styles.spaced}>
        <Card.Title>Restaurant phone</Card.Title>
        <Card.Divider />
        <Input
          placeholder={restaurant.restaurantPhone}
          leftIcon={{ type: "entypo", name: "old-phone" }}
          value={newRestaurantPhone}
          onChangeText={(newRestaurantPhone) => setNewRestaurantPhone(newRestaurantPhone)}
          ref={newRestaurantPhoneInput}
        />
        <TouchableHighlight>
          <Button
            style={styles.spaced}
            title="Save"
            onPress={() => {updateRestaurantPhone(); newRestaurantPhoneInput.current.clear();}}
          />
        </TouchableHighlight>
      </Card>

      <Card containerStyle={styles.spaced}>
        <Card.Title>Restaurant description</Card.Title>
        <Card.Divider />
        <View style={styles.hori_container}>
          {typeof restaurant.keyWords !== "undefined" ? (
            restaurant.keyWords
              .filter((item) => item !== restaurant.restaurantName)
              .map((item, index) => (
                <Chip
                  title={item}
                  key={index}
                  type="outline"
                  titleStyle={{ fontSize: 10 }}
                  containerStyle={{ margin: 2 }}
                />
              ))
          ) : (
            <Text>No tags</Text>
          )}
          <Chip
            type="solid"
            titleStyle={{ fontSize: 10 }}
            containerStyle={{ margin: 2 }}
            icon={{
              name: "pencil",
              type: "font-awesome",
              size: 15,
              color: "white",
            }}
            onPress={() => navigation.push("Restaurant description")}

          />
        </View>
      </Card>

      <View style={styles.buttoncontainer}>
        <TouchableHighlight style={styles.spaced}>
          <Button
            style={styles.spaced}
            title="Back"
            onPress={() => {newRestaurantNameInput.current.clear(); newRestaurantPhoneInput.current.clear(); navigation.navigate("Home")}}
          />
        </TouchableHighlight>
      </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingVertical: 50,
    alignItems: "center",
  },
  buttoncontainer: {
    alignItems: "center",
    marginTop: 10,
  },
  spaced: {
    marginBottom: 10,
    width: 300,
  },
  spacedinput: {
    marginHorizontal: 40,
  },
  hori_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 10,
  },
});
