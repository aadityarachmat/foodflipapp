import React from "react";
import { Text, Button, StyleSheet } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

import RadioButton from "../components/RadioButton";

export default class ContinueSignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radioSelected: "outletStaff"
    };
  }

  radioClick(id) {
    this.setState({
      radioSelected: id
    });
  }

  render() {
    // TODO: Add navigation to choose location, choose shift
    return (
      <>
        <TouchableOpacity onPress={() => this.radioClick("outletStaff")}>
          <Text>Outlet Staff</Text>
          <RadioButton
            selected={this.state.radioSelected === "outletStaff"}
          ></RadioButton>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.radioClick("recipient")}>
          <Text>Recipient</Text>
          <RadioButton
            selected={this.state.radioSelected === "recipient"}
          ></RadioButton>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.radioClick("foodFlipStaff")}>
          <Text>FoodFlip Staff</Text>
          <RadioButton
            selected={this.state.radioSelected === "foodFlipStaff"}
          ></RadioButton>
        </TouchableOpacity>
        <ChooseLocationButton radioSelected={this.state.radioSelected} />
        <Button title="Choose Shift"></Button>
        <TextInput
          style={styles.textfield}
          placeholder="Name"
          autoCapitalize="words"
        ></TextInput>
        <TextInput
          style={styles.textfield}
          placeholder="Phone Number"
          autoCapitalize="none"
          autoCompleteType="tel"
          keyboardType="phone-pad"
        ></TextInput>
      </>
    );
  }
}

class ChooseLocationButton extends React.Component {
  render() {
    if (this.props.radioSelected === "foodFlipStaff") {
      return null;
    }
    return <Button title="Choose Location"></Button>; // TODO: add destination
  }
}

const styles = StyleSheet.create({
  textfield: {
    borderWidth: 1,
    borderColor: "#aaaaaa",
    padding: 10,
    margin: 10,
    width: "60%",
    borderRadius: 5
  },
  body: {
    flex: 1,
    alignItems: "center" /* horizontal */,
    justifyContent: "center" /* vertical */
  },
  loginButton: {
    padding: 10,
    backgroundColor: "lightgreen",
    borderRadius: 10,
    width: 200,
    fontSize: 16,
    alignItems: "center",
    marginTop: 10
  },
  errorBox: {
    marginTop: 20,
    color: "red"
  }
});
