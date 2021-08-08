import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  Linking,
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
  Button,
} from "react-native-elements";

const callWhatsapp = (restaurant, phone) => {
  Linking.openURL(
    "whatsapp://send?text=" + "Hi, " + restaurant + "! " + "&phone=593" + phone
  ).catch(() => {
    Alert.alert("Make sure Whatsapp installed on your device");
  });
};

const Item = ({ name, phone, keywords, id, openTime, closeTime, timeNow, days, dayNow, image }) => {

  const current_id = firebase.auth().currentUser.uid;
  const [favourites,  setFavourites] = useState([])
  const [customer,  setCustomer] = useState([])
  const [isOpen,  setIsOpen] = useState(false)

  useEffect(() => {
    firebase.firestore().collection("customers").doc(current_id).get()
        .then(snapshot => setCustomer(snapshot.data()))
  }, [])

  useEffect (() => {
    if (timeNow >= openTime && timeNow <= closeTime && days[dayNow]){
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  })


  return (
    <View style={styles.container}>
    <Card containerStyle={{borderRadius: 5, backgroundColor: "white", height: "95%", padding: 0}}>
    <Card.Image source={{uri: image}} style={{ margin: 0, resizeMode: "cover", height: 300, width:340}} containerStyle={{borderRadius:5,}}/>
      <View>

      <View style={styles.hori_titlecontainer}>
      <View>
        <Card.Title style={styles.spacedleft}>
          {name}
        </Card.Title >

        <View style={styles.hori_container}>
          { keywords.length > 1  ? (
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
          color={isOpen ? "#8BC34A" : "gray"}
          reverse
        />
        <Button
          containerStyle={{width:"90%", marginTop: 20, marginHorizontal: "5%"}}
          title="call"
          onPress={() => callWhatsapp(name, phone)}
        />
        
        </View>

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
      name={item.restaurantName ? item.restaurantName : null}
      phone={item.restaurantPhone ? item.restaurantPhone : null}
      keywords={item.keyWords ? item.keyWords: ["no keywords"]}
      id={item.id}
      openTime={item.openTime ? item. openTime : "00:00"}
      closeTime={item.closeTime ? item.closeTime : "00:00"}
      days={item.days ? item.days : []}
      timeNow={new Date().toTimeString().split(' ')[0]}
      dayNow={new Date().getDay()}
      image={item.restaurantImage ? item.restaurantImage : "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"}
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
  },[]);

  return (
    <View style={styles.vert_container}>
      <SearchBar
        round
        searchIcon={{ size: 24 }}
        onChangeText={(text) => searchFilterFunction(text)}
        onClear={(text) => searchFilterFunction("")}
        placeholder="Search"
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
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom:0,
  },
  hori_container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 10,
    width: 269,
  },
  hori_titlecontainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    top: -30,
    backgroundColor: "white",
    width: 340,
    marginHorizontal: 0,
    borderRadius: 5
  },
  item: {
    backgroundColor: "#f9c2ff",
  },
  spaced: {
    justifyContent:"center",
    marginRight: 10,
    marginTop: 10,
  },
  spacedleft: {
    justifyContent:"flex-start",
    textAlign: "left",
    marginLeft: 15,
    marginTop: 15,
  },
  spacedinput: {
    fontSize: 20,
    marginTop: 5,
  },
});

export default RestaurantFlatList;
