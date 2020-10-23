import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const incrementAnswersCountOfQuestion = functions.firestore.document("users/{userId}/questions/{questionId}/answers/{answerId}")
    .onCreate((snap, context) => {

        const db = admin.firestore()
    
        const newValue = snap.data()

        const userId = context.params.userId

        const questionOfAnswerId = newValue.questionID 

        const questionValue = db.collection("users").doc(userId).collection("questions").doc(questionOfAnswerId).update({ totalNumberOfAnswers: admin.firestore.FieldValue.increment(1) })
        
        questionValue.then((res => {
            console.log("Successfully incremented question's number of answers")
        }), err => {
            console.log(`Error in incrementing question's number of answers -> ${err}`)
        })
    })