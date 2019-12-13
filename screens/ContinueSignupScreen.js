import React from "react";
import { Modal, Text, Button, StyleSheet, View, FlatList } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

import RadioButton from "../components/RadioButton";
import * as firebase from "firebase";

var outlets = [];
var recipients = [];

export default class ContinueSignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radioSelected: "outletStaff",
      locationModalVisible: false,
      shiftModalVisible: false
    };
  }

  radioClick(id) {
    this.setState({
      radioSelected: id
    });
    this.props.onSelectType(id);
  }

  componentDidMount() {
    // runs when component is loaded
    const database = firebase.database();

    // Get outlets, fill outlets array
    database.ref("/Outlets").once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        // Get JS Object:
        const outlet = childSnapshot.val();
        const fullName = outlet.Retailer + " – " + outlet.Name;
        outlets.push(fullName);
      });
    });

    // Get recipients, fill recipients array
    database.ref("/Recipients").once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        const recipient = childSnapshot.val();
        const name = recipient.Name;
        recipients.push(name);
      });
    });
  }

  getData() {
    if (this.state.radioSelected === "outletStaff") {
      return outlets;
    }
    return recipients;
  }

  render() {
    // TODO: Add navigation to choose location, choose shift
    let data = this.getData();
    return (
      <>
        <Modal visible={this.state.locationModalVisible} animationType="slide">
          <Text style={{ paddingTop: 99 }}>Choose Location</Text>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <RadioButton selected={false} text={item}></RadioButton>
            )}
            keyExtractor={item => item}
          ></FlatList>
          <Button
            onPress={() => this.setState({ locationModalVisible: false })}
            title="Close"
          ></Button>
        </Modal>
        <View style={styles.radioBox}>
          <RadioButton
            onPress={() => this.radioClick("outletStaff")}
            selected={this.state.radioSelected === "outletStaff"}
            text="Outlet Staff"
          ></RadioButton>
          <RadioButton
            onPress={() => this.radioClick("recipient")}
            selected={this.state.radioSelected === "recipient"}
            text="Recipient"
          ></RadioButton>
          <RadioButton
            onPress={() => this.radioClick("foodFlipStaff")}
            selected={this.state.radioSelected === "foodFlipStaff"}
            text="FoodFlip Staff"
          ></RadioButton>
        </View>
        <ChooseLocationButton
          radioSelected={this.state.radioSelected}
          onPress={() => this.setState({ locationModalVisible: true })}
        />
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
    return (
      <Button title="Choose Location" onPress={this.props.onPress}></Button>
    ); // TODO: add destination
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
  }
});
