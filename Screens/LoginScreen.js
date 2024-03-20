import React, { useState } from "react"; // Corrected import statement
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    StyleSheet,
    ImageBackground,
} from "react-native";

import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

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

            navigation.navigate("Diary");
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
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View>
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
            <TouchableOpacity style={styles.backToHomeButton} onPress={handleBackToHome}>
                <Text style={styles.backToHomeButtonText}>Back to Home</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        color: 'black',
        backgroundColor: 'white',
        borderRadius: 5,
    },
    signUpButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    signUpButtonText: {
        color: 'white',
    },
    registerLink: {
        color: 'blue',
        marginTop: 15,
    },
    backToHomeButton: {
        marginTop: 15,
    },
    backToHomeButtonText: {
        color: 'blue',
    },
});

export default LoginScreen;
