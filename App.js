import React from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import MainTabNavigator from "./screens/MainTabNavigator";

import * as firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";

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
      <View style={style.body}>
        <TextInput
          placeholder="email"
          autoCapitalize="none"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
          style={style.textfield}
        ></TextInput>
        <TextInput
          secureTextEntry
          placeholder="password"
          autocapitalize="none"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          style={[style.textfield, style.passwordfield]}
        ></TextInput>
        <TouchableOpacity
          onPress={() => this.handleLogin()}
          style={style.loginButton}
        >
          <Text>Login</Text>
        </TouchableOpacity>
        <Text style={style.errorBox}>{this.state.error}</Text>
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

const style = StyleSheet.create({
  textfield: {
    borderWidth: 1,
    borderColor: "#aaaaaa",
    padding: 10,
    margin: 10,
    width: "60%",
    borderRadius: 5
  },
  body: {
    flex: 1,
    alignItems: "center" /* horizontal */,
    justifyContent: "center" /* vertical */
  },
  loginButton: {
    padding: 10,
    backgroundColor: "lightgreen",
    borderRadius: 10,
    width: 200,
    fontSize: 16,
    alignItems: "center",
    marginTop: 10
  },
  errorBox: {
    marginTop: 20,
    color: "red"
  },
  passwordfield: {
    backgroundColor: "pink"
  }
});
