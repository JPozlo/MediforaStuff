import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const incrementAnswersCountOfQuestion = functions.firestore
  .document("answers/{answerId}")
  .onUpdate((change, context) => {
    const db = admin.firestore();

    const newValue = change.after.data();
    const oldValue = change.before.data();

    const questionOfAnswerId = newValue.questionID;

    if (newValue.status === oldValue.status) {
      return null;
    }

    if (newValue.status === "ACCEPTED") {
      const questionValue = db
        .collection("questions")
        .doc(questionOfAnswerId)
        .update({
          totalNumberOfAnswers: admin.firestore.FieldValue.increment(1),
        });

      questionValue.then(
          (res) => {
              return console.log("Successfully incremented question's number of answers");
        },
          (err) => {
            return console.log(
            `Error in incrementing question's number of answers -> ${err}`
          );
        }
      );
    }

    if (newValue.status === "REJECTED") {
      const questionValue = db
        .collection("questions")
        .doc(questionOfAnswerId)
        .delete();

      questionValue.then(
        (res) => {
          return console.log("Successfully deleted answer");
        },
        (err) => {
          return console.log(`Error in deleting answer -> ${err}`);
        }
      );
    }
  });
