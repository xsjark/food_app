import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  Linking,
  Button,
  TextInput,
} from "react-native";
import * as firebase from "firebase";
import { Text, SearchBar, Divider, Chip } from "react-native-elements";

const callWhatsapp = (restaurant, phone) => {
  Linking.openURL(
    "whatsapp://send?text=" + "Hi, " + restaurant + "! " + "&phone=593" + phone
  ).catch(() => {
    Alert.alert("Make sure Whatsapp installed on your device");
  });
};

const Item = ({ name, phone, keywords }) => (
  <View style={styles.container}>
    <Image
      source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
      style={{ width: 100, height: 100 }}
    />
    <View style={styles.vert_container}>
      <Text h4 style={styles.spaced}>
        {name}
      </Text>

      <View style={styles.hori_container}>
        {typeof keywords !== "undefined" ? keywords.map((item) => (<Chip title={item} type="outline" titleStyle={{ fontSize: 10 }} containerStyle={{ margin: 2 }} />)) : <Text>No tags</Text> }
      </View>

      <Button
        style={styles.spaced}
        title="call"
        onPress={() => callWhatsapp(name, phone)}
      />
    </View>
  </View>
);

const RestaurantFlatList = () => {
  const renderItem = ({ item }) => (
    <Item
      name={item.restaurantName}
      phone={item.restaurantPhone}
      keywords={item.keyWords}
    />
  );

  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState(" ");
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = restaurants.filter(function (item) {
        const itemData = item.restaurantName
          ? item.restaurantName.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(restaurants);
      setSearch(text);
    }
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("restaurants")
      .orderBy("restaurantName")
      .onSnapshot(
        (snapshot) => {
          const restaurants = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRestaurants(restaurants);
        },
        (error) => alert(error)
      );
  },[]);

  return (
    <View style={styles.vert_container}>
      <SearchBar
        round
        searchIcon={{ size: 24 }}
        onChangeText={(text) => searchFilterFunction(text)}
        onClear={(text) => searchFilterFunction("")}
        placeholder="Type Here..."
        value={search}
        lightTheme
        containerStyle={{ backgroundColor: "white" }}
        inputContainerStyle={{ backgroundColor: "white" }}
      />
      <View style={styles.container}>
        <FlatList
          data={filteredDataSource.length === 0 ? restaurants : filteredDataSource}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    margin: 10,
  },
  vert_container: {
    flex: 1,
    marginHorizontal: 10,
    width: 400,
  },
  hori_container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 5,
    marginBottom: 10
  },
  item: {
    backgroundColor: "#f9c2ff",
  },
  spaced: {
    marginBottom: 10,
    marginHorizontal: 10,
    width: 240,
  },
  spacedinput: {
    marginHorizontal: 20,
    fontSize: 20,
    marginTop: 5,
  },
});

export default RestaurantFlatList;
