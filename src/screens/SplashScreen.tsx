import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const SplashScreen: React.FC = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                navigation.replace("Dashboard" as never);
            } else {
                navigation.replace("Login" as never);
            }
        };

        checkAuth();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#2a9d8f" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default SplashScreen;
