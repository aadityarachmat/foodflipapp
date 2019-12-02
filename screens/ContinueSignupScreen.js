import React from "react";
import { Text, Button, StyleSheet, View } from "react-native";
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
    this.props.onSelectType(id);
  }

  render() {
    // TODO: Add navigation to choose location, choose shift
    return (
      <>
        <View style={styles.radioBox}>
          <TouchableOpacity
            onPress={() => this.radioClick("outletStaff")}
            style={styles.radioContainer}
          >
            <RadioButton
              selected={this.state.radioSelected === "outletStaff"}
            ></RadioButton>
            <Text>Outlet Staff</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.radioClick("recipient")}
            style={styles.radioContainer}
          >
            <RadioButton
              selected={this.state.radioSelected === "recipient"}
            ></RadioButton>
            <Text>Recipient</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.radioClick("foodFlipStaff")}
            style={styles.radioContainer}
          >
            <RadioButton
              selected={this.state.radioSelected === "foodFlipStaff"}
            ></RadioButton>
            <Text>FoodFlip Staff</Text>
          </TouchableOpacity>
        </View>
        <ChooseLocationButton radioSelected={this.state.radioSelected} />
        <Button title="Choose Shift"></Button>
        <TextInput
          style={styles.textfield}
          onChangeText={this.props.onChangeName}
          placeholder="Name"
          autoCapitalize="words"
        ></TextInput>
        <TextInput
          style={styles.textfield}
          onChangeText={this.props.onChangePhone}
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
  radioBox: {
    width: "50%"
  },
  textfield: {
    borderWidth: 1,
    borderColor: "#aaaaaa",
    padding: 10,
    margin: 10,
    width: "60%",
    borderRadius: 5
  },
  radioContainer: {
    flexDirection: "row"
  }
});
