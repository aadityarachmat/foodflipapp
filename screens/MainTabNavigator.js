import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { Ionicons, AntDesign } from "@expo/vector-icons"; // search expo vector icons to see full list

import * as firebase from "firebase";
import { connect } from "react-redux";

import NewDeliveryScreen from "./NewDeliveryScreen";
import InboxScreen from "./InboxScreen";
import MyInfoScreen from "./MyInfoScreen";
import { createAppContainer } from "react-navigation";

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

const InboxStack = createStackNavigator({
  Inbox: InboxScreen
});

InboxStack.navigationOptions = {
  tabBarLabel: "Inbox",
  tabBarIcon: ({ focused, horizontal, tintColor }) => (
    <Ionicons
      name={`ios-information-circle${focused ? "" : "-outline"}`} // conditional
      size={25}
      color={tintColor}
    />
  )
};

// const MainTabNavigator = createBottomTabNavigator({
//   ...(this.props.user.type === "outletStaff"
//     ? { NewDelivery: NewDeliveryStack }
//     : {}),
//   Inbox: InboxStack,
//   MyInfo: MyInfoScreen
// });

class MainTabNavigator extends React.Component {
  render() {
    const MainTabNavigator = createBottomTabNavigator({
      ...(this.props.user.type === "outletStaff"
        ? { NewDelivery: NewDeliveryStack }
        : {}),
      Inbox: InboxStack,
      MyInfo: MyInfoScreen
    });
    const AppContainer = createAppContainer(MainTabNavigator);
    return (
      <>
        <AppContainer />
      </>
    );
  }
}

const mapStateToProps = state => state;
export default connect(mapStateToProps)(MainTabNavigator);
