import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

export const onNewDelivery = functions.database
  .ref("/deliveries/{deliveryId}")
  .onCreate((snapshot, context) => {
    const deliveryId = context.params.deliveryId;
    console.log(`Delivery ID: ${deliveryId}`);

    const deliveryData = snapshot.val();
    const sender = deliveryData.sender;
    console.log(`Sender: ${sender}`);

    return admin
      .database()
      .ref("/Recipients")
      .once("value")
      .then(recipientSnapshot => recipientSnapshot.val())
      .then(recipients =>
        snapshot.ref.update({
          orphanageList: recipients
        })
      );
  });

export const onUpdatedDelivery = functions.database
  .ref("/deliveries/{deliveryId}")
  .onUpdate((change, context) => {
    const before = change.before.val();
    const after = change.after.val();

    if (before.quantity === after.quantity) {
      console.log("Quantity unchanged, so no need to update");
      return null;
    }

    const timeEdited = Date.now();

    return change.after.ref.update({
      timeEdited: timeEdited,
      orphanageList: "insert orphanage list value"
    });
  });

// export const onNewDelivery = functions.database
//   .ref("/deliveries/{deliveryId}")
//   .onWrite(async function(change) {
//     const after = change.after.val();

//     const recipients = await admin
//       .database()
//       .ref("/Recipients")
//       .once("value")
//       .then(function(snapshot) {
//         return snapshot.val();
//       });

//     console.log("After: " + after);
//     console.log("Recipients: " + recipients);

//     return recipients;
//   });
