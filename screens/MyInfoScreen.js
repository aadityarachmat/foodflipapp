import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";

import * as firebase from "firebase";

class MyInfoScreen extends React.Component {
  state = {
    name: "",
    phone: "",
    email: "", // TODO Fix the thing
    type: "",
    location: "",
    shift: "",
    locationValue: {}
  };

  LocationValue = () => {
    if (this.props.user.locationValue !== undefined) {
      const { Name, Address, Retailer } = this.props.user.locationValue;
      return (
        <>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.field}>{Name}</Text>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.field}>{Address}</Text>
          <Text style={styles.label}>Retailer:</Text>
          <Text style={styles.field}>{Retailer}</Text>
          <Text style={styles.label}>Operation Details:</Text>
          <Text style={styles.field}>
            {this.props.user.locationValue["Operation Details"]}
          </Text>
        </>
      );
    } else {
      return;
    }
  };

  render() {
    console.log(this.props);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.header}>My Info</Text>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.field}>{this.props.user.name}</Text>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.field}>{this.props.user.phone}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.field}>{this.props.user.email}</Text>
        <Text style={styles.label}>Shift:</Text>
        <Text style={styles.field}>{this.props.user.shift}</Text>
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.field}>{this.props.user.type}</Text>
        {this.LocationValue()}
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

const mapStateToProps = state => state;

export default connect(mapStateToProps)(MyInfoScreen);
