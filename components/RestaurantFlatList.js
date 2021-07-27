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
  RefreshControl
} from "react-native";
import * as firebase from "firebase";
import {
  Text,
  SearchBar,
  Divider,
  Chip,
  Card,
  Icon,
} from "react-native-elements";

const callWhatsapp = (restaurant, phone) => {
  Linking.openURL(
    "whatsapp://send?text=" + "Hi, " + restaurant + "! " + "&phone=593" + phone
  ).catch(() => {
    Alert.alert("Make sure Whatsapp installed on your device");
  });
};

const Item = ({ name, phone, keywords, id }) => {

  const current_id = firebase.auth().currentUser.uid;
  const [favourites,  setFavourites] = useState([])
  const [customer,  setCustomer] = useState([])

  useEffect(() => {
    firebase.firestore().collection("customers").doc(current_id).get()
        .then(snapshot => setCustomer(snapshot.data()))
  }, [])
  return (
    <View style={styles.container}>
    <Card>
      <View>
      <View style={styles.hori_titlecontainer}>
      <View>

        <Card.Title style={styles.spacedleft}>
          {name}
        </Card.Title >

        <View style={styles.hori_container}>
          {typeof keywords !== "undefined" ? (
            keywords
              .filter((item) => item !== name)
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
        </View>

        </View>
        <Icon
          name='shop'
          type='entypo'
          size={15}
          raised
          containerStyle={styles.spaced}
          color="#7CB342"
          reverse
        />
        </View>
        <Card.Divider />
        <Button
          style={styles.spaced}
          title="call"
          onPress={() => callWhatsapp(name, phone)}
        />
      </View>
    </Card>
  </View>
)};

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const RestaurantFlatList = () => {
  const renderItem = ({ item }) => (
    <Item
      name={item.restaurantName}
      phone={item.restaurantPhone}
      keywords={item.keyWords}
      id={item.id}
    />
  );

  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState(" ");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);


  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = restaurants.filter(function (item) {
        const itemData = item.restaurantName
          ? item.keyWords.toString().toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();

        const itemDataName = itemData.indexOf(textData) > -1;

        return itemDataName;
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
    searchFilterFunction("");
  }, []);

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
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
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
    wait(2000)
    .then(() => setRefreshing(false));
  }, []);



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
          data={
            filteredDataSource.length === 0 && search.length === 0
              ? restaurants
              : filteredDataSource.length === 0 && search.length > 0
              ? new Array()
              : filteredDataSource
          }
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
    alignItems: "center",
  },
  hori_container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    width: 250,
  },
  hori_titlecontainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    width: 300,
    justifyContent: "space-between",
  },
  item: {
    backgroundColor: "#f9c2ff",
  },
  spaced: {
    justifyContent:"center",
  },
  spacedleft: {
    justifyContent:"flex-start",
    textAlign: "left",
    marginLeft: 10
  },
  spacedinput: {
    fontSize: 20,
    marginTop: 5,
  },
});

export default RestaurantFlatList;
