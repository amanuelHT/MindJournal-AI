import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);

      if (!user) {
        // If the user is not signed in, navigate to the Login screen
        navigation.navigate("Login");
      } else {
        try {
          const profileDocRef = doc(db, "profile", user.uid);
          const profileSnapshot = await getDoc(profileDocRef);

          if (profileSnapshot.exists()) {
            const profileData = profileSnapshot.data();
            if (profileData) {
              setName(profileData.name || "");
              setProfilePic(profileData.profilePic || "");
            }
          } else {
            console.log("Profile document does not exist for user:", user.uid);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [navigation]);
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser("");
      setName("");
      setProfilePic("");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleProfilePicPress = async () => {
    if (user) {
      try {
        Alert.alert(
          "Choose Profile Picture",
          "Select a source for your profile picture:",
          [
            {
              text: "Choose from Library",
              onPress: async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 1,
                });

                if (!result.canceled) {
                  setProfilePic(result.assets[0].uri);
                  updateProfileData({ profilePic: result.assets[0].uri });
                }
              },
            },
            {
              text: "Take a Photo",
              onPress: async () => {
                const result = await ImagePicker.launchCameraAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 1,
                });

                if (!result.canceled) {
                  setProfilePic(result.assets[0].uri);
                  updateProfileData({ profilePic: result.assets[0].uri });
                }
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
      } catch (error) {
        console.error("Error handling profile picture press:", error);
      }
    }
  };

  const handleNamePress = () => {
    if (user) {
      try {
        Alert.prompt("Edit Name", "Enter your name:", (newName) => {
          if (newName && newName.trim() !== "") {
            setName(newName.trim());
            updateProfileData({ name: newName.trim() });
          }
        });
      } catch (error) {
        console.error("Please log in to write your name:", error);
      }
    }
  };

  const updateProfileData = async (dataToUpdate) => {
    try {
      const profileDocRef = doc(db, "profile", user.uid);
      await setDoc(profileDocRef, {
        ...dataToUpdate,
        userId: user.uid,
      });
    } catch (error) {
      console.error("Error updating profile data:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#3498db", "#3498db", "#2980b9"]}
      style={styles.gradient}
    >
      <Image
        source={require("../images/background1.jpg")}
        style={styles.backgroundImage}
      />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.profileHeader}
          onPress={handleProfilePicPress}
        >
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePicture} />
          ) : (
            <View style={styles.emptyProfilePicture} />
          )}
        </TouchableOpacity>
        <Text style={styles.greetingText} onPress={handleNamePress}>
          Hi, {name}
        </Text>
        {user ? (
          <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>Email: {user.email}</Text>
            <TouchableOpacity
              style={styles.actionButton} // Updated style name
              onPress={handleSignOut}
            >
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>User not signed in</Text>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
    borderWidth: 5,
    borderColor: "#fff",
  },
  emptyProfilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "lightgray",
    marginBottom: 15,
    borderWidth: 5,
    borderColor: "#fff",
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#fff",
  },
  userInfo: {
    alignItems: "center",
  },
  userInfoText: {
    fontSize: 18,
    marginBottom: 15,
    color: "#fff",
  },
  signOutButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  actionButton: {
    backgroundColor: "#3498db", // Consistent color with other buttons
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
});

export default ProfileScreen;
