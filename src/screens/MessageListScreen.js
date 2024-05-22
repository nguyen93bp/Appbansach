// MessageListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MessageListScreen = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
    const adminEmail = 'admin@gmail.com'; // Admin's email

    const fetchConversations = async () => {
      try {
        const conversationsRef = firestore()
          .collection('chats')
          .doc(adminEmail)
          .collection('messages');

        const querySnapshot = await conversationsRef.orderBy('createdAt', 'desc').get();

        const groupedConversations = {};

        querySnapshot.forEach((doc) => {
          const firebaseData = doc.data();
          const senderId = firebaseData.user._id;

          // Check if the sender is not the admin itself
          if (senderId !== adminEmail) {
            if (!groupedConversations[senderId]) {
              groupedConversations[senderId] = {
                _id: doc.id,
                user: firebaseData.user || {},
                lastMessage: firebaseData.text || '',
                createdAt: firebaseData.createdAt ? firebaseData.createdAt.toDate() : new Date(),
                // Add a new property to indicate whether the message is read or not
                isRead: firebaseData.isRead || false,
              };
            }
          }
        });

        // Chuyển đổi dữ liệu từ đối tượng sang mảng
        const sortedConversations = Object.values(groupedConversations).sort(
          (a, b) => b.createdAt - a.createdAt
        );

        setConversations(sortedConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  const navigateToAdminChatScreen = (conversation) => {
    // Mark the conversation as read when navigating to the chat screen
    // You might want to update this in your actual implementation
    // Maybe after the user has seen the messages
    markConversationAsRead(conversation);

    navigation.navigate('AdminChatScreen', { conversation });
  };

  const markConversationAsRead = (conversation) => {
    // Update the isRead property in your Firestore database
    // For simplicity, you can update the property locally in the state
    setConversations((prevConversations) =>
      prevConversations.map((c) =>
        c._id === conversation._id ? { ...c, isRead: true } : c
      )
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => navigateToAdminChatScreen(item)}
          >
            <Text style={styles.boldText}>{item.user._id}</Text>
            <Text>{item.lastMessage}</Text>
            {!item.isRead && <View style={styles.unreadIndicator} />}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  conversationItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    position: 'relative', // Necessary for positioning the indicator
  },
  boldText: {
    fontWeight: 'bold',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 6, // Adjust the position based on your design
    right: 6, // Adjust the position based on your design
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
  },
});

export default MessageListScreen;
