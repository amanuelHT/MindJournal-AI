
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

                exports.createEmptySummary = functions.auth.user().onCreate(async (user) => {
                    try {
                        // Create an empty summary document for the new user
                        await db.collection('summaries').doc(user.uid).set({
                            uid: user.uid,
                            text: "Welcome", // Initialize with a welcome string
                            created: admin.firestore.FieldValue.serverTimestamp(),
                        });
                        console.log('Empty summary document created for user:', user.uid);
                    } catch (error) {
                        console.error('Error creating empty summary document:', error);
                    }
                });
                
                exports.summarizeSingleEntry = functions.firestore
    .document('/diary/{entryId}')
    .onCreate(async (snapshot, context) => {
        console.log('Function Triggered');
        const { text, uid } = snapshot.data();
        if (!text) {
            console.log('Diary entry is missing text', snapshot.id);
            return;
        }

        if (!uid) {
            console.error('Diary entry does not have a uid, cannot associate summary', snapshot.id);
            return;
        }

        console.log(`Diary entry with text found: ${text}`);

        try {
            const completion = await openai.completions.create({
                model: "gpt-3.5-turbo-instruct", // Change the model to one that supports long-text completion
                prompt: `Summarize this diary entry short text:\n\n${text}`,
                max_tokens: 200, // Increase max_tokens for longer summaries
            });

            console.log('API completion:', JSON.stringify(completion, null, 2));
            if (completion && completion.data && Array.isArray(completion.data.choices) && completion.data.choices.length > 0) {
                const summary = completion.data.choices[0].text.trim();
                console.log(`Generated summary: ${summary}`);

                if (summary) {
                    const summaryRef = admin.firestore().collection('summaries').doc(uid);
                    const summaryDoc = await summaryRef.get();

                    if (summaryDoc.exists) {
                        // If the summary document already exists, update it
                        await summaryRef.update({
                            text: summary,
                            created: admin.firestore.FieldValue.serverTimestamp(),
                            originalDiaryEntryId: snapshot.id, // Store the original diary entry ID
                        });
                        console.log('Summary updated in Firestore for user:', uid);
                    } else {
                        // If the summary document doesn't exist, create it
                        await summaryRef.set({
                            uid: uid,
                            text: summary,
                            created: admin.firestore.FieldValue.serverTimestamp(),
                            originalDiaryEntryId: snapshot.id, // Store the original diary entry ID
                        });
                        console.log('Summary created in Firestore for user:', uid);
                    }
                } else {
                    console.error('Generated summary is empty, no text to update in Firestore.');
                }
            }

        } catch (error) {
            console.error('Error creating summary for entryId:', snapshot.id, error);
            console.error('Error details:', error.details); // Log more error details if available
        }
    });

                