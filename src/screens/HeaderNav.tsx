import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image, Modal, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HeaderNav: React.FC = () => {
    const navigation = useNavigation();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const navItems: { screen: string; icon: any }[] = [
        { screen: "Dashboard", icon: require("../../assets/dashboard.png") },
        { screen: "Order", icon: require("../../assets/inquire.png") },
        { screen: "Feedback", icon: require("../../assets/feedback.png") },
        { screen: "About", icon: require("../../assets/about.png") },
    ];

    return (
        <View style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>Laundry Shop</Text>

            <View style={styles.navItems}>
                {navItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate(item.screen as never)}
                        style={styles.iconWrapper}
                        activeOpacity={0.7}
                    >
                        <Image source={item.icon} style={styles.navIcon} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Profile Icon */}
            <TouchableOpacity onPress={() => setShowProfileMenu(true)}>
                <Image source={require("../../assets/profile.png")} style={styles.profileIcon} />
            </TouchableOpacity>

            {/* Profile Menu */}
            <Modal
                visible={showProfileMenu}
                transparent
                animationType="fade"
                onRequestClose={() => setShowProfileMenu(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setShowProfileMenu(false)}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            onPress={async () => {
                                await navigation.replace("Home" as never);
                            }}
                            style={styles.modalButton}
                        >
                            <Image
                                source={require("../../assets/logout.png")}
                                style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            <Text style={{ color: "#e74c3c", fontWeight: "bold" }}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#f4f6f9",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2a9d8f",
    },
    navItems: { flexDirection: "row", alignItems: "center" },
    iconWrapper: { marginRight: 15 },
    navIcon: { width: 35, height: 35 },
    profileIcon: { width: 30, height: 30 },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-start", alignItems: "flex-end" },
    modalContent: { backgroundColor: "#fff", marginTop: 50, marginRight: 20, borderRadius: 8, padding: 10, elevation: 5 },
    modalButton: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 20 },
});

export default HeaderNav;
