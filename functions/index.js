//require('dotenv').config()
const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const OpenAI = require("openai").OpenAI;

admin.initializeApp();
const db = admin.firestore();

const openaiApiKey =
  functions.config().openai?.key || process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  console.error("The OPENAI_API_KEY environment variable is missing.");
  throw new Error("The OPENAI_API_KEY environment variable is missing.");
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

//exports.helloWorld = functions.https.onRequest((request, response) => {
//response.send("Hello from Firebase!");});

const LOCK_COLLECTION = "locks";
const LOCK_DOCUMENT = "summarizeEntriesLock";

exports.summarizeWeeklyEntries = functions.pubsub
  .schedule("every 168 hours")
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const oneWeekAgo = admin.firestore.Timestamp.fromDate(
      new Date(now.toDate().getTime() - 7 * 24 * 60 * 60 * 1000)
    );

    console.log(`Current time (UTC): ${now.toDate().toISOString()}`);
    console.log(
      `Querying entries created since (UTC): ${oneWeekAgo
        .toDate()
        .toISOString()}`
    );

    const lockRef = admin
      .firestore()
      .collection(LOCK_COLLECTION)
      .doc(LOCK_DOCUMENT);

    try {
      //--- Locking Mechanism
      const lockAcquired = await admin
        .firestore()
        .runTransaction(async (transaction) => {
          const lockDoc = await transaction.get(lockRef);
          if (
            lockDoc.exists &&
            lockDoc.data().timestamp.toDate().getTime() >
              now.toDate().getTime() - 60000
          ) {
            console.log("Another summarization process is already running.");
            return false;
          }
          transaction.set(lockRef, { timestamp: now });
          return true;
        });

      if (!lockAcquired) {
        return null;
      }

      const snapshot = await admin
        .firestore()
        .collection("diary")
        .where("timestamp", ">=", oneWeekAgo)
        .get();

      if (snapshot.empty) {
        console.log("No diary entries found for the last week.");
        return null;
      }

      const entriesByUser = {};
      snapshot.docs.forEach((doc) => {
        const { uid, text } = doc.data();
        if (!entriesByUser[uid]) {
          entriesByUser[uid] = [];
        }
        entriesByUser[uid].push(text);
      });

      for (const [uid, texts] of Object.entries(entriesByUser)) {
        const concatenatedTexts = texts.join("\n\n");
        console.log(`Diary entries for UID ${uid}: ${concatenatedTexts}`);

        try {
          const completion = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: `Summarize these diary entries like the user wrote:\n\n${concatenatedTexts}`,
            max_tokens: 2500,
          });

          if (
            !completion ||
            !completion.choices ||
            completion.choices.length === 0
          ) {
            throw new Error("Unexpected OpenAI API response format");
          }

          const summary = completion.choices[0].text.trim();
          console.log(`Generated summary for UID ${uid}: ${summary}`);

          if (summary) {
            const summaryRef = admin.firestore().collection("summaries").doc();
            await summaryRef.set({
              uid: uid,
              text: summary,
              created: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log(
              `Summary for UID ${uid} successfully stored in Firestore`
            );
          } else {
            console.log(
              `Generated summary for UID ${uid} is empty, no text to store in Firestore.`
            );
          }
        } catch (apiError) {
          console.error(`Error with OpenAI API for UID ${uid}:`, apiError);
        }
      }
    } catch (error) {
      console.error("Error processing diary entries:", error);
    } finally {
      //-- lock release
      await lockRef.delete();
    }
  });

exports.summarizeYearlyEntries = functions.pubsub
  .schedule("every 8760 hours")
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const oneWeekAgo = admin.firestore.Timestamp.fromDate(
      new Date(now.toDate().getTime() - 365 * 24 * 60 * 60 * 1000)
    );

    console.log(`Current time (UTC): ${now.toDate().toISOString()}`);
    console.log(
      `Querying weekly summaries created since (UTC): ${oneYearAgo
        .toDate()
        .toISOString()}`
    );

    const lockRef = admin
      .firestore()
      .collection(LOCK_COLLECTION)
      .doc(YEARLY_LOCK_DOCUMENT);

    try {
      //-- Locking Mechanism
      const lockAcquired = await admin
        .firestore()
        .runTransaction(async (transaction) => {
          const lockDoc = await transaction.get(lockRef);
          if (
            lockDoc.exists &&
            lockDoc.data().timestamp.toDate().getTime() >
              now.toDate().getTime() - 60000
          ) {
            console.log(
              "Another yearly summarization process is already running."
            );
            return false;
          }
          transaction.set(lockRef, { timestamp: now });
          return true;
        });

      if (!lockAcquired) {
        return null;
      }

      const snapshot = await admin
        .firestore()
        .collection("summaries")
        .where("timestamp", ">=", oneYearAgo)
        .get();

      if (snapshot.empty) {
        console.log("No weekly summaries found for the last year.");
        return null;
      }

      const entriesByUser = {};
      snapshot.docs.forEach((doc) => {
        const { uid, text } = doc.data();
        if (!entriesByUser[uid]) {
          entriesByUser[uid] = [];
        }
        entriesByUser[uid].push(text);
      });

      for (const [uid, texts] of Object.entries(entriesByUser)) {
        const concatenatedTexts = texts.join("\n\n");
        console.log(`Diary entries for UID ${uid}: ${concatenatedTexts}`);

        try {
          const completion = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: `Summarize these weekly summaries like the user wrote:\n\n${concatenatedTexts}`,
            max_tokens: 3096,
          });

          if (
            !completion ||
            !completion.choices ||
            completion.choices.length === 0
          ) {
            throw new Error("Unexpected OpenAI API response format");
          }

          const summary = completion.choices[0].text.trim();
          console.log(`Generated yearly summary for UID  ${uid}: ${summary}`);

          if (summary) {
            const summaryRef = admin.firestore().collection("summaries").doc();
            await summaryRef.set({
              uid: uid,
              text: summary,
              created: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log(
              `Summary for UID ${uid} successfully stored in Firestore`
            );
          } else {
            console.log(
              `Generated summary for UID ${uid} is empty, no text to store in Firestore.`
            );
          }
        } catch (apiError) {
          console.error(`Error with OpenAI API for UID ${uid}:`, apiError);
        }
      }
    } catch (error) {
      console.error("Error processing diary entries:", error);
    } finally {
      //--- lock release
      await lockRef.delete();
    }
  });
