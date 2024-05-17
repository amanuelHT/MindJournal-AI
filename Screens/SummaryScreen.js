import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const SummaryScreen = () => {
  const [summaries, setSummaries] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const unsubscribe = loadSummaries(user.uid);
      return () => unsubscribe(); // Clean up the listener when the component unmounts
    } else {
      setSummaries(["Please log in to view your summaries."]);
    }
  }, [user]); // Depend on the user state to re-run the effect when it changes

  const loadSummaries = (uid) => {
    const summariesRef = collection(db, "summaries");
    const q = query(summariesRef, where("uid", "==", uid), orderBy("created", "desc"));

    return onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const summariesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSummaries(summariesList);
      } else {
        setSummaries(["You do not have any summaries yet."]);
      }
    });
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <View>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Your Summaries:</Text>
        {summaries.length > 0 && typeof summaries[0] === 'object' ? summaries.map((summary, index) => (
          <View key={summary.id} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>Created: {new Date(summary.created.toDate()).toLocaleString()}</Text>
            <Text>{summary.text}</Text>
          </View>
        )) : (
          <Text>{summaries[0]}</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default SummaryScreen;
