import React from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import * as firebase from "firebase";
import Constants from "expo-constants";

const { width } = Dimensions.get("window");

function getDayOfWeekString() {
  const today = new Date().getDay();
  if (today === 0) {
    return "Sunday";
  } else if (today === 1) {
    return "Monday";
  } else if (today === 2) {
    return "Tuesday";
  } else if (today === 3) {
    return "Wednesday";
  } else if (today === 4) {
    return "Thursday";
  } else if (today === 5) {
    return "Friday";
  } else if (today === 6) {
    return "Saturday";
  } else {
    return "Error!";
  }
}

function millisecondsToString(milliseconds) {
  let date = new Date(milliseconds);
  let time = date.getHours() + ":" + date.getMinutes();
  let dmy =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  return time + " " + dmy;
}

class Item extends React.Component {
  render() {
    const { delivery, timePushed } = this.props.item;
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          this.props.navigation.push("Details", {
            item: this.props.item,
            navigation: this.props.navigation
          })
        }
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            width: width,
            borderBottomColor: "#eee",
            borderBottomWidth: 1
          }}
        >
          {/* Icon */}
          <View
            style={{
              width: 50,
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 14
            }}
          >
            <View
              style={{
                backgroundColor: "maroon",
                height: 50,
                width: 50,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: "rgba(255,255,255,.5)",
                  fontSize: 24,
                  fontWeight: "700",
                  textAlign: "center"
                }}
              >
                {delivery.sender.location.charAt(0)}
              </Text>
            </View>
          </View>
          {/* Message Content */}
          <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
            {/* Sender Location */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start"
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "black",
                  fontWeight: "700",
                  textAlign: "center"
                }}
              >
                {delivery.sender.location}
              </Text>
              <Text style={{ fontSize: 12, color: "#3b60c4" }}>
                {millisecondsToString(timePushed)}
                {/* TODO: get when new delivery pushed to database */}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", paddingRight: 24, paddingTop: 2 }}
            >
              <View>
                <Text
                  style={{ fontWeight: "700" }}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {delivery.quantity} {delivery.unit}
                </Text>
                <Text
                  style={{ color: "gray", paddingTop: 2 }}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {delivery.note}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

class InboxScreen extends React.Component {
  state = {
    messages: [],
    deliveryIds: [],
    deliveries: []
  };

  componentDidMount() {
    if (this.props.user.shift === getDayOfWeekString()) {
      firebase
        .database()
        .ref(`/messages/${this.props.user.location}`)
        .on("value", async snapshot => {
          if (snapshot.exists()) {
            const messagesObject = snapshot.val();

            const messages = Object.keys(messagesObject).map(
              i => messagesObject[i]
            );
            this.setState({ messages }, () => {
              this.getDeliveries();
            });
          }
        });
    }
  }

  componentWillUnmount() {
    firebase
      .database()
      .ref(`/messages/${this.props.user.location}`)
      .off("value");
  }

  async getDeliveries() {
    const messages = this.state.messages;
    const deliveryPromises = [];
    for (message in messages) {
      const delivery = firebase
        .database()
        .ref(`/deliveries/${messages[message].deliveryId}`)
        .once("value")
        .then(function(snapshot) {
          return snapshot.val();
        });
      deliveryPromises.push(delivery);
    }
    const tempDeliveries = await Promise.all(deliveryPromises);
    const deliveries = [];
    // attaches time pushed to deliveries
    for (let i = 0; i < tempDeliveries.length; i++) {
      deliveries.push({
        delivery: tempDeliveries[i],
        timePushed: messages[i].timePushed,
        deliveryId: messages[i].deliveryId
      });
    }
    this.setState({ deliveries });
  }

  render() {
    DATA = [
      {
        title: "NEW DELIVERIES",
        data: this.state.deliveries
      }
    ];
    return (
      <View>
        <SectionList
          sections={DATA}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => (
            <Item
              item={item}
              index={index}
              navigation={this.props.navigation}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight
  },
  item: {
    padding: 20,
    borderBottomWidth: 0.25
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 2,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1
  },
  title: {
    fontSize: 24
  }
});

const mapStateToProps = state => state;
export default connect(mapStateToProps)(InboxScreen);
