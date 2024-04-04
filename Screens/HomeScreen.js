import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TouchableHighlight,
  Animated,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { LinearGradient } from "expo-linear-gradient";
import { db } from "../firebase"; // Import your Firebase firestore instance
import { collection, getDocs, query, where } from "firebase/firestore";

const HomeScreen = () => {
  const [diaryEntry, setDiaryEntry] = useState(null);
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    fetchRandomDiaryEntry();
    fadeIn();
  }, []);

  const fetchRandomDiaryEntry = async () => {
    try {
      const diaryRandomCollectionRef = collection(db, "RandomDiary");
      const q = query(diaryRandomCollectionRef);

      const querySnapshot = await getDocs(q);

      const entryList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entryList.push({
          id: doc.id,
          RandomD: data.RandomD,
        });
      });

      // Shuffle the entries to make them random
      const shuffledEntries = entryList.sort(() => Math.random() - 0.5);

      // Get the first entry (you can modify this to get a different random entry)
      const randomEntry = shuffledEntries[0];

      setDiaryEntry(randomEntry);
    } catch (error) {
      console.error("Error fetching random diary entry:", error.message);
    }
  };
  const formatDateString = () => {
    const startYear = 1900;
    const currentYear = new Date().getFullYear();

    const randomYear =
      Math.floor(Math.random() * (currentYear - startYear + 1)) + startYear;
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomDay = Math.floor(Math.random() * 28) + 1; // Assuming all months have 28 days for simplicity

    const formattedDate = new Date(randomYear, randomMonth - 1, randomDay);
    return formattedDate.toDateString();
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const goToSignIn = () => {
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      source={require("../images/background1.jpg")}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0.6)"]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
              <View style={styles.animationContainer}></View>
              <Text style={styles.title}>{formatDateString()}</Text>
              {diaryEntry && (
                <Text style={styles.quoteText}>{diaryEntry.RandomD}</Text>
              )}
              <View style={styles.buttonContainer}>
                <TouchableHighlight
                  underlayColor="#3498db"
                  onPress={goToSignIn}
                  style={styles.linkButton}
                >
                  <Text style={styles.linkText}>
                    Log in. Write. Reflect. Your digital diary, your story.
                  </Text>
                </TouchableHighlight>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
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
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "transparent",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  animationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    color: "#fff",

    marginBottom: 10,
    textAlign: "center",
  },
  quoteText: {
    fontSize: 18,
    textAlign: "center",
    color: "#fff",

    fontStyle: "italic",
    lineHeight: 28,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
    width: "100%",
  },
  linkButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#3498db",
    borderRadius: 10,
    elevation: 5,
  },
  linkText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});

export default HomeScreen;
