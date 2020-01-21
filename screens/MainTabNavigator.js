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
import DetailsScreen from "./DetailsScreen";
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
  Inbox: InboxScreen,
  Details: DetailsScreen
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

const tabScreens = {
  NewDelivery: NewDeliveryStack,
  Inbox: InboxStack,
  MyInfo: MyInfoScreen
};

// const MainTabNavigator = createBottomTabNavigator({
//   ...(this.props.user.type === "outletStaff"
//     ? { NewDelivery: NewDeliveryStack }
//     : {}),
//   Inbox: InboxStack,
//   MyInfo: MyInfoScreen
// });

const Navigator = createBottomTabNavigator(tabScreens);

// Other people's code, IDK what is going on here:
// Source: https://github.com/react-navigation/react-navigation/issues/717 (cmd F: alenia commented on Jan 27, 2018)
class MainTabNavigator extends React.Component {
  render() {
    const { navigation, features } = this.props;
    const navState = navigation.state;
    let filteredRoutes = navState.routes;
    if (this.props.user.type !== "outletStaff") {
      filteredRoutes = navState.routes.filter(r => {
        return r.key !== "NewDelivery";
      });
    }
    let activeIndex = filteredRoutes.findIndex((r, i) => {
      return r.routeName === navState.routes[navState.index].routeName;
    });

    if (activeIndex === -1) {
      activeIndex = 0;
    }

    return (
      <Navigator
        navigation={{
          ...navigation,
          state: {
            ...navigation.state,
            routes: filteredRoutes,
            index: activeIndex
          }
        }}
      />
    );
  }
}

MainTabNavigator.router = Navigator.router;

const mapStateToProps = state => state;
export default connect(mapStateToProps)(MainTabNavigator);
