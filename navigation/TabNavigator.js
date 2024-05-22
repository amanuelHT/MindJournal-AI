import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../Screens/HomeScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import DiaryScreen from "../Screens/DiaryScreen";
import SummaryScreen from "../Screens/SummaryScreen";

const tabIcons = {
  Home: "home",
  Profile: "person",
  Diary: "book",
  Summary: "book",
};

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? tabIcons.Home : `${tabIcons.Home}-outline`}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Diary"
        component={DiaryScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? tabIcons.Diary : `${tabIcons.Diary}-outline`}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Summary"
        component={SummaryScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? tabIcons.Summary : `${tabIcons.Summary}-outline`}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? tabIcons.Profile : `${tabIcons.Profile}-outline`}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
