// AdminChatScreen.js
import React, { useState, useEffect } from 'react';
import { GiftedChat, InputToolbar, Send, Bubble } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text } from 'react-native';

const AdminChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [customerName, setCustomerName] = useState(''); // State để lưu tên của customer
  const customerEmail = route.params?.conversation?.user?._id; // Customer's email

  useEffect(() => {
    const user = auth().currentUser;
    
      if (user) {
        // Lấy thông tin về người dùng Customer
        const customerDocRef = firestore().collection('USERS').doc(customerEmail);

        customerDocRef.get().then((customerDoc) => {
        if (customerDoc.exists) {
          const customerData = customerDoc.data();
          setCustomerName(customerData.name || ''); // Lưu tên của customer vào state
        }
    });

      const chatRef = firestore()
        .collection('chats')
        .doc(user.email)
        .collection('messages');

      const unsubscribe = chatRef.orderBy('createdAt', 'desc').onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          return {
            _id: doc.id,
            text: firebaseData.text || '',
            createdAt: firebaseData.createdAt ? firebaseData.createdAt.toDate() : new Date().getTime(),
            user: firebaseData.user || {},
          };
        });

        setMessages(messages);
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);
  
  const onSend = async (newMessages = []) => {
    const user = auth().currentUser;

    if (user) {
      const chatRef = firestore()
        .collection('chats')
        .doc(user.email)
        .collection('messages');

      const adminChatRef = firestore()
        .collection('chats')
        .doc(customerEmail)
        .collection('messages');

      const newMessage = newMessages[0];

      await chatRef.add({
        ...newMessage,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await adminChatRef.add({
        ...newMessage,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    }
  };
  
  return (
    <View style={{ flex: 1 }}>
      {/* Hiển thị thông báo trên đầu màn hình */}
      <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 10, backgroundColor: 'blue' }}>
        <Text style={{ color: 'white' }}>Đang trò chuyện với: {customerName}</Text>
      </View>

      {/* Hiển thị GiftedChat */}
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{ _id: auth().currentUser?.email }}
        renderInputToolbar={(props) => <InputToolbar {...props} />}
        renderSend={(props) => (
          <View style={{ alignItems: 'center', paddingBottom: 10 }}>
            <Send {...props}>
              <Ionicons name="send" size={30} color="blue" />
            </Send>
          </View>
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: '#E6E6E6', // Màu bong bóng chat của đối phương
              },
            }}
          />
        )}
      />
    </View>
  );
};

export default AdminChatScreen;
