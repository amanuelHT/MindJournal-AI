
//require('dotenv').config()
const functions = require('firebase-functions');
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require('firebase-admin');
const OpenAI = require('openai').OpenAI;


admin.initializeApp();
const db = admin.firestore();

const openaiApiKey = functions.config().openai?.key || process.env.OPENAI_API_KEY;

// Ensure API key is available
if (!openaiApiKey) {
    console.error("The OPENAI_API_KEY environment variable is missing.");
    throw new Error("The OPENAI_API_KEY environment variable is missing.");
}

const openai = new OpenAI({
    apiKey: openaiApiKey
});

//exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");});

const LOCK_COLLECTION = 'locks';
const LOCK_DOCUMENT = 'summarizeEntriesLock';

exports.summarizeEntries = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const oneMinuteAgo = admin.firestore.Timestamp.fromDate(new Date(now.toDate().getTime() - 60000));

    console.log(`Current time (UTC): ${now.toDate().toISOString()}`);
    console.log(`Querying entries created since (UTC): ${oneMinuteAgo.toDate().toISOString()}`);

    const lockRef = admin.firestore().collection(LOCK_COLLECTION).doc(LOCK_DOCUMENT);

    try {
        // Try to acquire the lock atomically
        const lockAcquired = await admin.firestore().runTransaction(async (transaction) => {
            const lockDoc = await transaction.get(lockRef);
            if (lockDoc.exists && lockDoc.data().timestamp.toDate().getTime() > now.toDate().getTime() - 60000) {
                console.log('Another summarization process is already running.');
                return false;
            }
            transaction.set(lockRef, { timestamp: now });
            return true;
        });

        if (!lockAcquired) {
            return null;
        }

        const snapshot = await admin.firestore().collection('diary')
            .where('timestamp', '>=', oneMinuteAgo)
            .get();

        if (snapshot.empty) {
            console.log('No diary entries found for the last minute.');
            return null;
        }

        const entriesByUser = {};
        snapshot.docs.forEach(doc => {
            const { uid, text } = doc.data();
            if (!entriesByUser[uid]) {
                entriesByUser[uid] = [];
            }
            entriesByUser[uid].push(text);
        });

        //const openai = require('openai');

        for (const [uid, texts] of Object.entries(entriesByUser)) {
            const concatenatedTexts = texts.join('\n\n');
            console.log(`Diary entries for UID ${uid}: ${concatenatedTexts}`);

            try {
                const completion = await openai.completions.create({
                    model: "gpt-3.5-turbo-instruct",
                    prompt: `Summarize these diary entries like the user wrote:\n\n${concatenatedTexts}`,
                    max_tokens: 200
                });

                if (!completion || !completion.choices || completion.choices.length === 0) {
                    throw new Error('Unexpected OpenAI API response format');
                }

                const summary = completion.choices[0].text.trim();
                console.log(`Generated summary for UID ${uid}: ${summary}`);

                if (summary) {
                    const summaryRef = admin.firestore().collection('summaries').doc();
                    await summaryRef.set({
                        uid: uid,
                        text: summary,
                        created: admin.firestore.FieldValue.serverTimestamp()
                    });
                    console.log(`Summary for UID ${uid} successfully stored in Firestore`);
                } else {
                    console.log(`Generated summary for UID ${uid} is empty, no text to store in Firestore.`);
                }
            } catch (apiError) {
                console.error(`Error with OpenAI API for UID ${uid}:`, apiError);
            }
        }

    } catch (error) {
        console.error('Error processing diary entries:', error);
    } finally {
        // Release the lock
        await lockRef.delete();
    }
});