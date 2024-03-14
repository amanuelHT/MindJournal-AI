import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  TextInput,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const DiaryScreen = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newEntryText, setNewEntryText] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Fetch entries when the component loads
    fetchEntries();
  }, []);

  const addEntry = async () => {
    console.log("Attempting to add entry");
    try {
      await addDoc(collection(db, "diaryEntries"), {
        text: newEntryText,
        // add other entry data as needed
      });
      console.log("Entry added successfully");
      setNewEntryText(""); // Reset input field
      setAddModalVisible(false); // Close modal
      fetchEntries(); // Fetch entries again to update the list
    } catch (error) {
      console.error("Error adding entry: ", error);
    }
  };

  const fetchEntries = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "diaryEntries"));
      const entriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(entriesData);
    } catch (error) {
      console.error("Error fetching entries: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Other components */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.textInput}
            placeholder="Write your diary entry..."
            onChangeText={(text) => setNewEntryText(text)}
            value={newEntryText}
          />
          <TouchableOpacity style={styles.submitButton} onPress={addEntry}>
            <Text>Submit Entry</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <MaterialCommunityIcons
            name="book-plus-multiple"
            size={24}
            style={styles.addButtonIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Display entries */}
      {entries.map((entry) => (
        <View key={entry.id}>
          <Text>{entry.text}</Text>
          {/* Display other entry data as needed */}
        </View>
      ))}
    </View>
  );
};

// Add styles for modalView, textInput, and submitButton
const styles = StyleSheet.create({
  // ... other existing styles

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  textInput: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 4,
    width: "100%",
    backgroundColor: "#fff",
  },

  submitButton: {
    backgroundColor: "#007bff",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    minWidth: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  // ... other styles
});

export default DiaryScreen;
