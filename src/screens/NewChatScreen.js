import React, { useState, useEffect } from 'react'; 
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { auth, db } from '../config/firebase';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const UserListItem = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.userItem}>
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.displayName.charAt(0)}</Text>
        </View>
        <View>
            <Text style={styles.userName}>{item.displayName}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
        </View>
    </TouchableOpacity>
);

export default function NewChatScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }
        
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('uid', '!=', currentUser.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedUsers = snapshot.docs.map(doc => doc.data());
            setUsers(loadedUsers);
            setLoading(false);
        })
        return unsubscribe;
    }, [currentUser])

    if (loading) {
        return(
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    return(
        <SafeAreaView style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={item => item.uid}
                renderItem={({item}) => (
                    <UserListItem
                        item={item}
                        onPress={() => navigation.navigate('Chat', { otherUser: item })}
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No users found</Text>}
            />
        </SafeAreaView>
    )


}    

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#a78bfa',
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
  userEmail: {
      fontSize: 14,
      color: '#6b7280',
      marginTop: 2,
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 50,
  },
});