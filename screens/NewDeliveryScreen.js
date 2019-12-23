import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Div } from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import * as firebase from "firebase";

import CustomTextInput from "../components/CustomTextInput";

const dropdownChoices = [
  {
    value: "pieces"
  },
  {
    value: "kg"
  }
];

export default class NewDeliveryScreen extends React.Component {
  state = {
    quantity: "",
    note: ""
  };

  handleSubmit() {
    const { quantity, note } = this.state;
    const database = firebase.database();

    // Get outlets, fill outlets array
    database.ref("/deliveries").push({
      quantity,
      note
    });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.title}>New Delivery</Text>
        <Dropdown
          label="Unit"
          data={dropdownChoices}
          containerStyle={styles.dropdownContainer}
        />
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.handleSubmit()}
        >
          <Text style={styles.buttonText}>Submit New Delivery</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: "bold",
    margin: 10
  },
  dropdownContainer: {
    width: "60%"
  },
  button: {
    padding: 10,
    backgroundColor: "black",
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
    width: "60%"
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  errorBox: {
    marginTop: 20,
    color: "red"
  }
});
