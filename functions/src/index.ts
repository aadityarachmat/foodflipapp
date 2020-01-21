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

  return distance;
}

// time since last delivery
async function getTimeSinceLastDelivery(recipientId: String): Promise<number> {
  /* await is required so that function is no longer pending when returned. 
    This allows time to be a Promise<number> instead of a promise*/
  const lastDeliveryTime: number = await admin
    .database()
    .ref(`lastDeliveryTime/${recipientId}`)
    .once("value")
    .then(snapshot => snapshot.val())
    .catch(err => err);

  const now: number = Date.now();
  const timeSinceLastDelivery: number = now - lastDeliveryTime;

  return timeSinceLastDelivery;
}

async function getNumberOfRecipients(recipientId: String): Promise<number> {
  // TODO: Rename "numberOfRecipients" to "numberOfIndividuals (also function name)"
  const numberOfRecipients: number = await admin
    .database()
    .ref(`/numberOfRecipients/${recipientId}`)
    .once("value")
    .then(snapshot => snapshot.val())
    .catch(err => err);

  return numberOfRecipients;
}

// minScore = distance >= maxDistance, max distance = 20
function getDistanceNormalized(distance: number): number {
  const maxDistance = 20;
  if (distance >= maxDistance) {
    return 0;
  } else {
    return 1 - distance / maxDistance;
  }
}

// maxScore = time >= twoWeeks
function getTimeNormalized(timeElapsed: number): number {
  const twoWeeks: number = 8.67 * (10 ^ 7) * 14;
  if (timeElapsed >= twoWeeks) {
    return 1;
  } else {
    return timeElapsed / twoWeeks;
  }
}

// maxScore = numberOfRecipients >= quantityFood
function getNumberOfRecipientsNormalized(
  numberOfRecipients: number,
  quantityFood: number
): number {
  if (numberOfRecipients >= quantityFood) {
    return 1;
  } else {
    return numberOfRecipients / quantityFood;
  }
}

async function getRecipientScore(
  outletId: String,
  recipientId: String,
  quantityFood: number,
  distanceCoefficient: number,
  timeCoefficient: number,
  numberOfRecipientsCoefficient: number
): Promise<number> {
  // Raw data
  const distance: number = await getDistance(outletId, recipientId);
  const time: number = await getTimeSinceLastDelivery(recipientId);
  const numberOfRecipients: number = await getNumberOfRecipients(recipientId);

  // Scores, Normalized (0-1)
  const distanceNormalized = getDistanceNormalized(distance);
  const timeNormalized = getTimeNormalized(time);
  const numberOfRecipientsNormalized = getNumberOfRecipientsNormalized(
    numberOfRecipients,
    quantityFood
  );

  const distanceScore: number = distanceNormalized * distanceCoefficient;
  const timeScore: number = timeNormalized * timeCoefficient;
  const numberOfRecipientsScore: number =
    numberOfRecipientsNormalized * numberOfRecipientsCoefficient;

  const sum: number = distanceScore + timeScore + numberOfRecipientsScore;

  return sum;
}

function getRecipientScores(
  outletId: String,
  recipients: Object,
  quantity: number
): Promise<void | { id: String; score: number }[]> {
  const recipientScores = [];
  const recipientIds: String[] = [];
  for (const recipient in recipients) {
    const recipientScore = getRecipientScore(
      outletId,
      recipient,
      quantity,
      1,
      1,
      1
    );
    recipientScores.push(recipientScore);
    recipientIds.push(recipient);
  }
  return Promise.all(recipientScores).then(settledScores => {
    const recipientIdsAndScores = [];
    for (let i = 0; i < settledScores.length; i++) {
      recipientIdsAndScores.push({
        id: recipientIds[i],
        score: settledScores[i]
      });
    }
    return recipientIdsAndScores;
  });
  // .catch(err => err);
}

function getSortedByScore(
  recipientScores: { id: String; score: number }[]
): { id: String; score: number }[] {
  const sortedScores = recipientScores;
  sortedScores.sort((a, b) => {
    if (a.score < b.score) {
      return 1;
    } else {
      return -1;
    }
  });
  return sortedScores;
}

// Pushes new message AND increments index
async function pushNewMessage(
  currentRecipient: { id: String; score: number },
  deliveryId: String,
  currentIndex: number
) {
  const recipientId: String = currentRecipient.id;
  const timePushed = Date.now();
  const index = currentIndex + 1;

  console.log("Pushed new message to recipient", recipientId);

  await admin
    .database()
    .ref(`/messages/${recipientId}`)
    .push()
    .set({ deliveryId, timePushed });

  await admin
    .database()
    .ref(`/deliveries/${deliveryId}`)
    .update({ index });
}

