import React, { useState, useEffect, useRef } from "react";import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ImageBackground,
  TextInput,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AddModalComponent from "../Modals/AddModalComponent";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const DiaryScreen = () => {
  const [newEntryText, setNewEntryText] = useState("");
  const [entries, setEntries] = useState([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  const backgroundImage = require("../images/backlogin.jpg"); // Replace with the path to your background image

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

      {/* Display entries */}
      {entries.map((entry) => (
        <View key={entry.id}>
          <Text>{entry.text}</Text>
          {/* Display other entry data as needed */}
        </View>
      ))}
      
    <TouchableOpacity
      style={styles.addButton}
      onPress={() => setAddModalVisible(true)}
    >
      <MaterialCommunityIcons
        name="book-plus-multiple"
        style={styles.addButtonIcon}
      />
    </TouchableOpacity>
    <AddModalComponent
            isModalVisible={isAddModalVisible}
            setModalVisible={(visible) => setAddModalVisible(visible)}
            newEntry={newEntry}
            setNewEntry={setNewEntry}
            onCancelPress={cancelEntry}
            onPhotoPress={onPhotoPress}
            imageUri={imageUri}
            onTeaPress={(emotion) => setSelectedEmotion(emotion)}
            onLocationPress={(location) => setSelectedLocation(location)}
            onDonePress={addOrUpdateEntry}
          />
  </View>

    

  );
};

// Add styles for modalView, textInput, and submitButton
const styles = StyleSheet.create({
  // ... other existing styles

  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

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
