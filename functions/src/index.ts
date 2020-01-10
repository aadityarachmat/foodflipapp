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
  console.log("now: ", now);
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

  console.log("Time Normalized: ", timeNormalized);
  console.log(
    "Number of Recipients Normalized: ",
    numberOfRecipientsNormalized
  );
  console.log("Distance Normalized: ", distanceNormalized);

  const distanceScore: number = distanceNormalized * distanceCoefficient;
  const timeScore: number = timeNormalized * timeCoefficient;
  const numberOfRecipientsScore: number =
    numberOfRecipientsNormalized * numberOfRecipientsCoefficient;

  // console.log("Scores: ");
  // console.log(distanceScore, timeScore, numberOfRecipientsScore);

  const sum: number = distanceScore + timeScore + numberOfRecipientsScore;
  // console.log("Total score: ", sum);

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
    // console.log(`Recipient (ID: ${recipient}) Score: ${recipientScore}`);
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

export const onNewDelivery = functions.database
  .ref("/deliveries/{deliveryId}")
  .onCreate(async (snapshot, context) => {
    const deliveryData = snapshot.val();
    const deliveryId = context.params.deliveryId;
    const sender = deliveryData.sender;
    const index = 0;

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

    return snapshot.ref
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
