import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class RadioButtonVertical extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.radioContainer}
        onPress={this.props.onPress}
      >
        <Text>{this.props.text}</Text>
        <View style={styles.largerCircle} onPress={this.props.onPress}>
          {this.props.selected ? <View style={styles.smallerCircle} /> : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "column",
    alignItems: "center"
  },
  largerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center"
  },
  smallerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#000"
  }
});
