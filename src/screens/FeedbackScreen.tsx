import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Modal,
    Pressable,
    Alert,
    Image,
    LayoutRectangle,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// --- Reusable Sticky Header Component
const HeaderNav: React.FC<{
    setShowProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
    onProfileLayout: (layout: LayoutRectangle) => void;
}> = ({ setShowProfileMenu, onProfileLayout }) => {
    const navigation = useNavigation();
    const route = useRoute();

    const navItems: { screen: string; icon: any }[] = [
        { screen: "Dashboard", icon: require("../../assets/dashboard.png") },
        { screen: "Order", icon: require("../../assets/inquire.png") },
        { screen: "Feedback", icon: require("../../assets/feedback.png") },
        { screen: "About", icon: require("../../assets/about.png") },
    ];

    return (
        <View style={styles.header}>
            {navItems.map((item, index) => {
                const isActive = route.name === item.screen;
                return (
                    <TouchableOpacity
                        key={index}
                        style={styles.navItemFull}
                        onPress={() => navigation.navigate(item.screen as never)}
                        activeOpacity={0.7}
                    >
                        <Image source={item.icon} style={styles.navIcon} />
                        {isActive && <View style={styles.activeUnderline} />}
                    </TouchableOpacity>
                );
            })}

            <TouchableOpacity
                onPress={() => setShowProfileMenu(true)}
                style={styles.navItemFull}
                activeOpacity={0.7}
                onLayout={(event) => onProfileLayout(event.nativeEvent.layout)}
            >
                <Image source={require("../../assets/profile.jpg")} style={styles.profileIcon} />
            </TouchableOpacity>
        </View>
    );
};

// --- FeedbackScreen
const FeedbackScreen: React.FC = () => {
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState(0);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [profileLayout, setProfileLayout] = useState<LayoutRectangle | null>(null);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            navigation.replace("Home" as never);
        } catch (error) {
            console.error(error);
            alert("Unable to logout. Please try again.");
        }
    };

    const submitFeedback = async () => {
        if (!feedback) {
            Alert.alert("Validation Error", "Please enter your comment.");
            return;
        }
        if (rating === 0) {
            Alert.alert("Validation Error", "Please select a star rating.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch("https://primeaxis-tech.com/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ comment: feedback, rating }),
            });
            const data = await response.json();

            if (response.ok) {
                Alert.alert("Thank you!", "Your feedback has been submitted.", [
                    { text: "OK", onPress: () => setFeedback("") },
                ]);
                setRating(0);
            } else {
                Alert.alert("Error", data.message || "Failed to submit feedback.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Unable to connect to server.");
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#f4f6f9" }}>
            {/* Top Title */}
            <SafeAreaView edges={['top']} style={{ backgroundColor: "#fff", paddingTop: insets.top / 2 }}>
                <Text style={styles.topTitle}>Laundry Shop Management System</Text>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Feedback</Text>
                <Text style={styles.label}>Your Comment</Text>
                <TextInput
                    style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                    multiline
                    numberOfLines={4}
                    placeholder="Write your feedback here..."
                    value={feedback}
                    onChangeText={setFeedback}
                />

                <Text style={styles.label}>Rate Our Service</Text>
                <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => setRating(star)}>
                            <MaterialIcons
                                name={star <= rating ? "star" : "star-border"}
                                size={32}
                                color="#f4c430"
                                style={{ marginHorizontal: 5 }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.button} onPress={submitFeedback}>
                    <Text style={styles.buttonText}>Submit Feedback</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Profile Menu Modal */}
            {profileLayout && (
                <Modal
                    visible={showProfileMenu}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowProfileMenu(false)}
                >
                    <Pressable style={styles.modalOverlay} onPress={() => setShowProfileMenu(false)}>
                        <View
                            style={[
                                styles.modalContentDropdown,
                                {
                                    bottom: profileLayout.height + 10,
                                    right: 20,
                                },
                            ]}
                        >
                            <TouchableOpacity onPress={handleLogout} style={styles.modalButton}>
                                <Text style={{ color: "#e74c3c", fontWeight: "bold" }}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Modal>
            )}

            {/* Bottom Nav */}
            <SafeAreaView edges={['bottom']} style={{ backgroundColor: "#fff" }}>
                <HeaderNav setShowProfileMenu={setShowProfileMenu} onProfileLayout={setProfileLayout} />
            </SafeAreaView>
        </View>
    );
};

// --- Styles
const styles = StyleSheet.create({
    content: { padding: 20, paddingBottom: 100 },
    topTitle: { fontSize: 20, fontWeight: "bold", color: "#2a9d8f", textAlign: "center", marginBottom: 5 },
    header: {
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1000,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 8,
    },
    navItemFull: { alignItems: "center" },
    navIcon: { width: 30, height: 30 },
    profileIcon: { width: 30, height: 30, borderRadius: 20 },
    activeUnderline: { marginTop: 5, height: 3, width: "50%", backgroundColor: "#2a9d8f", borderRadius: 2 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    label: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, backgroundColor: "#fff", fontSize: 14, marginBottom: 15 },
    starRow: { flexDirection: "row", marginBottom: 20 },
    button: { backgroundColor: "#2a9d8f", padding: 15, borderRadius: 8, alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
    modalContentDropdown: {
        position: "absolute",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 10,
        elevation: 5,
    },
    modalButton: { paddingVertical: 10, paddingHorizontal: 20 },
});

export default FeedbackScreen;
