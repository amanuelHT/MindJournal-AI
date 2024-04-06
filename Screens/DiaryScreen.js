import React, { useState, useEffect, useRef } from "react";
import {
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

import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AddModalComponent from "../Modals/AddModalComponent";
import DetailsModal from "../Modals/DetailsModal";

const Diary = () => {
  const [newEntry, setNewEntry] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [expandedEntryId, setExpandedEntryId] = useState("null");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchInputFocused, setSearchInputFocused] = useState(false);

  const user = auth.currentUser;
  const backgroundImage = require("../images/backlogin.jpg"); // Replace with the path to your background image

  useEffect(() => {
    const updateCurrentDate = () => {
      const today = new Date();
      const date = today.getDate();
      const monthIndex = today.getMonth();
      const year = today.getFullYear();

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const month = monthNames[monthIndex];

      setCurrentDate(`${date} ${month} ${year}`);
    };

    updateCurrentDate();
    const intervalId = setInterval(updateCurrentDate, 300);
    return () => clearInterval(intervalId);
  }, [user]);

  const fetchEntries = async () => {
    try {
      if (user) {
        const diaryCollectionRef = collection(db, "diary");
        const q = query(diaryCollectionRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const entryList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          entryList.push({
            id: doc.id,
            text: data.text,
            timestamp: data.timestamp,
            imageUri: data.imageUri,
            emotion: data.emotion,
            location: data.location,
          });
        });

        setEntries(entryList);
      } else {
        // If user is not authenticated, set entries to an empty array
        setEntries([]);
      }
    } catch (error) {
      console.error("Error fetching diary entries: ", error);
    }
  };

  useEffect(() => {
    fetchEntries();
    const refreshInterval = setInterval(fetchEntries, 300);
    return () => clearInterval(refreshInterval);
  }, [user]);

  const addOrUpdateEntry = async () => {
    if (selectedEntry) {
      await saveEditedEntry();
    } else {
      await addEntry();
    }

    setSelectedEntry(null);
    setAddModalVisible(false);
  };

  const handleEntryPress = (entryId) => {
    setDetailsModalVisible((prevVisibility) => ({
      ...prevVisibility,
      [entryId]: true,
    }));
    setExpandedEntryId(entryId);
  };

  const addEntry = async () => {
    try {
      if (newEntry.trim() === "") {
        Alert.alert("Please enter a valid diary entry.");
        return;
      }

      if (user) {
        const diaryCollectionRef = collection(db, "diary");
        await addDoc(diaryCollectionRef, {
          text: newEntry,
          uid: user.uid,
          timestamp: currentDate,
          imageUri: imageUri,
          emotion: selectedEmotion,
          location: selectedLocation,
        });

        setNewEntry("");
        setImageUri(null);

        Alert.alert("Diary entry added successfully.");
        fetchEntries();
        setSelectedEmotion("");
        setSelectedLocation("");

        setAddModalVisible(false);
      } else {
        Alert.alert("Please sign in to add a diary entry.");
      }
    } catch (error) {
      console.error("Error adding diary entry: ", error);
    }
  };

  const cancelEntry = () => {
    setNewEntry("");
    setImageUri(null);
    setSelectedEmotion("");
    setSelectedLocation("");
    setAddModalVisible(false);
    setDetailsModalVisible(false);
    setSelectedEntry(null);
  };

  const handleEditPress = (entryId) => {
    setAddModalVisible(true);
    setSelectedEntry(entryId);
    setDetailsModalVisible(false);
    EditEntry(entryId);
  };
