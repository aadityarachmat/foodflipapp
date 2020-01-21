import React from "react";
import { connect } from "react-redux";
import { StyleSheet, Text, View, Button } from "react-native";
import * as firebase from "firebase";

class DetailsScreen extends React.Component {
  state = {
    locationValue: {},
    item: {}
  };

  componentDidMount() {
    const item = this.props.navigation.getParam("item");
    const { delivery } = item;
    console.log("item:", item);
    this.setState({ item });
    firebase
      .database()
      .ref("/Outlets/" + delivery.sender.location)
      .once("value")
      .then(locationSnapshot => locationSnapshot.val())
      .then(locationValue => this.setState({ locationValue }));
  }

  acceptDelivery = () => {
    const { userId } = this.props.user;
    const { deliveryId } = this.state.item;
    firebase
      .database()
      .ref("/deliveries/" + deliveryId)
      .update({ acceptedBy: userId });
    this.deleteOtherMessages();
  };

  deleteOtherMessages = async () => {
    const userLocation = this.props.user.location;
    const { deliveryId } = this.state.item;

    const messagesRef = firebase.database().ref("/messages");
    const messages = await messagesRef.once("value").then(snap => snap.val());

    // Message Keys = locationIds since messages are sorted by location
    const messagesKeys = Object.keys(messages);

    // Iterates through /messages/${locationId}
    for (let i = 0; i < messagesKeys.length; i++) {
      if (messagesKeys[i] === userLocation) {
        continue;
      }

      // Location = object containing individual messages for a location
      let locationRef = messagesRef.child(messagesKeys[i]);
      let location = await locationRef.once("value").then(snap => snap.val());

      console.log("location:", location);

      let locationKeys = Object.keys(location);
      let locationValues = Object.values(location);

      // Iterates through /messages/${locationId}/${messageId}
      for (let j = 0; j < locationKeys.length; i++) {
        if (locationValues[j].deliveryId === deliveryId) {
          locationRef.child(locationKeys[j]).remove();
        }
      }
    }

    console.log("finished deleting");
  };

  render() {
    const item = this.props.navigation.getParam("item");
    const { delivery, timePushed } = item;
    const { Address, Name, Retailer } = this.state.locationValue;
    const operationDetails = this.state.locationValue["Operation Details"];
    return (
      <View>
        <Text>Time Pushed: {timePushed}</Text>
        <Text>Location: {delivery.sender.location}</Text>
        <Text>Address: {Address}</Text>
        <Text>Name: {Name}</Text>
        <Text>Retailer: {Retailer}</Text>
        <Text>Operation Details: {operationDetails}</Text>
        <Text>Email: {delivery.sender.email}</Text>
        <Text>Name: {delivery.sender.name}</Text>
        <Text>Phone: {delivery.sender.phone}</Text>
        <Text>Note: {delivery.note}</Text>
        <Text>Quantity: {delivery.quantity}</Text>
        <Text>Unit: {delivery.unit}</Text>
        <Button title="Accept" onPress={() => this.acceptDelivery()}></Button>
      </View>
    );
  }
}

const mapStateToProps = state => state;
export default connect(mapStateToProps)(DetailsScreen);
