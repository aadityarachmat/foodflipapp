import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

async function getDistance(
  outletId: String,
  recipientId: String
): Promise<number> {
  let distance: number = await admin
    .database()
    .ref(`/distance/${outletId}/${recipientId}`)
    .once("value")
    .then(snapshot => snapshot.val())
    .catch(err => err);

  console.log(distance, "THIS IS THE DISTANCE");

  return distance;
}

export const onNewDelivery = functions.database
  .ref("/deliveries/{deliveryId}")
  .onCreate(async (snapshot, context) => {
    const deliveryId = context.params.deliveryId;
    console.log(`Delivery ID: ${deliveryId}`);

    const deliveryData = snapshot.val();
    const sender = deliveryData.sender;
    console.log(`Sender: ${sender}`);

    const distance = await getDistance("BATS", "Dorkas");

    console.log(distance, "GET THE DISTANCE");

    return admin
      .database()
      .ref("/Recipients")
      .once("value")
      .then(recipientSnapshot => recipientSnapshot.val())
      .then(recipients =>
        snapshot.ref.update({
          orphanageList: recipients,
          distance
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
