import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity, 
    ActivityIndicator,
    TextInput,
    Platform
} from 'react-native';
import { auth, db } from '../config/firebase';
import { collection, query, onSnapshot, where, orderBy } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';


const formatTimestamp = (timestamp) => {
  if(!timestamp) return '';
  const date = timestamp.toDate();
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if(diffDays === 0) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
}

const UserListItem = ({ item, onPress }) => {
  const currentUser = auth.currentUser;
  const otherUserId = item.participants.find(uid => uid !== currentUser.uid);
  const otherUserInfo = item.participantInfo[otherUserId];

  const unreadCount = item.unreadCount ? item.unreadCount[currentUser.uid] : 0

  if(!otherUserInfo) return null;

  return (
    <TouchableOpacity style={styles.userItem} onPress={onPress}>
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{otherUserInfo.displayName?.charAt(0)}</Text>
        </View>
        <View style={styles.userInfo}>
            <Text style={styles.userName}>{otherUserInfo?.displayName}</Text>
            <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessageText}</Text>
        </View>
        <View style={styles.metaInfo}>
        <Text style={styles.timestamp}>{formatTimestamp(item.lastMessageTimestamp)}</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount}</Text>
          </View>
        )}
        </View>
    </TouchableOpacity>
    )
  }

export default function ChatListScreen({ navigation }) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = auth.currentUser;

    useEffect(() => {
        navigation.setOptions({
            title: 'Chats',
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('NewChat')} style={{ marginRight: 20 }}>
                  <Ionicons name='add' size={24} color='black' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Ionicons name={Platform.OS === 'ios' ? 'ellipsis-vertical' : 'ellipsis-vertical'} size={24} color='black' />
                </TouchableOpacity>
              </View>
            )
        })
    }, [navigation]);

    useEffect(() => {
        if(!currentUser?.uid) {
          setLoading(false);
          return;
        }

        const conversationsCollection = collection(db, 'conversations');
        const q = query (
          conversationsCollection,
          where('participants', 'array-contains', currentUser.uid),
          orderBy('lastMessageTimestamp', 'desc')
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const loadedConversations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          console.log("--- DEBUG: READING FROM DATABASE ---");
          console.log("Current User UID:", currentUser.uid);
          console.log("Query returned", loadedConversations.length, "conversations.");
          if (loadedConversations.length > 0) {
            console.log("First conversation data:", JSON.stringify(loadedConversations[0], null, 2));
          }

          setConversations(loadedConversations);
          setLoading(false);
        })
        return unsubscribe;
    }, []);


    if(loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
        <BlurView intensity={90} tint='light' style={styles.glassPanel}>
            <View style={styles.searchContainer}>
                <Ionicons name='search' size={20} color='6b7280' style={{ marginLeft: 8 }} />
                <TextInput placeholder='Search Chats...' style={styles.searchInput} />
            </View>
            <FlatList 
            data={conversations}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
                const otherUserId = item.participants.find(uid => uid !== currentUser.uid);
                const otherUserInfo = item.participantInfo[otherUserId];
                if(!otherUserInfo) return null;
                return (
                    <UserListItem
                        item={item}
                        onPress={() => {
                            navigation.navigate('Chat', { otherUser: otherUserInfo })
                        }}
                    />
                )
            }}
            />
        </BlurView>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  glassPanel: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden', 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    paddingLeft: 8,
    fontSize: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#663300',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  unreadMessage: {
    color: '#111827',
    fontWeight: 'bold',
  },
  metaInfo: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
  },
  unreadBadge: {
    backgroundColor: '#663300',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
})