// edit entry
  const EditEntry = async (entryId) => {
    try {
      if (user) {
        const diaryDocRef = doc(db, "diary", entryId);
        const docSnapshot = await getDoc(diaryDocRef);
        const entryData = docSnapshot.data();

        if (entryData) {
          setSelectedEmotion(entryData.emotion || "");
          setSelectedLocation(entryData.location || "");
          setNewEntry(entryData.text);
          setImageUri(entryData.imageUri || null);
        }
      }
    } catch (error) {
      console.error("Error fetching diary entry: ", error);
    }
  };

  const saveEditedEntry = async () => {
    try {
      if (user && selectedEntry) {
        const diaryDocRef = doc(db, "diary", selectedEntry);
        await updateDoc(diaryDocRef, {
          text: newEntry,
          timestamp: currentDate,
          imageUri: imageUri,
          emotion: selectedEmotion,
          location: selectedLocation,
        });

        setDetailsModalVisible(false);
        fetchEntries();
      }
    } catch (error) {
      console.error("Error editing diary entry: ", error);
    }
  };

  //------//

  const filterEntries = () => {
    // Convert the search query to lowercase for case-insensitive comparison
    const lowerCaseQuery = searchQuery.toLowerCase().trim();

    // Filter entries based on search query and date
    const filteredEntries = entries.filter((entry) => {
      const lowerCaseText = entry.text.toLowerCase();
      const lowerCaseTimestamp = entry.timestamp.toLowerCase();

      console.log("lowerCaseQuery:", lowerCaseQuery);
      console.log("lowerCaseText:", lowerCaseText);
      console.log("lowerCaseTimestamp:", lowerCaseTimestamp);

      // Check if the entry text or timestamp contains the search query
      const textMatch = lowerCaseText.includes(lowerCaseQuery);
      const dateMatch = lowerCaseTimestamp.includes(lowerCaseQuery);

      console.log("textMatch:", textMatch);
      console.log("dateMatch:", dateMatch);

      return textMatch || dateMatch;
    });

    console.log("filteredEntries:", filteredEntries);
    return filteredEntries;
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.2)"]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View
            style={[
              styles.searchInput,
              searchQuery ? styles.searchInputWithValue : null,
            ]}
          >
            <MaterialCommunityIcons
              name="magnify"
              style={[
                styles.searchIcon,
                searchQuery ? styles.searchIconWithValue : null,
              ]}
            />
            <TextInput
              placeholder="Search entries..."
              placeholderTextColor={
                searchQuery
                  ? styles.searchPlaceholderFocused.color
                  : styles.searchPlaceholder.color
              }
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
              style={[
                styles.searchInputText,
                searchQuery ? styles.searchInputWithValueFocused : null,
              ]}
              onFocus={() => setSearchInputFocused(true)}
              onBlur={() => setSearchInputFocused(false)}
            />
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {searchQuery
              ? filterEntries().map((entry) => (
                  <TouchableOpacity
                    key={entry.id}
                    style={styles.entryItem}
                    onPress={() => handleEntryPress(entry.id)}
                  >
                    <DetailsModal
                      isModalVisible={isDetailsModalVisible[entry.id] || false}
                      setModalVisible={(visible) =>
                        setDetailsModalVisible((prevVisibility) => ({
                          ...prevVisibility,
                          [entry.id]: visible,
                        }))
                      }
                      onDeletePress={() => handleDeletePress(entry.id)}
                      onEditPress={() => handleEditPress(entry.id)}
                      expanded={expandedEntryId === entry.id}
                      onPress={() => setExpandedEntryId(entry.id)}
                    >
                      <View style={styles.topEntryContainer}>
                        <Text style={styles.timestamp}>{entry.timestamp}</Text>
                        <Text style={styles.emotion}>{entry.emotion}</Text>
                        <Text style={styles.location}>{entry.location}</Text>
                      </View>
                      <View style={styles.bodyEntryContainer}>
                        <Text style={styles.entryText}>{entry.text}</Text>
                        {entry.imageUri && (
                          <Image
                            source={{ uri: entry.imageUri }}
                            style={styles.imageUri}
                            onError={(error) =>
                              console.error("Image loading error:", error)
                            }
                          />
                        )}
                      </View>
                    </DetailsModal>
                  </TouchableOpacity>
                ))
              : entries.map((entry) => (
                  <TouchableOpacity
                    key={entry.id}
                    style={styles.entryItem}
                    onPress={() => handleEntryPress(entry.id)}
                  >
                    <DetailsModal
                      isModalVisible={isDetailsModalVisible[entry.id] || false}
                      setModalVisible={(visible) =>
                        setDetailsModalVisible((prevVisibility) => ({
                          ...prevVisibility,
                          [entry.id]: visible,
                        }))
                      }
                      onDeletePress={() => handleDeletePress(entry.id)}
                      onEditPress={() => handleEditPress(entry.id)}
                      expanded={expandedEntryId === entry.id}
                      onPress={() => setExpandedEntryId(entry.id)}
                    >
                      <View style={styles.topEntryContainer}>
                        <Text style={styles.timestamp}>{entry.timestamp}</Text>
                        <Text style={styles.emotion}>{entry.emotion}</Text>
                        <Text style={styles.location}>{entry.location}</Text>
                      </View>
                      <View style={styles.bodyEntryContainer}>
                        <Text style={styles.entryText}>{entry.text}</Text>
                        {entry.imageUri && (
                          <Image
                            source={{ uri: entry.imageUri }}
                            style={styles.imageUri}
                            onError={(error) =>
                              console.error("Image loading error:", error)
                            }
                          />
                        )}
                      </View>
                    </DetailsModal>
                  </TouchableOpacity>
                ))}
          </ScrollView>

          <View style={styles.addButtonContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setAddModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="book-plus-multiple"
                style={styles.addButtonIcon}
              />
            </TouchableOpacity>
          </View>
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
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // ... (other styles)

  searchInput: {
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },

  searchIcon: {
    fontSize: 24,
    color: "white",
    marginRight: 8,
  },

  searchInputText: {
    fontSize: 16,
    color: "#fff",
    flex: 1,
    marginLeft: 8,
  },

  searchPlaceholder: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },

  searchInputFocused: {
    borderColor: "#fff",
  },

  searchPlaceholderFocused: {
    color: "#fff",
  },

  searchInputWithValue: {
    borderColor: "#fff",
  },

  searchInputWithValueFocused: {
    borderColor: "#fff",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },

  // Additional styling for when input has text and focus
  searchInputWithValueFocused: {
    borderColor: "#fff",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },

  // Remaining styles...
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  container: {
    marginBottom: 20,
    padding: 10,
    paddingTop: 100,
    height: "100%",
    backgroundColor: "transparent",
    color: "rgba(216, 216, 242,0.8)",
    shadowColor: "#dcdcdc",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  topEntryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -2,
    backgroundColor: "transparent",
    borderRadius: 10,
  },
  timestamp: {
    fontSize: 18, // Increased font size
    fontWeight: "200",
    color: "#ffd700", // Dodger Blue text color
  },
  emotion: {
    fontSize: 34, // Increased font size
    marginLeft: 10,
    color: "white", // Alizarin Crimson text color
    shadowColor: "white",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
  },
  location: {
    fontSize: 16,
    marginLeft: 14,
    fontWeight: "400",
    fontStyle: "italic",
    color: "white",
    textTransform: "uppercase",
  },

  bodyEntryContainer: {
    flexDirection: "column",
  },
  entryText: {
    fontSize: 18,
    color: "#87ceeb",
    backgroundColor: "transparent",
  },
  imageUri: {
    marginTop: 20,
    width: "90%",
    height: 400,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "white", // You can change the border color
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollContainer: {
    marginBottom: 10,
  },
  scrollContentContainer: {
    paddingBottom: 300,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#fff8dc",
    borderRadius: 50,
    width: 100,
    height: 100,
    padding: 20,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  addButton: {
    backgroundColor: "transparent",
    borderRadius: 50,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonIcon: {
    fontSize: 50,
    color: "#008b8b",
  },
});

export default Diary;
