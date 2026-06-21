import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f9ff" />

            {/* Top bar with login */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
            </View>

            {/* Main content */}
            <View style={styles.content}>
                {/* Logo above the title */}
                <Image
                    source={require("../../assets/logo.png")} // 👈 adjust path if needed
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>🧺 Laundry Services</Text>
                <Text style={styles.subtitle}>
                    Fast. Fresh. Folded.{" "}
                    <Text style={{ fontWeight: "bold" }}>
                        Your trusted laundry partner in town.
                    </Text>
                </Text>
            </View>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f9ff",
        paddingTop: 40,
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 30,
        paddingBottom: 10,
        marginTop: 20,
    },
    loginText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4a90e2",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        marginTop: -150,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20, // spacing between logo and title
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1e3557",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#5a6b84",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 30,
    },
});
