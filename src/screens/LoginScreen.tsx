import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const LoginScreen: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const response = await fetch("https://primeaxis-tech.com/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {

                //Save token for future requests
                await AsyncStorage.setItem("token", data.token);
                await AsyncStorage.setItem("user", JSON.stringify(data.user));
                //Navigate to dashboard
                navigation.navigate("Dashboard" as never); //
            } else {
                // ❌ login failed
                Alert.alert("Login Failed", data.message || "Invalid credentials");
            }
        } catch (error) {
            Alert.alert("Error", "Unable to connect to server");
            console.error(error);
        }
    };


    const handleForgotPassword = () => {
        Alert.alert("Forgot Password", "Redirecting to password reset...");
    };

    const handleRegister = () => {
        navigation.navigate("Register" as never);
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>Login</Text>

            {/* Username */}
            <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
            />

            {/* Password with toggle */}
            <View style={styles.passwordWrapper}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#888"
                    secureTextEntry={!showPassword} //
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Icon
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={22}
                        color="#888"
                    />
                </TouchableOpacity>
            </View>

            {/* Login button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Forgot Password & Register links */}
            <View style={styles.linkContainer}>
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleRegister}>
                    <Text style={styles.linkText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f9f9f9",
        marginTop: -150,
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "normal",
        marginBottom: 50,
        textAlign: "center",
        marginTop: -5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        backgroundColor: "#fff",
        color: "#000",
    },
    passwordWrapper: {
        position: "relative",
        marginBottom: 15,
    },
    passwordInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        paddingRight: 40, // 👈 space for eye icon
        backgroundColor: "#fff",
        color: "#000",
    },
    eyeIcon: {
        position: "absolute",
        right: 12,
        top: "50%",
        transform: [{ translateY: -11 }],
    },
    button: {
        backgroundColor: "#007bff",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    linkContainer: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    linkText: {
        color: "#007bff",
        fontSize: 14,
    },
});
