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
import { Text, SearchBar, Divider, Chip, Card } from "react-native-elements";

const callWhatsapp = (restaurant, phone) => {
  Linking.openURL(
    "whatsapp://send?text=" + "Hi, " + restaurant + "! " + "&phone=593" + phone
  ).catch(() => {
    Alert.alert("Make sure Whatsapp installed on your device");
  });
};

const Item = ({ name, phone, keywords }) => (
  <View style={styles.container}>
  <Card>
    <View style={styles.vert_container}>
      <Text h4 style={styles.spaced}>
        {name}
      </Text>
      <Card.Divider/>

      <View style={styles.hori_container}>
        {typeof keywords !== "undefined" ?
        keywords.map((item, index) => (<Chip title={item} key={index} type="outline" titleStyle={{ fontSize: 10 }} containerStyle={{ margin: 2 }} />))
        : <Text>No tags</Text> }
      </View>
      <Button
        style={styles.spaced}
        title="call"
        onPress={() => callWhatsapp(name, phone)}
      />
    </View>
    </Card>
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
          ? (item.restaurantName.toUpperCase(), item.keyWords.toString().toUpperCase())
          : "".toUpperCase();
        const textData = text.toUpperCase();

        const itemDataName = itemData.indexOf(textData) > -1


        return itemDataName ;
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
    searchFilterFunction("")
}, [])
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
          data={filteredDataSource.length === 0 && search.length === 0 ? restaurants
            : filteredDataSource.length === 0 && search.length > 0 ? new Array()
            : filteredDataSource
          }
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
    justifyContent: "center",
    alignItems: "center"

  },
  vert_container: {
    flex: 1,
    width: "100%"
  },
  hori_container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    width: 300

  },
  item: {
    backgroundColor: "#f9c2ff",
  },
  spaced: {
    marginBottom: 10,
  },
  spacedinput: {
    fontSize: 20,
    marginTop: 5,
  },
});

export default RestaurantFlatList;
