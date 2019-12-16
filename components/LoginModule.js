import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";

import CustomTextInput from "./CustomTextInput.js";

export default class LoginModule extends React.Component {
  render() {
    return (
      <>
        <CustomTextInput
          fieldTitle="Email"
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={this.props.onChangeEmail}
          value={this.props.email}
        />
        <CustomTextInput
          fieldTitle="Password"
          secureTextEntry
          placeholder="Password"
          autocapitalize="none"
          onChangeText={this.props.onChangePassword}
          value={this.props.password}
        />
        <TouchableOpacity
          onPress={this.props.firstButtonAction}
          style={[style.loginButton, { marginTop: 20 }]}
        >
          <Text style={style.loginButtonText}>
            {this.props.firstButtonTitle}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.props.secondButtonAction}
          style={[style.loginButton, { top: 5, backgroundColor: "grey" }]}
        >
          <Text style={style.loginButtonText}>
            {this.props.secondButtonTitle}
          </Text>
        </TouchableOpacity>
        <Text style={style.errorBox}>{this.props.error}</Text>
      </>
    );
  }
}

const style = StyleSheet.create({
  textfield: {
    borderColor: "#aaaaaa",
    padding: 10,
    margin: 10,
    width: "60%"
  },
  loginButton: {
    padding: 10,
    backgroundColor: "black",
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
    width: "60%"
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  errorBox: {
    marginTop: 20,
    color: "red"
  }
});
