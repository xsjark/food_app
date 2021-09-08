import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, createRef } from "react";
import {
  List,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  RefreshControl,
  ScrollView,
  Linking,
} from "react-native";
import * as firebase from "firebase";
import { Button, Icon, Input, Card, Chip, CheckBox } from "react-native-elements";
import RestaurantDescriptionScreen from "./RestaurantDescriptionScreen";


const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const newRestaurantNameInput = React.createRef();
const newRestaurantPhoneInput = React.createRef();
const newOpenTimeInput = React.createRef();
const newCloseTimeInput = React.createRef();
const newRestaurantImageInput = React.createRef();

export default function ProfileScreen({ navigation }) {
  const current_id = firebase.auth().currentUser.uid;
  const [restaurant, setRestaurant] = useState([]);
  const [newRestaurantName, setNewRestaurantName] = useState("");
  const [newRestaurantImage, setNewRestaurantImage] = useState("");
  const [newRestaurantPhone, setNewRestaurantPhone] = useState("");
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

  const updateRestaurantImage = async () => {
    if (newRestaurantImage.length > 0) {
      firebase
        .firestore()
        .collection("restaurants")
        .doc(firebase.auth().currentUser.uid)
        .update({
          restaurantImage: newRestaurantImage,
        })
        .catch((error) => {
          alert("Error updating restaurant image: ", error);
        });
      alert("Restaurant image " + firebase.auth().currentUser.uid + " updated");
    } else {
      alert("Enter your restaurant's new image URL");
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
      if (validateHhMm(newOpenTime) && validateHhMm(newCloseTime)){
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
      alert("Use correct format e.g. 09:00")
    }
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
  }, [restaurant.restaurantName]);

  const  validateHhMm = input => {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(input);

    if (isValid) {
      return true;
    } else {
      return false;
    }
  }

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

  const callWhatsappMe = (restaurant, phone) => {
    Linking.openURL(
      "whatsapp://send?text=" + "Hola, Xsjark! " + "&phone=0962557378"
    ).catch(() => {
      Alert.alert("Make sure Whatsapp installed on your device");
    });
  };

  return (
    <View style={styles.container}>
      {restaurant.subscribed && 
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card containerStyle={styles.spaced}>
          <Card.Title>Nombre de restaurante</Card.Title>
          <Card.Divider />
          <Input
            placeholder={restaurant.restaurantName}
            value={newRestaurantName}
            onChangeText={(newRestaurantName) =>
              setNewRestaurantName(newRestaurantName)
            }
            ref={newRestaurantNameInput}
          />
            <Button
              buttonStyle={styles.button}
              titleStyle={{  color: "black" }}
              title="Guardar"
              onPress={() => {
                updateRestaurantName();
                onRefresh()
              }}
            />
        </Card>
        <Card containerStyle={styles.spaced}>
          <Card.Title>Imagen</Card.Title>
          <Card.Divider />
          <Card.Image source={{uri: restaurant.restaurantImage}} style={{ marginBottom: 10, resizeMode: "cover", height: 300, width:340}} containerStyle={{borderRadius: 10}}/>
          <Input
            placeholder={restaurant.restaurantImage}
            value={newRestaurantImage}
            onChangeText={(newRestaurantImage) =>
              setNewRestaurantImage(newRestaurantImage)
            }
            ref={newRestaurantImageInput}
            multiline
          />
            <Button
              buttonStyle={styles.button}
              titleStyle={{  color: "black" }}
              title="Guardar"
              onPress={() => {
                updateRestaurantImage();
              }}
            />
        </Card>
        <Card containerStyle={styles.spaced}>
          <Card.Title>Número de WhatsApp</Card.Title>
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

            <Button
              buttonStyle={styles.button}
              titleStyle={{  color: "black" }}
              title="Guardar"
              onPress={() => {
                updateRestaurantPhone();
              }}
            />
        </Card>

        <Card containerStyle={styles.spaced}>
          <Card.Title>Horarios de atención</Card.Title>
          <Card.Divider />

          <Input
            placeholder={restaurant.openTime}
            value={newOpenTime}
            onChangeText={(newOpenTime) => setNewOpenTime(newOpenTime)}
            ref={newOpenTimeInput}
            label="Desde (hh:mm)"
          />

          <Input
            placeholder={restaurant.closeTime}
            value={newCloseTime}
            onChangeText={(newCloseTime) => setNewCloseTime(newCloseTime)}
            ref={newCloseTimeInput}
            label="Hasta (hh:mm)"
          />

            <Button
              buttonStyle={styles.button}
              titleStyle={{  color: "black" }}
              title="Guardar"
              onPress={() => {
                updateOpenTime();
              }}
            />
        </Card>

        <Card containerStyle={styles.spaced}>
          <Card.Title>Días de atención</Card.Title>
          <Card.Divider />
          <Text>{workDays}</Text>
          <CheckBox
            title="Lunes"
            checked={mondayChecked}
            onPress={() => handleOnChange("Monday")}
          />
          <CheckBox
            title="Martes"
            checked={tuesdayChecked}
            onPress={() => handleOnChange("Tuesday")}
          />
          <CheckBox
            title="Miercoles"
            checked={wednesdayChecked}
            onPress={() => handleOnChange("Wednesday")}
          />
          <CheckBox
            title="Jueves"
            checked={thursdayChecked}
            onPress={() => handleOnChange("Thursday")}
          />
          <CheckBox
            title="Viernes"
            checked={fridayChecked}
            onPress={() => handleOnChange("Friday")}
          />
          <CheckBox
            title="Sabado"
            checked={saturdayChecked}
            onPress={() => handleOnChange("Saturday")}
          />
          <CheckBox
            title="Domingo"
            checked={sundayChecked}
            onPress={() => handleOnChange("Sunday")}
          />
          <Button
              buttonStyle={styles.button}
              titleStyle={{  color: "black" }}
              title="Guardar"
              onPress={() => {
                updateRestaurantDays();
              }}
            />
        </Card>
        {restaurant.restaurantName && <View >

        <Card containerStyle={styles.spaced}>
          <Card.Title>Palabras claves</Card.Title>
          <Card.Divider />
          <RestaurantDescriptionScreen />
              </Card>
              </View>}
      
      </ScrollView>
}
{!restaurant.subscribed && 
<Card containerStyle={styles.spaced}>
          <Card.Title>Suscríbase ya!</Card.Title>
          <Card.Divider />
          <Text>Póngase en contacto con nuestro departamento comercial para pedir presupuesto y consejo.</Text>

          <Button
          containerStyle={{width:"90%", marginTop: 20, marginBottom: 10, marginHorizontal: "5%", borderRadius: 10, }}
          buttonStyle={{backgroundColor: "#f4d03f"}}
          onPress={callWhatsappMe}
          icon={
            <Icon
          name='whatsapp'
          type='fontisto'
          size={20}
        />
          }
          raised
        />
        </Card>
}
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
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  spacedinput: {
    marginHorizontal: 40,
  },
  hori_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 10,
  },
  button: {
    backgroundColor: "#f4d03f",
    width:"95%", 
    marginTop: 10, 
    marginBottom: 10,
    borderRadius: 10, 
    alignSelf: "center",
    color: "black"
  }
});
