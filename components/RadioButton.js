import React from "react";
import { View } from "react-native";

export default class RadioButton extends React.Component {
  render() {
    return (
      <View
        style={[
          {
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: "#000",
            alignItems: "center",
            justifyContent: "center"
          },
          this.props.style
        ]}
      >
        {this.props.selected ? (
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: "#000"
            }}
          />
        ) : null}
      </View>
    );
  }
}
