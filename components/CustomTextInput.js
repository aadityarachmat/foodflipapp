import React from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";

const CustomTextInput = props => {
  return (
    <>
      {props.value !== "" && (
        <Text style={styles.fieldTitle}>{props.fieldTitle}</Text>
      )}
      <TextInput
        secureTextEntry={props.secureTextEntry}
        placeholder={props.placeholder}
        autoCapitalize="none"
        onChangeText={props.onChangeText}
        value={props.value}
        keyboardType={props.keyboardType}
        style={styles.textField}
      ></TextInput>
    </>
  );
};

export default CustomTextInput;

styles = StyleSheet.create({
  textField: {
    borderBottomWidth: 1,
    borderColor: "#aaaaaa",
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: 8,
    width: "60%"
  },
  fieldTitle: {
    color: "darkblue",
    width: "60%"
  }
});
