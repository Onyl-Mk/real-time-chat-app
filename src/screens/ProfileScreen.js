import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { auth, db, storage } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfileScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [uploading, setUploading] = useState(false);
  const currentUser = auth.currentUser;

  const handleToggleEditMode = () => {
    if (editMode) {
      // When cancelling, reset the input's value to the original name
      setDisplayName(userInfo?.displayName || '');
    }
    setEditMode(!editMode);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleToggleEditMode} style={{ marginRight: 10 }}>
          <Text style={styles.headerButtonText}>{editMode ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, editMode, userInfo]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo(userData);
          setDisplayName(userData.displayName);
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, [currentUser]);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to upload an image.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!pickerResult.canceled) {
      uploadImage(pickerResult.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
    
    try {
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, { photoURL: downloadURL });
      
      setUserInfo(prev => ({ ...prev, photoURL: downloadURL }));
      Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error", "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (displayName.trim() === "") {
      Alert.alert("Invalid Name", "Display name cannot be empty.");
      return;
    }
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
        await updateDoc(userDocRef, { displayName: displayName });
        setUserInfo(prev => ({ ...prev, displayName: displayName }));
        setEditMode(false);
        Alert.alert("Success", "Profile updated!");
    } catch (error) {
        console.error("Firebase Update Error:", error);
        Alert.alert("Error", "Could not update profile. Please check Firestore security rules.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BlurView intensity={80} tint="dark" style={styles.glassPanel}>
            <TouchableOpacity onPress={editMode ? handleImagePick : null} disabled={uploading}>
                {userInfo?.photoURL ? (
                    <Image source={{ uri: userInfo.photoURL }} style={styles.avatarImage} />
                ) : (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{userInfo?.displayName?.charAt(0)}</Text>
                    </View>
                )}
                {uploading && <ActivityIndicator style={styles.uploadIndicator} size="large" />}
            </TouchableOpacity>

            {editMode ? (
                <TextInput 
                    style={styles.nameInput}
                    value={displayName}
                    onChangeText={setDisplayName}
                />
            ) : (
                <Text style={styles.displayName}>{userInfo?.displayName}</Text>
            )}
            
            <Text style={styles.email}>{userInfo?.email}</Text>

            {editMode ? (
                <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            )}
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5'
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    glassPanel: {
        width: '100%',
        padding: 24,
        borderRadius: 24,
        overflow: 'hidden',
        alignItems: 'center',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    avatarText: {
        color: 'white',
        fontSize: 48,
        fontWeight: 'bold'
    },
    displayName: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold'
    },
    email: {
        color: '#9ca3af',
        fontSize: 16,
        marginTop: 8,
        marginBottom: 40
    },
    logoutButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }
})