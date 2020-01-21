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
    const { location } = this.props.user;
    const { deliveryId } = this.state.item;
    firebase
      .database()
      .ref("/deliveries/" + deliveryId)
      .update({ acceptedBy: location });
  };

  render() {
    const item = this.props.navigation.getParam("item");
    const { delivery, timePushed } = item;
    const { Address, Name, Retailer } = this.state.locationValue;
    const operationDetails = this.state.locationValue["Operation Details"];
    console.log("user:", this.props.user);
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
