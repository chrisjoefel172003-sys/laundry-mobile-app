import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import OrderScreen from "../screens/OrderScreen";
import SplashScreen from "../screens/SplashScreen";
import AboutScreen from "../screens/AboutScreen";
import FeedbackScreen from "../screens/FeedbackScreen";

export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
    Order: undefined;
    Splash: undefined;
    About: undefined;
    Feedback: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Order" component={OrderScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
