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
import { useNavigation } from "@react-navigation/native"; // ✅ import navigation

const RegisterScreen: React.FC = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigation = useNavigation(); // ✅ init navigation

    const handleRegister = async () => {
        if (!name || !username || !password || !confirmPassword) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("https://primeaxis-tech.com/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    name,
                    username,
                    password,
                    password_confirmation: confirmPassword, // Laravel expects this
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Account created successfully!");
                navigation.navigate("Login" as never); //
            } else {
                Alert.alert("Register Failed", data.message || "Something went wrong.");
            }
        } catch (error) {
            Alert.alert("Error", "Unable to connect to server");
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>Register</Text>

            {/* Name */}
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
            />

            {/* Username */}
            <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
            />

            {/* Password */}
            <View style={styles.passwordWrapper}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#888"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Icon
                        name={showPassword ? "eye" : "eye-off"}
                        size={22}
                        color="#888"
                    />
                </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View style={styles.passwordWrapper}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm your password"
                    placeholderTextColor="#888"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <Icon
                        name={showConfirmPassword ? "eye" : "eye-off"}
                        size={22}
                        color="#888"
                    />
                </TouchableOpacity>
            </View>

            {/* Register button */}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            {/* Already have an account? */}
            <View style={styles.loginLinkWrapper}>
                <Text style={styles.linkText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
                    <Text style={[styles.linkText, { color: "#007bff", fontWeight: "bold" }]}>
                        Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RegisterScreen;

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
        paddingRight: 40,
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
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    loginLinkWrapper: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "center",
    },
    linkText: {
        fontSize: 14,
        color: "#444",
    },
});
