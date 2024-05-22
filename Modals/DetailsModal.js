import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const DetailsModal = ({
  isModalVisible,
  setModalVisible,
  children,
  expanded,
  onEditPress,
  onDeletePress,
}) => {
  const animation = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const toValue = expanded ? 1 : 0;

    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 700],
  });

  const handleFullPagePress = () => {
    setModalVisible(true);
  };

  const handleBackPress = () => {
    setModalVisible(false);
    navigation.navigate("Diary");
  };
  // her are the intry function.
  const handleDeletePress = () => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this entry?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            // Invoke the onDeletePress callback to handle the deletion
            onDeletePress();
            // Optionally, you can close the modal after deletion
            setModalVisible(false);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View>
      <TouchableOpacity onPress={handleFullPagePress}>
        <Animated.View style={[styles.container, { height: animatedHeight }]}>
          {children}
        </Animated.View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalButtonsDetails}>
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.DBackIcon}
            >
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onEditPress} style={styles.DEditIcon}>
              <AntDesign name="edit" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeletePress}
              style={styles.DDeleteIcon}
            >
              <AntDesign name="delete" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {children}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};
//  style the creating
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderColor: "white",
    shadowColor: "#dcdcdc",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 2.27,
    shadowRadius: 2.65,
    elevation: 3,
    overflow: "hidden",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    marginTop: 200,
    borderRadius: 40,
  },
  scrollContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalButtonsDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "transparent",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  DBackIcon: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    backgroundColor: "#2196F3",
    borderRadius: 15,
  },
  DEditIcon: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FF6347",
    borderRadius: 15,
    marginLeft: 10,
  },
  DDeleteIcon: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FF0000",
    borderRadius: 15,
    marginLeft: 10,
  },
});

export default DetailsModal;
