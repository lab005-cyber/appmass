import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  ArrowLeft,
  Phone,
  Paperclip,
  Send,
  Mic,
  Check,
  CheckCheck,
} from 'lucide-react-native';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import { sendChatMessage, fetchMessages } from '../../store/slices/chatSlice';
import { addMessage } from '../../store/slices/chatSlice';
import { subscribeToMessages } from '../../services/messaging';
import { formatDate } from '../../utils/helpers';
import { ChatStackParamList } from '../../navigation/MainNavigator';

function MessageBubble({ message, isOwn }: { message: any; isOwn: boolean }) {
  return (
    <View style={[styles.messageRow, isOwn ? styles.ownRow : styles.receivedRow]}>
      <View
        style={[styles.messageBubble, isOwn ? styles.ownBubble : styles.receivedBubble]}
      >
        <Text style={[styles.messageText, isOwn ? styles.ownText : styles.receivedText]}>
          {message.content}
        </Text>
        <View style={styles.messageMeta}>
          <Text style={[styles.messageTime, isOwn ? styles.ownTime : styles.receivedTime]}>
            {formatDate(new Date(message.createdAt || message.timestamp))}
          </Text>
          {isOwn && (
            <>
              {message.read ? (
                <CheckCheck size={14} color="#81c784" />
              ) : (
                <Check size={14} color="#ffffff" />
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

export function ChatScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
  const route = useRoute<RouteProp<ChatStackParamList, 'Chat'>>();
  const { conversationId, userId } = route.params;
  const dispatch = useAppDispatch();
  const { messages } = useAppSelector((state) => state.chat);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const conversationMessages = messages[conversationId] || [];

  useEffect(() => {
    dispatch(fetchMessages(conversationId));
  }, [dispatch, conversationId]);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(conversationId, (msg) => {
      dispatch(addMessage({ conversationId, message: msg }));
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [dispatch, conversationId]);

  useEffect(() => {
    if (conversationMessages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [conversationMessages.length]);

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    dispatch(sendChatMessage({ conversationId, content: inputText.trim() }));
    setInputText('');
  }, [inputText, dispatch, conversationId]);

  const renderItem = ({ item }: { item: any }) => (
    <MessageBubble message={item} isOwn={item.senderId !== userId} />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>U</Text>
          </View>
          <Text style={styles.headerName} numberOfLines={1}>
            Chat
          </Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Phone size={22} color="#c15f3c" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={conversationMessages}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.$id || `msg-${index}`}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.inputAction}>
            <Paperclip size={22} color="#6b7280" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Message..."
            placeholderTextColor="#9ca3af"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          {inputText.trim() ? (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Send size={20} color="#ffffff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.inputAction}>
              <Mic size={22} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ee',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#f4f3ee',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#ffffff',
  },
  headerName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#1a1a1a',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
  messageRow: {
    marginBottom: 8,
  },
  ownRow: {
    alignItems: 'flex-end',
  },
  receivedRow: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ownBubble: {
    backgroundColor: '#c15f3c',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    lineHeight: 20,
  },
  ownText: {
    color: '#ffffff',
  },
  receivedText: {
    color: '#1a1a1a',
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },
  ownTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  receivedTime: {
    color: '#9ca3af',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 8,
  },
  inputAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#1a1a1a',
    backgroundColor: '#f4f3ee',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
