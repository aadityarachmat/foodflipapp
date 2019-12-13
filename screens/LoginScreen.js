import React from "react";
import { StyleSheet, KeyboardAvoidingView } from "react-native";
import * as firebase from "firebase";
import LoginModule from "../components/LoginModule";

export default class LoginScreen extends React.Component {
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
      <KeyboardAvoidingView style={style.body} behavior="padding" enabled>
        <LoginModule
          onChangeEmail={email => this.setState({ email })}
          email={this.state.email}
          onChangePassword={password => this.setState({ password })}
          password={this.state.password}
          firstButtonAction={() => this.handleLogin()}
          firstButtonTitle="Log In"
          secondButtonAction={() => this.props.navigation.navigate("Signup")}
          secondButtonTitle="Sign Up"
          error={this.state.error}
        ></LoginModule>
      </KeyboardAvoidingView>
    );
  }
}

const style = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center" /* horizontal */,
    justifyContent: "center" /* vertical */
  }
});
