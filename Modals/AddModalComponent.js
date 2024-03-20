import React, { useState } from "react";
import {
  Text,
  Modal,
  View,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Platform,
} from "react-native";

const AddModalComponent = ({
  isModalVisible,
  setModalVisible,
  newEntry,
  setNewEntry,
  imageUri,
}) => {
  

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"git 
        >
          <View style={styles.modalButtonsAdd}>
 
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

              </View>

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
