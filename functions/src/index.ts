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

function getTimeNormalized(timeElapsed: number): number {
  const twoWeeks: number = 8.67 * (10 ^ 7) * 14;
  if (timeElapsed > twoWeeks) {
    return 1;
  } else {
    return timeElapsed / twoWeeks;
  }
}

function getNumberOfRecipientsNormalized(
  numberOfRecipients: number,
  quantityFood: number
): number {
  const difference: number = numberOfRecipients - quantityFood;
  if (difference <= 0) {
    return 0;
  } else if (difference > numberOfRecipients) {
    return 1;
  } else {
    return difference / numberOfRecipients;
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

  // Normalized (0-1)
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

  const distanceScore: number = distance * distanceCoefficient;
  const timeScore: number = time * timeCoefficient;
  const numberOfRecipientsScore: number =
    numberOfRecipients * numberOfRecipientsCoefficient;

  console.log("Scores: ");
  console.log(distanceScore, timeScore, numberOfRecipientsScore);

  const sum: number = distanceScore + timeScore + numberOfRecipientsScore;
  console.log("Total score: ", sum);

  return sum;
}

function getRecipientScores(
  outletId: String,
  recipients: Object,
  quantity: number
): Promise<{ id: String; score: number }[]> {
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
    console.log(`Recipient (ID: ${recipient}) Score: ${recipientScore}`);
    recipientScores.push(recipientScore);
    recipientIds.push(recipient);
  }
  return Promise.all(recipientScores)
    .then(recipientScores => {
      const recipientIdsAndScores = [];
      for (var i = 0; i < recipientScores.length; i++) {
        recipientIdsAndScores.push({
          id: recipientIds[i],
          score: recipientScores[i]
        });
      }
    })
    .catch(err => err);
}

function getSortedByScore(
  recipientScores: { id: String; score: number }[]
): { id: String; score: number }[] {
  let sortedScores = recipientScores;
  sortedScores.sort((a, b) => {
    if (a.score < b.score) {
      return 1;
    } else {
      return -1;
    }
  });
  return sortedScores;
}

export const onNewDelivery = functions.database // maintain async here, because subfunctions require async
  .ref("/deliveries/{deliveryId}")
  .onCreate(async (snapshot, context) => {
    const deliveryId = context.params.deliveryId;
    console.log(`Delivery ID: ${deliveryId}`);

    const deliveryData = snapshot.val();
    const sender = deliveryData.sender;
    console.log(`Sender: ${sender}`);

    // const distance = await getDistance("BATS", "Dorkas");
    // const timeSinceLastDelivery = await getTimeSinceLastDelivery("Dorkas");
    // const numberOfRecipients = await getNumberOfRecipients("Dorkas");
    // const score = await getRecipientScore("BATS", "Dorkas");

    const recipients = await admin
      .database()
      .ref("/Recipients")
      .once("value")
      .then(recipientSnapshot => recipientSnapshot.val());

    let recipientScores = getRecipientScores(
      "BATS",
      recipients,
      deliveryData.quantity
    );

    // not a function, not promises.all() method of obtaining recipientScores
    // for (const recipient in recipients) {
    //   const recipientScore: number = await getRecipientScore(
    //     "BATS",
    //     recipient,
    //     deliveryData.quantity,
    //     1,
    //     2,
    //     1
    //   );
    //   console.log(`Recipient (ID: ${recipient}) Score: ${recipientScore}`);
    //   recipientScores.push({ id: recipient, score: recipientScore });
    // }

    const sortedScores = recipientScores.then(recipientScores =>
      getSortedByScore(recipientScores)
    ); // Descending

    // const recipientScores = await getRecipientScores("BATS", recipients);

    return snapshot.ref
      .update({
        orphanageList: recipients,
        sortedScores
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
