import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const DiaryScreen = () => {
  // State to control the visibility of the add modal
  // This part assumes you will implement a modal to add diary entries
  const [addModalVisible, setAddModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <MaterialCommunityIcons name="book-plus-multiple" size={24} style={styles.addButtonIcon} />
        </TouchableOpacity>
      </View>
      {/* Other components like Modal can be placed here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonContainer: {
    marginBottom: 20, // Example style
  },
  addButton: {
    backgroundColor: "#007bff", // Example background color
    borderRadius: 20,
    padding: 10,
  },
  addButtonIcon: {
    color: "#ffffff", // Example icon color
  },
});

export default DiaryScreen;
