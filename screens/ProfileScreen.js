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
import { Input, Card, Chip, CheckBox } from "react-native-elements";
import RestaurantDescriptionScreen from "./RestaurantDescriptionScreen";


const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const newRestaurantNameInput = React.createRef();
const newRestaurantPhoneInput = React.createRef();
const newOpenTimeInput = React.createRef();
const newCloseTimeInput = React.createRef();

export default function ProfileScreen({ navigation }) {
  const current_id = firebase.auth().currentUser.uid;
  const [restaurant, setRestaurant] = useState([]);
  const [newRestaurantName, setNewRestaurantName] = useState("");
  const [newRestaurantPhone, setNewRestaurantPhone] = useState("");
  const [newRestaurantKeyWords, setNewRestaurantKeyWords] = useState([]);
  const [newOpenTime, setNewOpenTime] = useState("");
  const [newCloseTime, setNewCloseTime] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [mondayChecked, setMondayChecked] = useState(false);
  const [tuesdayChecked, setTuesdayChecked] = useState(false);
  const [wednesdayChecked, setWednesdayChecked] = useState(false);
  const [thursdayChecked, setThursdayChecked] = useState(false);
  const [fridayChecked, setFridayChecked] = useState(false);
  const [saturdayChecked, setSaturdayChecked] = useState(false);
  const [sundayChecked, setSundayChecked] = useState(false);
  const [workDays, setWorkDays] = useState([]);

  const updateRestaurantName = async () => {
    if (newRestaurantName.length > 0 ) {
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
              keyWords:
                restaurant.keyWords ? restaurant.keyWords
                  .concat(newRestaurantName)
                  .filter((item) => item !== restaurant.restaurantName)
                : [newRestaurantName]
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
    if (newRestaurantPhone.length > 0) {
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

  const updateOpenTime = async () => {
    if (newOpenTime.length !== 0 && newCloseTime.length !== 0) {
      firebase
        .firestore()
        .collection("restaurants")
        .doc(firebase.auth().currentUser.uid)
        .update({
          openTime: newOpenTime,
          closeTime: newCloseTime,
        })
        .catch((error) => {
          alert("Error updating restaurant hours: ", error);
        });
      alert("Restaurant hours" + firebase.auth().currentUser.uid + " updated");
    } else {
      alert("Enter your restaurant's new hours");
    }
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("restaurants")
      .doc(current_id)
      .get()
      .then((snapshot) => {
        setRestaurant(snapshot.data())
        setMondayChecked(snapshot.data().days[0])
        setTuesdayChecked(snapshot.data().days[1])
        setWednesdayChecked(snapshot.data().days[2])
        setThursdayChecked(snapshot.data().days[3])
        setFridayChecked(snapshot.data().days[4])
        setSaturdayChecked(snapshot.data().days[5])
        setSundayChecked(snapshot.data().days[6])
      });
  }, []);

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
    newOpenTimeInput.current.clear();
    newCloseTimeInput.current.clear();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const handleOnChange = (day) => {
    switch (day) {
      case "Monday":
        setMondayChecked(!mondayChecked);
        break;
      case "Tuesday":
        setTuesdayChecked(!tuesdayChecked);
        break;
      case "Wednesday":
        setWednesdayChecked(!wednesdayChecked);
        break;
      case "Thursday":
        setThursdayChecked(!thursdayChecked);
        break;
      case "Friday":
        setFridayChecked(!fridayChecked);
        break;
      case "Saturday":
        setSaturdayChecked(!saturdayChecked);
        break;
      case "Sunday":
        setSundayChecked(!sundayChecked);
        break;
    }
  };

  const updateRestaurantDays = () => {
    firebase
      .firestore()
      .collection("restaurants")
      .doc(firebase.auth().currentUser.uid)
      .update({days: {
        0: mondayChecked, //Monday
        1: tuesdayChecked,
        2: wednesdayChecked,
        3: thursdayChecked,
        4: fridayChecked,
        5: saturdayChecked,
        6: sundayChecked,}
      })
      .catch((error) => {
        alert("Error updating restaurant days: ", error);
      });
    alert("Restaurant days" + firebase.auth().currentUser.uid + " updated");
  }

  useEffect(() => {
    if (restaurant.days){
      setMondayChecked(restaurant.days[0])
      setTuesdayChecked(restaurant.days[1])
      setWednesdayChecked(restaurant.days[2])
      setThursdayChecked(restaurant.days[3])
      setFridayChecked(restaurant.days[4])
      setThursdayChecked(restaurant.days[5])
      setFridayChecked(restaurant.days[6])
    } else {
      null
    }
  },[])

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card containerStyle={styles.spaced}>
          <Card.Title>Restaurant name</Card.Title>
          <Card.Divider />
          <Input
            placeholder={restaurant.restaurantName}
            value={newRestaurantName}
            onChangeText={(newRestaurantName) =>
              setNewRestaurantName(newRestaurantName)
            }
            ref={newRestaurantNameInput}
          />
          <TouchableHighlight>
            <Button
              style={styles.spaced}
              title="Save"
              onPress={() => {
                updateRestaurantName();
              }}
            />
          </TouchableHighlight>
        </Card>

        <Card containerStyle={styles.spaced}>
          <Card.Title>Restaurant phone</Card.Title>
          <Card.Divider />
          <Input
            placeholder={restaurant.restaurantPhone}
            value={newRestaurantPhone}
            onChangeText={(newRestaurantPhone) =>
              setNewRestaurantPhone(newRestaurantPhone)
            }
            ref={newRestaurantPhoneInput}
            keyboardType="numeric"
          />

          <TouchableHighlight>
            <Button
              style={styles.spaced}
              title="Save"
              onPress={() => {
                updateRestaurantPhone();
              }}
            />
          </TouchableHighlight>
        </Card>

        <Card containerStyle={styles.spaced}>
          <Card.Title>Restaurant hours</Card.Title>
          <Card.Divider />

          <Input
            placeholder={restaurant.openTime}
            value={newOpenTime}
            onChangeText={(newOpenTime) => setNewOpenTime(newOpenTime)}
            ref={newOpenTimeInput}
            label="open (hh:mm)"
          />

          <Input
            placeholder={restaurant.closeTime}
            value={newCloseTime}
            onChangeText={(newCloseTime) => setNewCloseTime(newCloseTime)}
            ref={newCloseTimeInput}
            label="close (hh:mm)"
          />

          <TouchableHighlight>
            <Button
              style={styles.spaced}
              title="Save"
              onPress={() => {
                updateOpenTime();
              }}
            />
          </TouchableHighlight>
        </Card>

        <Card containerStyle={styles.spaced}>
          <Card.Title>Restaurant days</Card.Title>
          <Card.Divider />
          <Text>{workDays}</Text>
          <CheckBox
            title="Monday"
            checked={mondayChecked}
            onPress={() => handleOnChange("Monday")}
          />
          <CheckBox
            title="Tuesday"
            checked={tuesdayChecked}
            onPress={() => handleOnChange("Tuesday")}
          />
          <CheckBox
            title="Wednesday"
            checked={wednesdayChecked}
            onPress={() => handleOnChange("Wednesday")}
          />
          <CheckBox
            title="Thursday"
            checked={thursdayChecked}
            onPress={() => handleOnChange("Thursday")}
          />
          <CheckBox
            title="Friday"
            checked={fridayChecked}
            onPress={() => handleOnChange("Friday")}
          />
          <CheckBox
            title="Saturday"
            checked={saturdayChecked}
            onPress={() => handleOnChange("Saturday")}
          />
          <CheckBox
            title="Sunday"
            checked={sundayChecked}
            onPress={() => handleOnChange("Sunday")}
          />
          <TouchableHighlight>
            <Button
              style={styles.spaced}
              title="Save"
              onPress={() => {
                updateRestaurantDays();
              }}
            />
          </TouchableHighlight>
        </Card>

        <Card containerStyle={styles.spaced}>
          <Card.Title>Restaurant description</Card.Title>
          <Card.Divider />
              <RestaurantDescriptionScreen />
              </Card>
        <View style={styles.buttoncontainer}>
          <TouchableHighlight style={styles.spaced}>
            <Button
              style={styles.spaced}
              title="Back"
              onPress={() => {
                newRestaurantNameInput.current.clear();
                newRestaurantPhoneInput.current.clear();
                navigation.navigate("Home");
              }}
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
    paddingVertical: 20,
    alignItems: "center",
  },
  buttoncontainer: {
    alignItems: "center",
    marginTop: 10,
  },
  spaced: {
    marginBottom: 10,
    width: 350,
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
