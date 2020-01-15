import React from "react";
import { StyleSheet, KeyboardAvoidingView } from "react-native";
import * as firebase from "firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser } from "../actions/UserActions";

import LoginModule from "../components/LoginModule";
import ContinueSignupScreen from "./ContinueSignupScreen";

class SignupScreen extends React.Component {
  state = {
    name: "",
    phone: "",
    email: "",
    password: "",
    error: "",
    type: "outletStaff",
    location: "",
    shift: ""
  };

  setUserContainer = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const userId = user.uid;
        const database = firebase.database();
        database.ref("/users/" + user.uid).once("value", async snapshot => {
          let user = { ...snapshot.val(), userId };
          database
            .ref("/Outlets/" + snapshot.val().location)
            .once("value", locationSnapshot => {
              user.locationValue = locationSnapshot.val();
            });
          await this.props.setUser(user);
          this.props.navigation.navigate("Main");
        });
      } else {
        this.props.navigation.navigate("Login");
      }
    });
  };

  handleSignup() {
    const { location, email, password, name, phone, type, shift } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const user = firebase.auth().currentUser;
        firebase
          .database()
          .ref("users/" + user.uid)
          .set({
            name,
            phone,
            type,
            email,
            location,
            shift
          });
      })
      .then(this.setUserContainer())
      .catch(error => this.setState({ error: error.message }));
  }

  render() {
    return (
      <KeyboardAvoidingView style={style.body} behavior="padding" enabled>
        <ContinueSignupScreen
          onChangeName={name => this.setState({ name })}
          name={this.state.name}
          onChangePhone={phone => this.setState({ phone })}
          phone={this.state.phone}
          onSelectType={type => this.setState({ type })}
          onSelectLocation={location => this.setState({ location })}
          onSelectShift={shift => this.setState({ shift })}
        ></ContinueSignupScreen>
        <LoginModule
          onChangeEmail={email => this.setState({ email })}
          email={this.state.email}
          onChangePassword={password => this.setState({ password })}
          password={this.state.password}
          firstButtonAction={() => this.handleSignup()}
          firstButtonTitle="Sign Up"
          secondButtonAction={() => this.props.navigation.navigate("Login")}
          secondButtonTitle="Back to Login"
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

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setUser
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
