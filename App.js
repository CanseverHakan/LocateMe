import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import input from './reducers/inputValue';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import PlaceScreen from "./screens/PlacesScreen";

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const store = configureStore({
  reducer: { input }
})

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === "Map") {
            iconName = 'location-arrow'
          } else if (route.name === "Place") {
            iconName = 'map-pin'
          }
          return <FontAwesome name={iconName} size={30} color={color}></FontAwesome>
        },
        tabBarActiveTintColor: '#B733D0',
        tabBarInactiveTintColor: '#335561',
      })}
    >
      <Tab.Screen name="Map" component={MapScreen}></Tab.Screen>
      <Tab.Screen name="Place" component={PlaceScreen}></Tab.Screen>
    </Tab.Navigator>
  )
}


export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
          <Stack.Screen name="TabNavigator" component={TabNavigator}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
