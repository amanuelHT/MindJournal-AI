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
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const HomeScreen = () => {
  const [diaryEntry, setDiaryEntry] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.uid);
        fetchRandomDiaryEntry(user.uid);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setDiaryEntry(null);
        setLoading(false);
      }
    });

    setCurrentDate(new Date().toLocaleDateString());
    fadeIn();

    return unsubscribe;
  }, []);

  useEffect(() => {
    let interval;
    if (userId) {
      interval = setInterval(() => {
        fetchRandomDiaryEntry(userId);
      }, 10000); // 10 seconds
    }

    return () => clearInterval(interval);
  }, [userId]);

  const fetchRandomDiaryEntry = async (uid) => {
    setLoading(true);
    try {
      const diaryCollectionRef = collection(db, "diary");
      const q = query(diaryCollectionRef, where("uid", "==", uid));

      const querySnapshot = await getDocs(q);

      const entryList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entryList.push({
          id: doc.id,
          text: data.text,
        });
      });

      if (entryList.length > 0) {
        // Shuffle the entries to make them random
        const shuffledEntries = entryList.sort(() => Math.random() - 0.5);

        // Get the first entry (constant random entry for session)
        const randomEntry = shuffledEntries[0];

        setDiaryEntry(randomEntry);
      } else {
        setDiaryEntry(null);
      }
    } catch (error) {
      console.error("Error fetching random diary entry:", error.message);
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.title}>{currentDate}</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : diaryEntry ? (
              <Text style={styles.quoteText}>{diaryEntry.text}</Text>
            ) : (
              <Text style={styles.quoteText}></Text>
            )}
            {!isLoggedIn && (
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
            )}
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
  animation: {
    width: 200,
    height: 200,
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
