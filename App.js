import React from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import MainTabNavigator from "./screens/MainTabNavigator";

import * as firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";

import LoginModule from "./components/LoginModule";
import ContinueSignupScreen from "./screens/ContinueSignupScreen";

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

class LoginScreen extends React.Component {
  state = {
    email: "",
    password: "",
    error: ""
  };

  componentDidMount() {
    // Runs if the page loads
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate("Main");
      }
    });
  }

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
        <LoginModule
          onChangeEmail={email => this.setState({ email })}
          email={this.state.email}
          onChangePassword={password => this.setState({ password })}
          email={this.state.email}
          firstButtonAction={() => this.handleLogin()}
          firstButtonTitle="Log In"
          secondButtonAction={() => this.props.navigation.navigate("Signup")}
          secondButtonTitle="Sign Up"
          error={this.state.error}
        ></LoginModule>
      </View>
    );
  }
}

class SignupScreen extends React.Component {
  state = {
    name: "",
    phone: "",
    email: "",
    password: "",
    error: "",
    type: "outletStaff"
  };

  handleSignup() {
    // console.log(this.state);
    const { email, password, name, phone, type } = this.state;
    const safeEmail = email.replace("@", "(at)").replace(".", "(dot)");
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.navigate("Main");
        firebase
          .database()
          .ref("users/" + safeEmail)
          .set({
            name,
            phone,
            type,
            email
          });
      })
      .catch(error => this.setState({ error: error.message }));
    console.log("handleLogin");
  }

  render() {
    return (
      <KeyboardAvoidingView style={style.body} behavior="padding" enabled>
        <ContinueSignupScreen
          onChangeName={name => this.setState({ name })}
          onChangePhone={phone => this.setState({ phone })}
          onSelectType={type => this.setState({ type })}
        ></ContinueSignupScreen>
        <LoginModule
          onChangeEmail={email => this.setState({ email })}
          email={this.state.email}
          onChangePassword={password => this.setState({ password })}
          email={this.state.email}
          firstButtonAction={() => this.handleSignup()}
          firstButtonTitle="Sign Up"
          secondButtonAction={() => this.props.navigation.navigate("Login")}
          secondButtonTitle="Login"
          error={this.state.error}
        ></LoginModule>
      </KeyboardAvoidingView>
    );
  }
}

const RootStack = createSwitchNavigator(
  {
    Login: LoginScreen,
    Signup: SignupScreen,
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
  body: {
    flex: 1,
    alignItems: "center" /* horizontal */,
    justifyContent: "center" /* vertical */
  }
});
