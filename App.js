import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import { Provider } from "react-redux";
import { createStore } from "redux";
import userReducer from "./reducers/UserReducer";

import * as firebase from "firebase";

import MainTabNavigator from "./screens/MainTabNavigator";
import LoginScreen from "./screens/LoginScreen.js";
import SignupScreen from "./screens/SignupScreen.js";

const store = createStore(userReducer);

/* 
  Firebase 
*/

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

firebase.initializeApp(firebaseConfig);
// firebase.analytics();

/*
  Navigation
*/

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
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
