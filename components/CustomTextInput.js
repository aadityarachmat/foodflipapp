import React from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";

const CustomTextInput = props => {
  return (
    <>
      {props.value !== "" && (
        <Text style={styles.fieldTitle}>{props.fieldTitle}</Text>
      )}
      <TextInput
        {...props}
        autoCapitalize="none"
        style={[styles.textField, props.style]}
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
