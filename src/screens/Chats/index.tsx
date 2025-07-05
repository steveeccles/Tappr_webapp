import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useAppContext } from '../../contexts/AppContext';
import TapprHeader from '../../components/TapprHeader';
import { theme, commonStyles } from '../../styles/theme';

// Mock data
const mockMessages = [
  {
    id: '1',
    senderId: 'user1',
    text: 'Hey, how\'s your day going?',
    timestamp: '10:30 AM'
  },
  {
    id: '2',
    senderId: 'user2',
    text: 'Pretty good! Just working on the app.',
    timestamp: '10:31 AM'
  },
  {
    id: '3',
    senderId: 'user1',
    text: 'Nice one 👍',
    timestamp: '10:32 AM',
    status: 'read'
  }
];

const currentUserId = 'user1';

const MessageBubble = ({ message, isOwnMessage }: { message: any; isOwnMessage: boolean }) => (
  <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
    {!isOwnMessage && (
      <Text style={styles.senderName}>Sarah</Text>
    )}
    <View style={[
      styles.messageBubble,
      isOwnMessage ? styles.ownBubble : styles.otherBubble
    ]}>
      <Text style={styles.messageText}>{message.text}</Text>
    </View>
    <View style={[styles.timestampContainer, isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp]}>
      <Text style={styles.timestamp}>{message.timestamp}</Text>
      {message.status && isOwnMessage && (
        <Text style={styles.status}>✓ {message.status}</Text>
      )}
    </View>
  </View>
);

const ChatsScreen = () => {
  const { notifications, setNotifications } = useAppContext();
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        senderId: currentUserId,
        text: inputText.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      
      // Update notification count
      setNotifications({ chats: notifications.chats + 1, stories: notifications.stories });
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages]);

  // Initial scroll to bottom when component mounts
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 200);
  }, []);

  const renderMessage = ({ item }: { item: any }) => {
    const isOwnMessage = item.senderId === currentUserId;
    return <MessageBubble message={item} isOwnMessage={isOwnMessage} />;
  };

  return (
    <KeyboardAvoidingView 
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TapprHeader 
        title="Sarah"
        showLogo={false}
        showBackButton={true}
        onBackPress={() => {/* TODO: Add navigation back */}}
      />

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>Typing...</Text>
        </View>
      )}

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.gifButton}>
          <Text style={styles.gifButtonText}>GIF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emojiButton}>
          <Feather name="smile" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Feather name="send" size={20} color={inputText.trim() ? "#fff" : "#ccc"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  senderName: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray,
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
  },
  messageContainer: {
    marginVertical: theme.spacing.xs,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.sm,
  },
  ownBubble: {
    backgroundColor: theme.colors.black,
  },
  otherBubble: {
    backgroundColor: theme.colors.primary,
  },
  messageText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.white,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ownTimestamp: {
    justifyContent: 'flex-end',
  },
  otherTimestamp: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  status: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
    color: '#000',
  },
  gifButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  gifButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  emojiButton: {
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#000',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
});
