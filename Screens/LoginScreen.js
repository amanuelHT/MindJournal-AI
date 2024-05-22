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
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const backgroundImage = require("../images/backlogin.jpg");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      if (email.trim() === "" || password.trim() === "") {
        alert("Please fill in both email and password.");
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);

      navigation.reset({
        index: 0,
        routes: [{ name: "Tabs" }],
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignUpNavigation = () => {
    navigation.navigate("SignUp");
  };

  const handleBackToHome = () => {
    navigation.navigate("Home");
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <LinearGradient
        colors={["rgba(0, 0, 0.1, 0.2)", "rgba(0, 0, 0.9, 0.8)"]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <Text style={styles.title}>Log In</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="white"
              keyboardType="email-address"
              autoCapitalize="none"
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
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignIn}>
            <Text style={styles.signUpButtonText}>Log In</Text>
          </TouchableOpacity>
          <Text style={styles.registerLink} onPress={handleSignUpNavigation}>
            Don't have an account? Sign Up
          </Text>
          <TouchableOpacity
            style={styles.backToHomeButton}
            onPress={handleBackToHome}
          >
            <Text style={styles.backToHomeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
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
    color: "white",
    fontSize: 20,
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
  registerLink: {
    marginTop: 20,
    color: "#fff",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  backToHomeButton: {
    marginTop: 20,
    backgroundColor: "#3498db",
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
  backToHomeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default LoginScreen;
