import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuItem } from 'react-native-material-menu';
import { FontAwesome } from '@expo/vector-icons';

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function Layout() {
    const router = useRouter();
    const segments = useSegments();
    const [modalVisible, setModalVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    const isHeaderPage = segments.includes('home') || segments.includes('chat') || segments.includes('profile');

    const signOut = async () => {
        await AsyncStorage.removeItem("user");
        setModalVisible(false);
        router.replace("/index");
    };

    const goToProfile = () => {
        setMenuVisible(false);
        router.push("/profile");
    };

    return (
        <>
            <Stack
                screenOptions={({ route }) => {
                    const title = capitalizeFirstLetter(route.name); // Capitalize the title
                    return {
                        headerShown: isHeaderPage,
                        headerStyle: {
                            backgroundColor: '#075E54',
                        },
                        headerTintColor: '#fff',
                        headerTitle: title, // Set the capitalized title
                        headerRight: route.name === 'home' ? () => (
                            <Menu
                                visible={menuVisible}
                                anchor={
                                    <Pressable onPress={() => setMenuVisible(true)} style={{ marginRight: 10 }}>
                                        <FontAwesome name="cog" size={30} color="white" />
                                    </Pressable>
                                }
                                onRequestClose={() => setMenuVisible(false)}
                            >
                                <MenuItem onPress={goToProfile}>Profile</MenuItem>
                                <MenuItem onPress={() => { setMenuVisible(false); setModalVisible(true); }}>Sign Out</MenuItem>
                            </Menu>
                        ) : null,
                    };
                }}
            />

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Confirm Sign Out</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to sign out?</Text>

                        <View style={styles.buttonContainer}>
                            <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.confirmButton} onPress={signOut}>
                                <Text style={styles.buttonText}>Sign Out</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalMessage: {
        marginVertical: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        marginRight: 10,
        padding: 10,
        backgroundColor: '#f00',
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#0f0',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
    },
});