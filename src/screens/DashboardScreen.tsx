import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
    LayoutRectangle,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface Order {
    id: number;
    customer_name: string;
    contact_number: string;
    address: string;
    service_type: string;
    weight: number;
    total: number;
    order_date: string;
    laundry_status: string;
}

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

const DashboardScreen: React.FC = () => {
    const navigation = useNavigation();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [profileLayout, setProfileLayout] = useState<LayoutRectangle | null>(null);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            navigation.replace("Home" as never);
        } catch (error) {
            console.error("Logout error:", error);
            alert("Unable to logout. Please try again.");
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch("https://primeaxis-tech.com/api/orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                setOrders(data.orders || []);
            } else {
                alert(data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error(error);
            alert("Unable to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Top Title */}
            <SafeAreaView edges={["top"]} style={{ backgroundColor: "#f4f6f9" }}>
                <Text style={[styles.topTitle, { paddingTop: insets.top / 2 }]}>
                    Laundry Shop Management System
                </Text>
            </SafeAreaView>

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtitle}>Manage your laundry services easily.</Text>

                <Text style={styles.tableTitle}>My Orders</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#2a9d8f" />
                ) : (
                    <ScrollView horizontal>
                        <View>
                            <View style={[styles.row, styles.headerRow]}>
                                <Text style={[styles.cell, { width: 60, fontWeight: "bold" }]}>
                                    Type
                                </Text>
                                <Text style={[styles.cell, { width: 60, fontWeight: "bold" }]}>
                                    Weight
                                </Text>
                                <Text style={[styles.cell, { width: 60, fontWeight: "bold" }]}>
                                    Total
                                </Text>
                                <Text style={[styles.cell, { width: 100, fontWeight: "bold" }]}>
                                    Date
                                </Text>
                                <Text style={[styles.cell, { width: 80, fontWeight: "bold" }]}>
                                    Status
                                </Text>
                            </View>
                            {orders.map((item) => (
                                <View key={item.id} style={styles.row}>
                                    <Text style={[styles.cell, { width: 60 }]}>{item.service_type}</Text>
                                    <Text style={[styles.cell, { width: 60 }]}>{item.weight}kg</Text>
                                    <Text style={[styles.cell, { width: 60 }]}>{item.total}</Text>
                                    <Text style={[styles.cell, { width: 100 }]}>{item.created_at}</Text>
                                    <Text style={[styles.cell, { width: 80 }]}>{item.laundry_status}</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </ScrollView>

            {/* Bottom nav */}
            <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#fff" }}>
                <HeaderNav setShowProfileMenu={setShowProfileMenu} onProfileLayout={setProfileLayout} />
            </SafeAreaView>

            {/* Profile Modal Dropdown */}
            {profileLayout && (
                <Modal
                    visible={showProfileMenu}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowProfileMenu(false)}
                >
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setShowProfileMenu(false)}
                    >
                        <View
                            style={[
                                styles.modalContentDropdown,
                                {
                                    top: undefined,
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f4f6f9" },
    topTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2a9d8f",
        textAlign: "center",
        marginBottom: 5,
    },
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
    title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 50 },
    subtitle: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
    tableTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10, marginLeft: 10, marginTop: 30 },
    row: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderColor: "#ddd" },
    headerRow: { backgroundColor: "#e0f7f1" },
    cell: { paddingHorizontal: 5, fontSize: 10, textAlign: "center" },
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

export default DashboardScreen;
