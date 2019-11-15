import React from "react";
import { View, Text, Button, TextInput } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import MainTabNavigator from "./screens/MainTabNavigator";

import * as firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyCqvpP5fwKUghPZC1WQVlZmsMjE9sj1mTQ",
  authDomain: "foodflip-272d2.firebaseapp.com",
  databaseURL: "https://foodflip-272d2.firebaseio.com",
  projectId: "foodflip-272d2",
  storageBucket: "foodflip-272d2.appspot.com",
  messagingSenderId: "549185509633",
  appId: "1:549185509633:web:2a82cd8cf7efe7bac0e300",
  measurementId: "G-CEZ1XD22DG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    error: ""
  };

  handleLogin() {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate("Main"))
      .catch(error => this.setState({ error: error.message }));
    console.log("handleLogin");
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <TextInput
          placeholder="email"
          autoCapitalize="none"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        ></TextInput>
        <TextInput
          secureTextEntry
          placeholder="password"
          autocapitalize="none"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        ></TextInput>
        <Button
          title="Login"
          onPress={() => this.handleLogin()} // navigation prop is passed down to this component
          // can only call keys defined in createStackNavigator()
        />
        <Text>{this.state.error}</Text>
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
