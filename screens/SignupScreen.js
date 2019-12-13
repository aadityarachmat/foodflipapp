import React from "react";
import { StyleSheet, KeyboardAvoidingView } from "react-native";
import * as firebase from "firebase";

import LoginModule from "../components/LoginModule";
import ContinueSignupScreen from "./ContinueSignupScreen";

export default class SignupScreen extends React.Component {
  state = {
    name: "",
    phone: "",
    email: "",
    password: "",
    error: "",
    type: "outletStaff"
  };

  handleSignup() {
    const { email, password, name, phone, type } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const user = firebase.auth().currentUser;
        this.props.navigation.navigate("Main");
        firebase
          .database()
          .ref("users/" + user.uid)
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

const style = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center" /* horizontal */,
    justifyContent: "center" /* vertical */
  }
});
