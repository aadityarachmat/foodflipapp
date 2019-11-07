import React from "react";
import { Text, View } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";

class NewDeliveryScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>New Delivery</Text>
      </View>
    );
  }
}

class InboxScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Inbox</Text>
      </View>
    );
  }
}

class MyInfoScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>My Info!</Text>
      </View>
    );
  }
}

const MainTabNavigator = createBottomTabNavigator({
  NewDelivery: NewDeliveryScreen,
  Inbox: InboxScreen,
  MyInfo: MyInfoScreen
});

export default MainTabNavigator;
