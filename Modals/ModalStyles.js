import { StyleSheet } from "react-native";

const sharedStyles = {
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    marginTop: 200,
    borderRadius: 40,
  },

  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    width: "100%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },

  input: {
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 25,
    padding: 15,
    marginTop: 20,
    fontSize: 20,
    backgroundColor: "#ecf0f1",
    color: "#2c3e50",
  },

  iconButtonContainer: {
    alignItems: "center",
    padding: 20,
  },
  scrollContentContainer: {
    paddingBottom: 220,
  },
};

const editModalStyles = StyleSheet.create({
  ...sharedStyles,

  EditmodalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  EcancelButton: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  EdoneButton: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
});

const addModalStyles = StyleSheet.create({
  ...sharedStyles,

  // emojis
  PickerContainer: {
    fontSize: 40,
    textAlign: "center",
    color: "white",
  },

  locationPickerItem: {
    fontSize: 40,
    textAlign: "center",
    color: "white",
  },

  /////
  modalButtonsAdd: {
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

  ACancelIcon: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    backgroundColor: "#ff6347",
    borderRadius: 15,
  },

  ACheckIcon: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    backgroundColor: "#2ecc71",
    borderRadius: 15,
    marginLeft: 10,
  },

  APhotoIcon: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    backgroundColor: "transparent",
    borderRadius: 20,
    marginLeft: 10,
  },

  ATeaIcon: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    backgroundColor: "transparent",
    borderRadius: 20,
    marginLeft: 10,
  },
  ALocationIcon: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    backgroundColor: "transparent",
    borderRadius: 20,
    marginLeft: 10,
  },

  uploadedImage: {
    marginTop: 20,
    width: "60%",
    height: 200,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emotionOnModal: {
    textAlign: "center",
    fontSize: 60,
    marginTop: 10,
    color: "#FF69B4",
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    padding: 50,
  },
  locationOnModal: {
    textAlign: "center",
    fontSize: 26,
    marginTop: 5,
    color: "#666",
    fontStyle: "italic",
  },

  selectedInfoContainer3: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  selectedInfoContainer2: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

export { editModalStyles, addModalStyles };
