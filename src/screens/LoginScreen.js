import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    ImageBackground,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { auth, db } from '../config/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';


export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleAuth = async () => {
        if(!email.trim() || !password.trim()) {
            Alert.alert('Missing Info', 'Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            if(isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                console.log('User signed in successfully');
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    email: user.email,
                    displayName: displayName,
                });
                console.log('User registered successfully');
            }
        } catch (error) {
            let errorMessage = 'An error occurred. Please try again.';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'Invalid email or password. Please try again.';
            } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already in use. Please use a different email.';
            }
            Alert.alert('Authentication Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ImageBackground
            source={require('../../assets/images/forest.jpg')}
            style={styles.background}
        >
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <BlurView intensity={80} tint='dark' style={styles.glassPanel}>
                        <View>
                            <Ionicons name='chatbubble-ellipses-outline' size={32} color="#f9fafb" />
                        </View>
                    <Text style={styles.title}>{isLogin ? 'Welcome Back!' : 'Create an Account'}</Text>
                    <Text style={styles.subtitle}>
                        {isLogin ? 'Sign in to continue' : 'Create an account to get started'}
                    </Text>
                    {!isLogin && (
                    <View style={styles.inputWrapper}>
                        <Ionicons name='person-outline' size={20} color="#f9fafb" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input} 
                        placeholder="Display Name"
                        placeholderTextColor="#9ca3af"
                        value={displayName} 
                        onChangeText={setDisplayName}
                    />
                    </View>
                )}
                <View style={styles.inputWrapper}>
                    <Ionicons name='mail-outline' size={20} color="#f9fafb" style={styles.inputIcon} />
                <TextInput 
                    style={styles.input} 
                    placeholder="Enter your email"
                    placeholderTextColor="#9ca3af"
                    value={email} 
                    onChangeText={setEmail}
                    keyboardType='email-address' 
                    autoCapitalize='none'
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Ionicons name='lock-closed-outline' size={20} color="#f9fafb" style={styles.inputIcon} />
                <TextInput 
                    style={styles.input} 
                    placeholder="Password"
                    placeholderTextColor="#9ca3af"
                    value={password} 
                    onChangeText={setPassword} 
                    secureTextEntry 
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
                    {loading ? (<ActivityIndicator color="#f9fafb" />) : (<Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>)}
                </TouchableOpacity>

                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleText}>
                        {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
                    </Text>
                <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                    <Text style={[styles.toggleText, styles.toggleLink]}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
                </TouchableOpacity>
            </View>
            </BlurView>
            </View>
        </SafeAreaView>
        </KeyboardAvoidingView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  glassPanel: {
    padding: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(55, 65, 81, 0.7)', 
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f9fafb', 
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#d1d5db', 
    textAlign: 'center',
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 65, 81, 0.7)',
    borderRadius: 12,
    marginBottom: 16,
  },
  inputIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#f9fafb',
  },
  button: {
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    marginTop: 8,
  },
  buttonText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  toggleText: {
    color: '#d1d5db',
    fontSize: 14,
  },
  toggleLink: {
    fontWeight: 'bold',
    color: '#60a5fa', 
  },
})