import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { auth, db } from '../config/firebase';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    doc,
    getDoc,
    setDoc,
    increment,
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';



const MessageBubble = ({ message, isCurrentUser }) => ( 
    <Animated.View entering={FadeInDown}>
        <View style={[
            styles.messageContainer,
            isCurrentUser ? styles.currentUserMessageContainer : styles.otherUserMessageContainer
        ]}>
          {!isCurrentUser && (
            <Text style={styles.senderName}>{message.displayName}</Text>
          )}
            <View style={[
                styles.messageBubble,
                isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
            ]}>
                <Text style={styles.messageText}>{message.text}</Text>
            </View>
        </View>
    </Animated.View>
  )


export default function ChatScreen({ route, navigation }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const { otherUser } = route.params;
    const currentUser = auth.currentUser;

    const chatId = [currentUser.uid, otherUser.uid].sort().join('_');
    const messagesCollectionRef = collection(doc(db, 'chats', chatId), 'messages');
    const conversationDocRef = doc(db, 'conversations', chatId);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: otherUser.displayName,
        })
    }, [navigation, otherUser])

    useEffect(() => {
      const fetchCurrentUserProfile = async () => {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setCurrentUserProfile(userDoc.data());
        }
      }
      fetchCurrentUserProfile();
    }, [])

    useLayoutEffect(() => {
      navigation.setOptions({ title: otherUser.displayName })
    }, [navigation, otherUser])

    useEffect(() => {
      const markAsRead = async () => {
        await setDoc(conversationDocRef, {
          unreadCount: {
            [currentUser.uid]: 0
          },
        }, { merge: true })
      }
      markAsRead();
    }, [currentUser.uid, chatId])

    useEffect(() => {
        const q = query(messagesCollectionRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedMessages = snapshot.docs.map(doc => ({
                _id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
            }))
            setMessages(loadedMessages);      
        })
        return unsubscribe;
    }, [chatId])

    const handleSend = async () => {
        if(newMessage.trim() === '') return;

        let profile = currentUserProfile;
        if(!profile) {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            profile = userDoc.data();
            setCurrentUserProfile(profile);
          } else {
            console.error('Could not find current user profile to send message');
            return;
          }
        }

        const messageData = {
            text: newMessage,
            createdAt: serverTimestamp(),
            uid: currentUser.uid,
            displayName: currentUserProfile?.displayName,
        };
        await addDoc(messagesCollectionRef, messageData);

        
        const conversationData = {
          lastMessageText: newMessage,
          lastMessageTimestamp: serverTimestamp(),
          participants: [currentUser.uid, otherUser.uid],
          participantInfo: {
            [currentUser.uid]: currentUserProfile,
            [otherUser.uid]: otherUser,
          },
          unreadCount: {
            [otherUser.uid]: increment(1),
          },
        };

        await setDoc(conversationDocRef, conversationData, { merge: true });

        setNewMessage('');
    }

    return(
        <SafeAreaView style={styles.container}>
              
          <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={80}
                >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <FlatList
                    data={messages}
                    keyExtractor={item => item._id}
                    renderItem={({ item}) => (
                      <MessageBubble message={item} isCurrentUser={item.uid === currentUser.uid} />
                    )} 
                    inverted
                    contentContainerStyle={{ paddingTop: 10 }}
                     />
                </TouchableWithoutFeedback>
                <BlurView intensity={90} tint='light' style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input}
                        placeholder='Type a message...'
                        placeholderTextColor='#000000ff'
                        value={newMessage} 
                        onChangeText={setNewMessage} />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Ionicons name="send" size={24} color="white" />
                    </TouchableOpacity>
                </BlurView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  currentUserMessageContainer: {
    alignItems: 'flex-end',
  },
  otherUserMessageContainer: {
    alignItems: 'flex-start',
  },
  senderName: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  currentUserBubble: {
    backgroundColor: '#663300',
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: '#a53c00ff',
    borderBottomLeftRadius: 4,
    elevation: 1, 
    shadowColor: '#000', 
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#c0c0c0',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    color: 'black',
    paddingHorizontal: 16,
    borderRadius: 99,
    height: 40,
    marginRight: 8,
    shadowColor: '#c0c0c0',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButton: {
    backgroundColor: '#663300',
    paddingHorizontal: 20,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
});