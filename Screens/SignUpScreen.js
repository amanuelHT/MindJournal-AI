import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { auth, db } from "../firebase"; // Import Firebase configuration
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

// Import your background image (replace with the actual path)
const backgroundImage = require("../images/background1.jpg");

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    console.log("Handle Sign Up Clicked");
    try {
      if (email.trim() === "" || password.trim() === "") {
        alert("Please fill in both email and password.");
        return;
      }

      // Create a new user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user data in Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        // Add more user data if needed
      });

      // Handle successful signup, e.g., navigate to a new screen
      navigation.navigate("Diary"); // Replace 'Home' with the appropriate screen name
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.2)"]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView behavior="height" style={styles.innerContainer}>
          <Text style={styles.title}>Sign Up</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#fff"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="white"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            Already have an account? Log In
          </Text>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  innerContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "transparent",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: 150,
    height: 150,
    position: "absolute", // Add this line to position the animation absolutely
    bottom: 20, // Adjust this value to move the animation up from the bottom
  },
  title: {
    fontSize: 36,
    marginTop: 70,
    marginBottom: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    width: 300,
    padding: 15,
    marginBottom: 20,
    color: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signUpButton: {
    backgroundColor: "#ff6f61",
    borderRadius: 8,
    padding: 15,
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
  signUpButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  loginLink: {
    marginTop: 20,
    color: "#fff",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default SignUpScreen;