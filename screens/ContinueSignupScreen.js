import React from "react";
import { Modal, Text, Button, StyleSheet, View, FlatList } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

import RadioButtonVertical from "../components/RadioButtonVertical";
import RadioButtonHorizontal from "../components/RadioButtonHorizontal";
import CustomTextInput from "../components/CustomTextInput";
import * as firebase from "firebase";

const shifts = [
  { day: "Monday", id: "Monday" },
  { day: "Tuesday", id: "Tuesday" },
  { day: "Wednesday", id: "Wednesday" },
  { day: "Thursday", id: "Thursday" },
  { day: "Friday", id: "Friday" },
  { day: "Saturday", id: "Saturday" },
  { day: "Sunday", id: "Sunday" }
];

export default class ContinueSignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radioSelected: "outletStaff",
      locationModalVisible: false,
      shiftModalVisible: false,
      outlets: [],
      recipients: [],
      locationSelected: "",
      shiftSelected: ""
    };
  }

  radioClick(id) {
    this.setState({
      radioSelected: id
    });
    this.props.onSelectType(id);
  }

  locationClick(item) {
    this.setState({ locationSelected: item.id });
    this.props.onSelectLocation(item.id);
  }

  shiftClick(item) {
    this.setState({ shiftSelected: item.id });
    this.props.onSelectShift(item.id);
  }

  componentDidMount() {
    // runs when component is loaded
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

    // Get recipients, fill recipients array
    database.ref("/Recipients").once("value", snapshot => {
      let recipients = [];
      snapshot.forEach(childSnapshot => {
        const id = childSnapshot.key;
        const recipient = childSnapshot.val();
        const fullName = recipient.Name;
        recipients.push({ id, fullName });
      });
      this.setState({ recipients });
    });
  }

  getData() {
    if (this.state.radioSelected === "outletStaff") {
      return this.state.outlets;
    }
    return this.state.recipients;
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
              <RadioButtonHorizontal
                onPress={() => this.locationClick(item)}
                selected={this.state.locationSelected === item.id}
                text={item.fullName}
              ></RadioButtonHorizontal>
            )}
            keyExtractor={item => item.id}
            extraData={this.state}
          ></FlatList>
          <Button
            onPress={() => this.setState({ locationModalVisible: false })}
            title="Close"
          ></Button>
        </Modal>

        <Modal visible={this.state.shiftModalVisible} animationType="slide">
          <Text style={{ paddingTop: 99 }}>Choose Shift</Text>
          <FlatList
            data={shifts}
            renderItem={({ item }) => (
              <RadioButtonHorizontal
                onPress={() => this.shiftClick(item)}
                selected={this.state.shiftSelected === item.id}
                text={item.day}
              ></RadioButtonHorizontal>
            )}
            keyExtractor={item => item.id}
            extraData={this.state}
          ></FlatList>
          <Button
            onPress={() => this.setState({ shiftModalVisible: false })}
            title="Close"
          ></Button>
        </Modal>

        <View style={styles.radioBox}>
          <RadioButtonVertical
            onPress={() => this.radioClick("outletStaff")}
            selected={this.state.radioSelected === "outletStaff"}
            text="Outlet Staff"
          ></RadioButtonVertical>
          <RadioButtonVertical
            onPress={() => this.radioClick("recipient")}
            selected={this.state.radioSelected === "recipient"}
            text="Recipient"
          ></RadioButtonVertical>
          <RadioButtonVertical
            onPress={() => this.radioClick("foodFlipStaff")}
            selected={this.state.radioSelected === "foodFlipStaff"}
            text="FoodFlip Staff"
          ></RadioButtonVertical>
        </View>

        <ChooseLocationButton
          radioSelected={
            this.state.radioSelected
          } /* See if radioSelected === foodFlipStaff */
          onPress={() => this.setState({ locationModalVisible: true })}
          title="Choose Location"
        />

        <Button
          onPress={() => this.setState({ shiftModalVisible: true })}
          title="Choose Shift"
        ></Button>

        <CustomTextInput
          fieldTitle="Name"
          placeholder="Name"
          autoCapitalize="words"
          value={this.props.name}
          onChangeText={this.props.onChangeName}
        />

        <CustomTextInput
          fieldTitle="Phone Number"
          placeholder="Phone Number"
          autoCapitalize="none"
          autoCompleteType="tel"
          keyboardType="phone-pad"
          value={this.props.phone}
          onChangeText={this.props.onChangePhone}
        />
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
      <Button title={this.props.title} onPress={this.props.onPress}></Button>
    ); // TODO: add destination
  }
}

const styles = StyleSheet.create({
  radioBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    bottom: 10
  },
  textfield: {
    borderWidth: 1,
    borderColor: "#aaaaaa",
    padding: 10,
    margin: 10,
    width: "60%"
  }
});
