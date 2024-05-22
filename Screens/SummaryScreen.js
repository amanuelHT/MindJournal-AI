import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, ImageBackground, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, where, doc, updateDoc, deleteDoc, getDoc, getDocs } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AddModalComponent from "../Modals/AddModalComponent";
import DetailsModal from "../Modals/DetailsModal";
import { LinearGradient } from 'expo-linear-gradient';

const SummaryScreen = ({ navigation }) => {
  const [summaries, setSummaries] = useState([]);
  const [newEntry, setNewEntry] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDetailsModalVisible, setDetailsModalVisible] = useState({});
  const [expandedEntryId, setExpandedEntryId] = useState(null);
  const user = getAuth().currentUser;

  useEffect(() => {
    if (user) {
      const unsubscribe = loadSummaries(user.uid);
      return () => unsubscribe();
    } else {
      setSummaries(["Please log in to view your summaries."]);
    }
  }, [user]);

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

  const handleEntryPress = (entryId) => {
    setDetailsModalVisible((prevVisibility) => ({
      ...prevVisibility,
      [entryId]: true,
    }));
    setExpandedEntryId(entryId);
  };

  const handleEditPress = (entryId) => {
    setAddModalVisible(true);
    setSelectedEntry(entryId);
    setDetailsModalVisible((prevVisibility) => ({
      ...prevVisibility,
      [entryId]: false,
    }));
    editEntry(entryId);
  };

  const editEntry = async (entryId) => {
    try {
      const summaryDocRef = doc(db, "summaries", entryId);
      const docSnapshot = await getDoc(summaryDocRef);
      const entryData = docSnapshot.data();

      if (entryData) {
        setNewEntry(entryData.text);
      }
    } catch (error) {
      console.error("Error fetching summary entry: ", error);
    }
  };

  const saveEditedEntry = async () => {
    try {
      if (user && selectedEntry) {
        const summaryDocRef = doc(db, "summaries", selectedEntry);
        await updateDoc(summaryDocRef, {
          text: newEntry,
          timestamp: new Date(),
        });

        setDetailsModalVisible((prevVisibility) => ({
          ...prevVisibility,
          [selectedEntry]: false,
        }));
        fetchSummaries();
        setSelectedEntry(null);
        setAddModalVisible(false);
      }
    } catch (error) {
      console.error("Error editing summary entry: ", error);
    }
  };

  const handleDeletePress = (entryId) => {
    Alert.alert(
      "Delete Summary",
      "Are you sure you want to delete this summary?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteEntry(entryId),
        },
      ],
      { cancelable: false }
    );
  };

  const deleteEntry = async (entryId) => {
    try {
      const summaryDocRef = doc(db, "summaries", entryId);
      await deleteDoc(summaryDocRef);
      fetchSummaries();
      setDetailsModalVisible((prevVisibility) => ({
        ...prevVisibility,
        [entryId]: false,
      }));
      Alert.alert("Summary entry deleted successfully.");
    } catch (error) {
      console.error("Error deleting summary entry: ", error);
    }
  };

  const fetchSummaries = async () => {
    if (user) {
      const summariesRef = collection(db, "summaries");
      const q = query(summariesRef, where("uid", "==", user.uid), orderBy("created", "desc"));

      const querySnapshot = await getDocs(q);
      const summariesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSummaries(summariesList);
    } else {
      setSummaries([]);
    }
  };

  const cancelEntry = () => {
    setNewEntry("");
    setAddModalVisible(false);
    setSelectedEntry(null);
  };

  const addOrUpdateEntry = async () => {
    if (selectedEntry) {
      await saveEditedEntry();
    }
    setSelectedEntry(null);
    setAddModalVisible(false);
  };

  return (
    <ImageBackground
      source={require('../images/background1.jpg')}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.2)"]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Summaries:</Text>
            {summaries.length > 0 && typeof summaries[0] === 'object' ? summaries.map((summary) => (
              <TouchableOpacity
                key={summary.id}
                style={styles.summaryItem}
                onPress={() => handleEntryPress(summary.id)}
              >
                <DetailsModal
                  isModalVisible={isDetailsModalVisible[summary.id] || false}
                  setModalVisible={(visible) =>
                    setDetailsModalVisible((prevVisibility) => ({
                      ...prevVisibility,
                      [summary.id]: visible,
                    }))
                  }
                  onDeletePress={() => handleDeletePress(summary.id)}
                  onEditPress={() => handleEditPress(summary.id)}
                  expanded={expandedEntryId === summary.id}
                  onPress={() => setExpandedEntryId(summary.id)}
                >
                  <View style={styles.topEntryContainer}>
                    <Text style={styles.timestamp}>
                      {summary.created && summary.created.toDate
                        ? summary.created.toDate().toLocaleString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                            hour12: true,
                          })
                        : "Timestamp not available"}
                    </Text>
                  </View>
                  <View style={styles.bodyEntryContainer}>
                    <Text style={styles.entryText}>{summary.text}</Text>
                  </View>
                </DetailsModal>
              </TouchableOpacity>
            )) : (
              <Text style={styles.noSummariesText}>{summaries[0]}</Text>
            )}
          </View>
        </ScrollView>
        <AddModalComponent
          isModalVisible={isAddModalVisible}
          setModalVisible={(visible) => setAddModalVisible(visible)}
          newEntry={newEntry}
          setNewEntry={setNewEntry}
          onCancelPress={cancelEntry}
          onDonePress={addOrUpdateEntry}
        />
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 150,
    justifyContent: "center",
    resizeMode: 'cover',
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "130%",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
  },
  container: {
    flex: 1,
  },
  title: {
    fontWeight: 'normal',
    marginBottom: 20,
    marginTop: 30, 
    fontSize: 28,
    color: "#ffd7",
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -0.5, height: 1 },
    textShadowRadius: 10,
  },
  summaryItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
    borderRadius: 10,
  },
  summaryDate: {
    fontWeight: 'bold',
    color: '#fff', 
    marginBottom: 5,
  },
  summaryText: {
    color: '#fff', 
  },
  noSummariesText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  topEntryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 10,
  },
  bodyEntryContainer: {
    flexDirection: "column",
  },
  timestamp: {
    fontSize: 18,
    fontWeight: "200",
    color: "#ffd700",
  },
  entryText: {
    fontSize: 18,
    color: "#87ceeb",
    backgroundColor: "transparent",
  },
});

export default SummaryScreen;
