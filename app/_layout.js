import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();
  const [modalVisible, setModalVisible] = useState(false);

  // Define pages where the header should be shown
  const isHeaderPage = segments.includes('home') || segments.includes('chat');

  // Sign-out logic
  const signOut = async () => {
    await AsyncStorage.removeItem("user"); // Clear session or token
    setModalVisible(false);  // Close the modal
    router.replace("/signin");  // Navigate to the SignIn screen
  };

  return (
    <>
      {/* Stack Navigator */}
      <Stack
        screenOptions={({ route }) => ({
          headerShown: isHeaderPage,  // Show header on Home and Chat pages
          headerStyle: {
            backgroundColor: '#075E54', // Custom background color
          },
          headerTintColor: '#fff',  // Custom header text color
          headerRight: route.name === 'home' ? () => (
            <Pressable onPress={() => setModalVisible(true)} style={{ marginRight: 10 }}>
              <Text style={{ color: 'white' }}>Sign Out</Text>
            </Pressable>
          ) : null,
        })}
      />

      {/* Modal for sign-out confirmation */}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 10,  // For Android shadow
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#757575',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: '#d9534f',  // Red for sign-out
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
