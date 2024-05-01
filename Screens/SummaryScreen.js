import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const SummaryScreen = () => {
  const [summary, setSummary] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;
//--------
  useEffect(() => {
    if (user) {
      const unsubscribe = loadLatestSummary(user.uid);
      return () => unsubscribe(); // Clean up the listener when the component unmounts
    } else {
      setSummary("Please log in to view your summaries.");
    }
  }, [user]); // Depend on the user state to re-run the effect when it changes

  const loadLatestSummary = (uid) => {
    const summariesRef = collection(db, "summaries");
    const q = query(summariesRef, where("uid", "==", uid), orderBy("created", "desc"), limit(1));

    return onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const latestSummary = querySnapshot.docs[0].data().text;
        setSummary(latestSummary);
      } else {
        setSummary("You do not have any summaries yet.");
      }
    });
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <View>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Your Latest Summary:</Text>
        <Text>{summary}</Text>
      </View>
    </ScrollView>
  );
};

export default SummaryScreen;
