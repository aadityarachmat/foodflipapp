import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

async function getDistance(
  outletId: String,
  recipientId: String
): Promise<number> {
  const distance: number = await admin
    .database()
    .ref(`/distance/${outletId}/${recipientId}`)
    .once("value")
    .then(snapshot => snapshot.val())
    .catch(err => err);

  console.log(distance, "THIS IS THE DISTANCE");

  return distance;
}

// time since last delivery
async function getTimeSinceLastDelivery(recipientId: String): Promise<number> {
  /* await is required so that function is no longer pending when returned. 
    This allows time to be a Promise<number> instead of a promise*/
  const timeSinceLastDelivery: number = await admin
    .database()
    .ref(`timeSinceLastDelivery/${recipientId}`)
    .once("value")
    .then(snapshot => snapshot.val())
    .catch(err => err);

  return timeSinceLastDelivery;
}

async function getNumberOfRecipients(recipientId: String): Promise<number> {
  const numberOfRecipients: number = await admin
    .database()
    .ref(`/numberOfRecipients/${recipientId}`)
    .once("value")
    .then(snapshot => snapshot.val())
    .catch(err => err);

  return numberOfRecipients;
}

async function getRecipientScore(
  outletId: String,
  recipientId: String
): Promise<number> {
  const distance: number = await getDistance(outletId, recipientId);
  const timeSinceLastDelivery: number = await getTimeSinceLastDelivery(
    recipientId
  );
  const numberOfRecipients: number = await getNumberOfRecipients(recipientId);
  console.log("Scores: ");
  console.log(distance, timeSinceLastDelivery, numberOfRecipients);

  const sum: number = distance + timeSinceLastDelivery + numberOfRecipients;
  console.log("Total score: ", sum);

  return sum;
}

// async function getRecipientScores(
//   outletId: String,
//   recipients: Object
// ): Promise<Object> {
//   return recipientScores;
// }

export const onNewDelivery = functions.database // maintain async here, because subfunctions require async
  .ref("/deliveries/{deliveryId}")
  .onCreate(async (snapshot, context) => {
    const deliveryId = context.params.deliveryId;
    console.log(`Delivery ID: ${deliveryId}`);

    const deliveryData = snapshot.val();
    const sender = deliveryData.sender;
    console.log(`Sender: ${sender}`);

    const distance = await getDistance("BATS", "Dorkas");
    const timeSinceLastDelivery = await getTimeSinceLastDelivery("Dorkas");
    const numberOfRecipients = await getNumberOfRecipients("Dorkas");
    const score = await getRecipientScore("BATS", "Dorkas");

    const recipients = await admin
      .database()
      .ref("/Recipients")
      .once("value")
      .then(recipientSnapshot => recipientSnapshot.val());

    let recipientScores: Object = {};
    for (const recipient in recipients) {
      const recipientScore: number = await getRecipientScore("BATS", recipient);
      console.log(`Recipient (ID: ${recipient}) Score: ${recipientScore}`);
      // @ts-ignore
      recipientScores[recipient] = recipientScore;
    }

    // const recipientScores = await getRecipientScores("BATS", recipients);

    return snapshot.ref
      .update({
        orphanageList: recipients,
        distance,
        timeSinceLastDelivery,
        numberOfRecipients,
        score,
        recipientScores
      })
      .catch(err => err);
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
