import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class RadioButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.radioContainer}
        onPress={this.props.onPress}
      >
        <View style={styles.largerCircle} onPress={this.props.onPress}>
          {this.props.selected ? <View style={styles.smallerCircle} /> : null}
        </View>
        <Text>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "row",
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
