import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  date?: string;
}

const ChatPage = () => {
  const params = useLocalSearchParams();
  const { userName, userImage, isOnline, lastSeen } = params;
  
  const [message, setMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const flatListRef = useRef<FlatList>(null);

  // Sample messages
  const [messages] = useState<Message[]>([
    {
      id: '1',
      text: 'Happy to connect!',
      timestamp: '15 10:15 pm',
      isSent: false,
      date: '15/06/2025'
    },
    {
      id: '2',
      text: 'Hji',
      timestamp: '20 08:57 pm',
      isSent: true,
      date: '20/06/2025'
    }
  ]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const showDate = index === 0 || messages[index - 1].date !== item.date;
    
    return (
      <View>
        {showDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        )}
        <View style={[
          styles.messageContainer,
          item.isSent ? styles.sentMessage : styles.receivedMessage
        ]}>
          <Text style={[
            styles.messageText,
            item.isSent ? styles.sentMessageText : styles.receivedMessageText
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestampText,
            item.isSent ? styles.sentTimestamp : styles.receivedTimestamp
          ]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0F172A", "#1E293B", "#334155"]} style={styles.gradient}>
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.userInfo}>
                <Image 
                  source={{ uri: userImage as string }} 
                  style={styles.userImage} 
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{userName}</Text>
                  <Text style={styles.userStatus}>
                    {isOnline === 'true' ? 'Online' : 'Offline'}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            />

            {/* Message Input */}
            <View style={styles.inputContainer}>
              <View style={styles.messageInputContainer}>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Type a message..."
                  placeholderTextColor="#64748B"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                />
              </View>
              
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSendMessage}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#F59E0B', '#FBBF24']}
                  style={styles.sendButtonGradient}
                >
                  <Ionicons name="send" size={20} color="#0F172A" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 14,
    color: '#94A3B8',
  },
  moreButton: {
    padding: 4,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#F59E0B',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  sentMessageText: {
    color: '#0F172A',
  },
  receivedMessageText: {
    color: '#FFFFFF',
  },
  timestampText: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  sentTimestamp: {
    color: 'rgba(15, 23, 42, 0.7)',
  },
  receivedTimestamp: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageInputContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxHeight: 100,
  },
  messageInput: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlignVertical: 'center',
  },
  sendButton: {
    borderRadius: 25,
  },
  sendButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatPage;