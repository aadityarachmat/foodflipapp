import React from "react";
import { StyleSheet, KeyboardAvoidingView } from "react-native";
import * as firebase from "firebase";
import LoginModule from "../components/LoginModule";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser } from "../actions/UserActions";

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
        const database = firebase.database();
        database.ref("/users/" + user.uid).once("value", snapshot => {
          let user = { ...snapshot.val() };
          database
            .ref("/Outlets/" + snapshot.val().location)
            .once("value", locationSnapshot => {
              user.location = locationSnapshot.val();
              this.props.setUser(user);
              console.log(this.props.user);
              this.props.navigation.navigate("Main");
            });
        });
      } else {
        this.props.navigation.navigate("Login");
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

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setUser
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
