import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";

export default class LoginModule extends React.Component {
  render() {
    return (
      <>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={this.props.onChangeEmail}
          value={this.props.email}
          style={style.textfield}
        ></TextInput>
        <TextInput
          secureTextEntry
          placeholder="Password"
          autocapitalize="none"
          onChangeText={this.props.onChangePassword}
          value={this.props.password}
          style={style.textfield}
        ></TextInput>
        <TouchableOpacity
          onPress={this.props.firstButtonAction}
          style={style.loginButton}
        >
          <Text>{this.props.firstButtonTitle}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.secondButtonAction}>
          <Text>{this.props.secondButtonTitle}</Text>
        </TouchableOpacity>
        <Text style={style.errorBox}>{this.props.error}</Text>
      </>
    );
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
  }
});
