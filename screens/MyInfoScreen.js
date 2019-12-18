import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import * as firebase from "firebase";

export default class MyInfoScreen extends React.Component {
  state = {
    name: "",
    phone: "",
    email: "", // TODO Fix the thing
    type: "",
    location: {},
    shift: ""
  };

  componentDidMount() {
    // Check who we're logged in as
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const database = firebase.database();
        database.ref("/users/" + user.uid).once("value", snapshot => {
          console.log("snapshot");
          console.log(snapshot.val());
          this.setState({
            ...snapshot.val() // Sets all values from snapshot.val() to state
          });
          console.log("state: ");
          console.log(this.state);
          database
            .ref("/Outlets/" + snapshot.val().location)
            .once("value", locationSnapshot => {
              this.setState({
                location: locationSnapshot.val()
              });
              console.log("final state: ");
              console.log(this.state);
            });
        });
      } else {
        this.props.navigation.navigate("Login");
      }
    });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.header}>My Info</Text>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.field}>{this.state.name}</Text>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.field}>{this.state.phone}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.field}>{this.state.email}</Text>
        <Text style={styles.label}>Shift:</Text>
        <Text style={styles.field}>{this.state.shift}</Text>
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.field}>{this.state.type}</Text>

        <Text style={styles.label}>Location:</Text>
        <Text style={styles.field}>{this.state.location.Name}</Text>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.field}>{this.state.location.Address}</Text>
        <Text style={styles.label}>Retailer:</Text>
        <Text style={styles.field}>{this.state.location.Retailer}</Text>
        <Text style={styles.label}>Operation Details:</Text>
        <Text style={styles.field}>
          {this.state.location["Operation Details"]}
        </Text>
        <TouchableOpacity
          onPress={
            () =>
              firebase
                .auth()
                .signOut()
                .then(() => this.props.navigation.navigate("Login"))
            /* TODO: navigate back to login screen on press*/
          }
        >
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
