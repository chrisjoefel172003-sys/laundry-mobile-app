import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Modal,
    Pressable,
    LayoutRectangle,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

// --- AboutScreen
const AboutScreen: React.FC = () => {
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

    return (
        <View style={{ flex: 1, backgroundColor: "#f4f6f9" }}>
            {/* Top Safe Area + Title */}
            <SafeAreaView edges={['top']} style={{ backgroundColor: "#fff", paddingTop: insets.top / 2 }}>
                <Text style={styles.topTitle}>Laundry Shop Management System</Text>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>About Our Laundry Services</Text>
                <Text style={styles.text}>
                    Welcome to our Laundry Service! We provide fast, reliable, and
                    convenient laundry solutions for all types of clothing and fabrics.
                </Text>
                <Text style={styles.text}>Our services include:</Text>
                <Text style={styles.listItem}>• Wash and Fold</Text>
                <Text style={styles.listItem}>• Dry Cleaning</Text>
                <Text style={styles.listItem}>• Pickup and Delivery</Text>
                <Text style={styles.text}>
                    We use eco-friendly detergents and modern machines to ensure your clothes
                    are cleaned efficiently and gently. Our goal is to make your life easier
                    and keep your wardrobe fresh and clean.
                </Text>
                <Text style={styles.text}>
                    Thank you for choosing our laundry service. We look forward to serving you
                    and making laundry day hassle-free!
                </Text>
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
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
    text: { fontSize: 14, color: "#333", marginBottom: 10, lineHeight: 20 },
    listItem: { fontSize: 14, color: "#333", marginLeft: 10, marginBottom: 5, lineHeight: 20 },
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

export default AboutScreen;
