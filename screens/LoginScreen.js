import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Appearance,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import * as firebase from "firebase";
import { Button, Text, } from "react-native-elements";

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .firestore()
          .collection("customers")
          .doc(firebase.auth().currentUser.uid)
          .update({
            updated: Date.now()
          })
          .catch((error) => {
            console.error("Error creating user: ", error);
          });
        console.log("User "+firebase.auth().currentUser.uid+" logged in");
      })
      .catch((error) => alert(error));
  };

  const handleSignUp = async () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        handleLogin();
      })
      .then(() => {
        firebase
          .firestore()
          .collection("customers")
          .doc(firebase.auth().currentUser.uid)
          .set({
            email: email
          })
          .catch((error) => {
            console.error("Error creating user: ", error);
          });
        console.log("User "+firebase.auth().currentUser.uid+" created");
      })
      .then(() => {
        firebase
          .firestore()
          .collection("restaurants")
          .doc(firebase.auth().currentUser.uid)
          .set({
            email: email
          })
          .catch((error) => {
            console.error("Error creating user restaurant: ", error);
          });
        console.log("User restaurant "+firebase.auth().currentUser.uid+" created");
      })
      .catch((error) => alert(error));
  };

  const passwordResetEmail = () => {
    firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      alert("Password reset email sent to: " + email)
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage)
    });
  }

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.spacedinput}
        placeholder="Usuario"
        value={email}
        onChangeText={(email) => setEmail(email)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.spacedinput}
        placeholder="Contraseña"
        value={password}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableHighlight style={styles.spacedinput}>
      <Button
        style={styles.spacedinput}
        title="Iniciar sesión"
        onPress={handleLogin}
        buttonStyle={styles.button}
      titleStyle={{color: "black"}}
      />
      </TouchableHighlight>
      <TouchableHighlight style={styles.spacedinput} >
        <Button title="Registrar" buttonStyle={styles.button}
      titleStyle={{color: "black"}} onPress={handleSignUp} />
      </TouchableHighlight>
      <TouchableHighlight style={styles.spacedinput}>
        <Button title="Restablecer la contraseña" buttonStyle={styles.button}
      titleStyle={{color: "black"}} onPress={passwordResetEmail} />
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
    alignItems: 'center'
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
