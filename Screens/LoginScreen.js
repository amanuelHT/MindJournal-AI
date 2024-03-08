// LoginScreen.js

import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const LoginScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Login Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
    },
});

export default LoginScreen;
