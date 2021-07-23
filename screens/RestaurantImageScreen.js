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
  Image,
} from "react-native";
import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function RestaurantImageScreen({ navigation }) {
  const current_id = firebase.auth().currentUser.uid;
  const [restaurantImage, setRestaurantImage] = useState("");
  const [uploading, setUploading] = useState(false);


  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    setRestaurantImage(pickerResult);
  };

  const getPictureBlob = (uri) => {
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', restaurantImage.uri, true);
    xhr.send(null);
  });
};

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: restaurantImage.uri }}
        style={{ height: 300, width: 300 }}
      />
      <TouchableHighlight style={styles.spacedinput}>
        <Button title="pick image" onPress={openImagePickerAsync} />
      </TouchableHighlight>

      <TouchableHighlight style={styles.spacedinput}>
        <Button title="save" onPress={() => console.log("Pressed")} />
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
