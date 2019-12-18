import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as firebase from "firebase";

import CustomTextInput from "../components/CustomTextInput";

export default class NewDeliveryScreen extends React.Component {
  state = {
    quantity: "",
    note: ""
  };

  handleSignup() {
    const { quantity, note } = this.state;
    const database = firebase.database();

    // Get outlets, fill outlets array
    database.ref("/Outlets").once("value", snapshot => {
      let outlets = [];
      snapshot.forEach(childSnapshot => {
        const id = childSnapshot.key;
        // Get JS Object:
        const outlet = childSnapshot.val();
        const fullName = outlet.Retailer + " – " + outlet.Name;
        outlets.push({ id, fullName });
      });
      this.setState({ outlets });
    });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.title}>New Delivery</Text>
        <CustomTextInput
          secureTextEntry={false}
          placeholder="Quantity"
          autoCapitalize="none"
          onChangeText={text => this.setState({ quantity: text })}
          value={this.state.quantity}
          keyboardType="phone-pad"
          fieldTitle="Quantity"
        ></CustomTextInput>
        <CustomTextInput
          secureTextEntry={false}
          placeholder="Note"
          autoCapitalize="none"
          onChangeText={text => this.setState({ note: text })}
          value={this.state.note}
          multiline={true}
          numberOfLines={4}
          fieldTitle="Note"
        ></CustomTextInput>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: "bold",
    margin: 10
  }
});
