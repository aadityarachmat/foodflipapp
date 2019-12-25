import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";

class InboxScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Inbox</Text>
      </View>
    );
  }
}

const mapStateToProps = state => state;
export default connect(mapStateToProps)(InboxScreen);
