import React from "react";
import { Text, View } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { Ionicons, AntDesign } from "@expo/vector-icons"; // search expo vector icons to see full list

class NewDeliveryScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>New Delivery</Text>
      </View>
    );
  }
}

const NewDeliveryStack = createStackNavigator({
  NewDelivery: NewDeliveryScreen
});

NewDeliveryStack.navigationOptions = {
  tabBarLabel: "New Delivery",
  tabBarIcon: ({ focused, horizontal, tintColor }) => (
    <Ionicons
      name={`ios-information-circle${focused ? "" : "-outline"}`} // conditional
      size={25}
      color={tintColor}
    />
  )
};

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
  NewDelivery: NewDeliveryStack,
  Inbox: InboxScreen,
  MyInfo: MyInfoScreen
});

export default MainTabNavigator;
