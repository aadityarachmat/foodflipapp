import React from "react";
import { View, Text, Button } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import MainTabNavigator from "./screens/MainTabNavigator";

class Login extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Login</Text>
        <Button
          title="Go to Main"
          onPress={() => this.props.navigation.navigate("Main")} // navigation prop is passed down to this component
          // can only call keys defined in createStackNavigator()
        />
      </View>
    );
  }
}

// class DetailsScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//         <Text>Details Screen</Text>
//         <Button
//           title="Go to Details... again"
//           onPress={() => this.props.navigation.push("Details")} // oqpens new component
//           // navigate checks if you're already at the destination, then push()es
//         />
//         <Button
//           title="Go to Home"
//           onPress={() => this.props.navigation.navigate("Home")}
//         />
//         <Button
//           title="Go back"
//           onPress={() => this.props.navigation.goBack()}
//         />
//       </View>
//     );
//   }
// }

const RootStack = createSwitchNavigator(
  {
    Login: Login,
    Main: MainTabNavigator
  },
  {
    initialRouteName: "Login"
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
