import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    Modal,
    Pressable,
    LayoutRectangle,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
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

// --- OrderScreen
const OrderScreen: React.FC = () => {
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [serviceType, setServiceType] = useState("Delivery");
    const [weight, setWeight] = useState("");
    const [total, setTotal] = useState(0);
    const [orderDate, setOrderDate] = useState("");
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [profileLayout, setProfileLayout] = useState<LayoutRectangle | null>(null);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem("user");
                if (userData) {
                    const user = JSON.parse(userData);
                    setName(user.name);
                }
            } catch (e) {
                console.log("Error loading user", e);
            }
        };

        const today = new Date().toISOString().split("T")[0];
        setOrderDate(today);

        loadUser();
    }, []);

    // useEffect(() => {
    //     const w = parseFloat(weight);
    //     if (!isNaN(w)) setTotal(w * 36);
    //     else setTotal(0);
    // }, [weight]);

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

    const handleSubmit = async () => {
        if (!name || !contact || !address || !serviceType || !orderDate) {
            Alert.alert("Validation Error", "All fields are required.");
            return;
        }
        if (contact.length !== 11) {
            Alert.alert("Validation Error", "Contact number must be 11 digits.");
            return;
        }
        // const weightNumber = parseFloat(weight);
        // if (isNaN(weightNumber) || weightNumber <= 0) {
        //     Alert.alert("Validation Error", "Weight must be a positive number.");
        //     return;
        // }

        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(
                "https://primeaxis-tech.com/api/orders",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        customer_name: name,
                        contact_number: contact,
                        address,
                        service_type: serviceType,
                        // weight: weightNumber,
                        // total,
                        order_date: orderDate,
                    }),
                }
            );
            const data = await response.json();

            if (response.ok) {
                Alert.alert(
                    "Success",
                    data.message || "Inquire placed successfully! Please check your dashboard for an update.",
                    [{ text: "OK", onPress: () => navigation.navigate("Dashboard" as never) }]
                );
            } else {
                Alert.alert("Error", data.message || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Unable to connect to server");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Top Title */}
            <SafeAreaView edges={["top"]} style={{ backgroundColor: "#fff", paddingTop: insets.top / 2 }}>
                <Text style={styles.topTitle}>Laundry Shop Management System</Text>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Inquire Laundry Order</Text>

                <Text style={styles.label}>Customer Name <Text style={{ color: "red" }}>*</Text></Text>
                <TextInput style={styles.input} value={name} editable={false} />

                <Text style={styles.label}>Contact Number <Text style={{ color: "red" }}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={11}
                    value={contact}
                    onChangeText={(text) => setContact(text.replace(/[^0-9]/g, ""))}
                    placeholder="Enter 11-digit number"
                />

                <Text style={styles.label}>Address <Text style={{ color: "red" }}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter address"
                />

                <Text style={styles.label}>Service Type <Text style={{ color: "red" }}>*</Text></Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={serviceType}
                        onValueChange={(itemValue) => setServiceType(itemValue)}
                        style={{ width: "100%", height: 52, color: "#000" }}
                    >
                        <Picker.Item label="Delivery" value="Delivery" />
                        <Picker.Item label="Pickup" value="Pickup" />
                    </Picker>
                </View>

                {/* <Text style={styles.label}>Weight (kg) <Text style={{ color: "red" }}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={(text) => setWeight(text.replace(/[^0-9.]/g, ""))}
                    placeholder="Enter weight in kg"
                /> */}

                {/* <Text style={styles.label}>Total (₱)</Text>
                <TextInput style={styles.input} value={total.toString()} editable={false} /> */}

                <Text style={styles.label}>Order Date</Text>
                <TextInput style={styles.input} value={orderDate} editable={false} />


                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Place Order</Text>
                </TouchableOpacity>

                {/* Profile Menu Modal */}
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
            </ScrollView>

            {/* Bottom Nav */}
            <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#fff" }}>
                <HeaderNav setShowProfileMenu={setShowProfileMenu} onProfileLayout={setProfileLayout} />
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

// --- Styles
const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: "#fff", paddingBottom: 100 },
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
    label: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 9, borderRadius: 8, marginTop: 1, color: "#000", fontSize: 14 },
    pickerWrapper: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, overflow: "hidden", marginBottom: 6, fontSize: 10 },
    button: { backgroundColor: "#2a9d8f", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 20 },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    title: { fontSize: 16, fontWeight: "bold", marginBottom: 15, textAlign: "center", textTransform: "uppercase", marginTop: 30 },
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

export default OrderScreen;