// async function pushNextMessage(deliveryId: String) {
//   const delivery = await admin
//     .database()
//     .ref(`/deliveries/${deliveryId}`)
//     .once("value")
//     .then(snap => {
//       return { value: snap.val(), key: snap.key };
//     });
//   const { value } = delivery;
//   let key: String = "";
//   if (delivery.key !== null) {
//     key = delivery.key;
//   }
//   const index = value.index;
//   const currentRecipient = value.sortedScores[index];
//   pushNewMessage(currentRecipient, key, index);
// }

// Does pushNextMessage every interval minutes
function startMessagesTimer(interval: number, deliveryId: String) {
  const timer = setInterval(async function() {
    const delivery = await admin
      .database()
      .ref(`/deliveries/${deliveryId}`)
      .once("value")
      .then(snap => {
        return { value: snap.val(), key: snap.key };
      });

    // Extract value, key from delivery
    const { value } = delivery;
    let key: String = "";
    if (delivery.key !== null) {
      key = delivery.key;
    }

    // Check if all recipients have been messaged
    const index = value.index;
    if (index >= value.sortedScores.length) {
      clearInterval(timer);
      return;
    }

    const currentRecipient = value.sortedScores[index];
    return pushNewMessage(currentRecipient, key, index);
  }, interval * 1000 * 60);
}

async function deleteOtherMessages(acceptedBy: String, deliveryId: String) {
  // acceptedBy = location which accepts
  const messagesRef = admin.database().ref("/messages");

  const messages = await messagesRef.once("value").then(snap => snap.val());

  // Message Keys = locationIds since messages are sorted by location
  const messagesKeys = Object.keys(messages);

  const promises = [];

  // Iterates through /messages/${locationId}
  for (let i = 0; i < messagesKeys.length; i++) {
    if (messagesKeys[i] === acceptedBy) {
      continue;
    }

    // Location = object containing individual messages for a location
    const locationRef = messagesRef.child(messagesKeys[i]);
    const location = await locationRef.once("value").then(snap => snap.val());

    const locationKeys = Object.keys(location);
    const locationValues: any = Object.values(location);

    // Iterates through /messages/${locationId}/${messageId}
    for (let j = 0; j < locationKeys.length; j++) {
      if (locationValues[j].deliveryId === deliveryId) {
        const removePromise = locationRef
          .child(locationKeys[j])
          .remove()
          .then(() => console.log("message deleted"));
        promises.push(removePromise);
      }
    }
  }

  return Promise.all(promises);
}

export const onNewDelivery = functions.database
  .ref("/deliveries/{deliveryId}")
  .onCreate(async (snapshot, context) => {
    const deliveryData = snapshot.val();
    const deliveryId = context.params.deliveryId;
    const sender = deliveryData.sender;
    let index = 0;

    const recipients = await admin
      .database()
      .ref("/Recipients")
      .once("value")
      .then(recipientSnapshot => recipientSnapshot.val());

    const recipientScores = await getRecipientScores(
      sender.location,
      recipients,
      deliveryData.quantity
    );

    // @ts-ignore
    const sortedScores = getSortedByScore(recipientScores);
    const currentRecipient = sortedScores[index];
    await pushNewMessage(currentRecipient, deliveryId, index);

    // Index is supposed to be incremented in pushNewMessage(),
    // but pushNewMessage() executes before the ref is updated below, so we have to manually increment the index
    index++; // TODO: cleanup

    // Start messages timer
    // First parameter = interval in minutes between messages
    startMessagesTimer(0.1, deliveryId);

    snapshot.ref
      .update({
        sortedScores,
        index
      })
      .catch(err => err);
  });

export const onUpdatedDelivery = functions.database
  .ref("/deliveries/{deliveryId}")
  .onUpdate((change, context) => {
    const before = change.before.val();
    const after = change.after.val();

    const deliveryId = context.params.deliveryId;

    if (after.acceptedBy && !before.acceptedBy) {
      return deleteOtherMessages(after.acceptedBy, deliveryId);
    }

    if (before.quantity === after.quantity) {
      console.log("Quantity unchanged, so no need to update");
      return;
    }

    const timeEdited = Date.now();

    return change.after.ref.update({
      timeEdited: timeEdited,
      orphanageList: "insert orphanage list value"
    });
  });
