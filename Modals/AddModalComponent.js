import React, { useState } from "react";
import {
  Text,
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Platform,
} 
from "react-native";
import { sharedStyles, addModalStyles as styles } from "./ModalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";

const emotions = ["😊", "😢", "😃", "😠", "😲", "😌"];
// At the top of your file, add the writeLocations array
const writeLocations = [
  "Quiet Café",
  "Library",
  "Home Office",
  "Park Bench",
  "Bedroom",
  "Cozy Corner",
  "Workspace",
  "Study Room",
  "Creative Studio",
  "BathRoom",
];

const AddModalComponent = 
({
  isModalVisible,
  setModalVisible,
  newEntry,
  setNewEntry,
  onCancelPress,
  onDonePress,
  onPhotoPress,
  onTeaPress, // Pass onTeaPress as a prop
  onLocationPress,
  imageUri,
  isEditing,
  entryId,
}) => {
  const [showTeaPicker, setShowTeaPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleEmotionSelect = (emotion) => {
    onTeaPress(emotion);
    setShowTeaPicker(false);
    setSelectedEmotion(emotion);
  };

  const handleLocationSelect = (location) => {
    onLocationPress(location);
    setShowLocationPicker(false);
    setSelectedLocation(location);
  };

  const handleTeaPress = () => {
    setShowTeaPicker(!showTeaPicker);
  };

  const handleLocationPress = () => {
    setShowLocationPicker(!showLocationPicker);
  };

  const handleDonePress = () => {
    // Pass the entryId to onDonePress
    onDonePress(entryId);

    setSelectedEmotion("");
    setSelectedLocation("");
  };
  const handleCancelPress = () => {
    if (typeof onCancelPress === "function") {
      onCancelPress();
    }
    setSelectedEmotion("");
    setSelectedLocation("");
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalButtonsAdd}>
            <TouchableOpacity
              onPress={handleCancelPress}
              style={styles.ACancelIcon}
            >
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPhotoPress} style={styles.APhotoIcon}>
              <AntDesign name="picture" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleTeaPress} // Use handleTeaPress for "rest" button
              style={styles.ATeaIcon}
            >
              <AntDesign name="rest" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLocationPress} // Corrected function name
              style={styles.ALocationIcon}
            >
              <AntDesign name="enviromento" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDonePress}
              style={styles.ACheckIcon}
            >
              <AntDesign name="check" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <ScrollView style={styles.inputContainer}>
              <View style={styles.selectedInfoContainer3}>
                {imageUri && (
                  <Image
                    source={{ uri: imageUri }}

                    style={styles.uploadedImage}
                    resizeMode="cover"
                  />
                )}
                {selectedEmotion || selectedLocation ? (
                  <View style={styles.selectedInfoContainer2}>
                    {selectedEmotion && (
                      <Text style={styles.emotionOnModal}>
                        {selectedEmotion}
                      </Text>
                    )}
                    {selectedLocation && (
                      <Text style={styles.locationOnModal}>
                        {selectedLocation}
                      </Text>
                    )}
                  </View>
                ) : null}
              </View>

              {showTeaPicker ? (
                <View style={styles.locationPickerContainer}>
                  {/* Tea Picker */}
                  <Picker
                    onValueChange={(itemValue) =>
                      handleEmotionSelect(itemValue)
                    }
                    itemStyle={styles.locationPickerItem}
                  >
                    {/* Tea Picker items */}
                    {emotions.map((emotion) => (
                      <Picker.Item
                        key={emotion}
                        label={emotion}
                        value={emotion}
                      />
                    ))}
                  </Picker>
                </View>
              ) : null}

              {showLocationPicker ? (
                <View style={styles.locationPickerContainer}>
                  {/* Location Picker */}
                  <Picker
                    onValueChange={(itemValue) =>
                      handleLocationSelect(itemValue)
                    }
                    itemStyle={styles.locationPickerItem}
                  >
                    {/* Location Picker items */}
                    <Picker.Item label="Select a location" value="" />
                    {writeLocations.map((location) => (
                      <Picker.Item
                        key={location}
                        label={location}
                        value={location}
                      />
                    ))}
                  </Picker>
                </View>
              ) : null}

              <TextInput
                style={styles.input}
                placeholder="Add a new diary entry"
                value={newEntry}
                onChangeText={(text) => setNewEntry(text)}
                multiline
                numberOfLines={1}
              />
            </ScrollView>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AddModalComponent;
