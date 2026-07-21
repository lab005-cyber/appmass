import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { MessageCircle, Plus } from 'lucide-react-native';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import { formatDate } from '../../utils/helpers';
import { fetchConversations } from '../../store/slices/chatSlice';
import { ChatStackParamList } from '../../navigation/MainNavigator';

function ConversationItem({
  item,
  onPress,
}: {
  item: any;
  onPress: () => void;
}) {
  const initials = (item.participantName || 'U')
    .split(' ')
    .map((n: string) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <TouchableOpacity style={styles.conversationItem} onPress={onPress} activeOpacity={0.95}>
      <View style={styles.avatarSection}>
        {item.participantAvatar ? (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar} />
            {item.online && <View style={styles.onlineDot} />}
          </View>
        ) : (
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>{initials}</Text>
            </View>
            {item.online && <View style={styles.onlineDot} />}
          </View>
        )}
      </View>
      <View style={styles.conversationContent}>
        <View style={styles.conversationTop}>
          <Text style={styles.participantName} numberOfLines={1}>
            {item.participantName || 'Unknown'}
          </Text>
          <Text style={styles.timestamp}>
            {item.lastMessageAt ? formatDate(new Date(item.lastMessageAt)) : ''}
          </Text>
        </View>
        <View style={styles.conversationBottom}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage || 'No messages yet'}
          </Text>
          {(item.unreadCount || 0) > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function ConversationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
  const dispatch = useAppDispatch();
  const { conversations, loading } = useAppSelector((state) => state.chat);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchConversations());
    setRefreshing(false);
  }, [dispatch]);

  const renderItem = ({ item }: { item: any }) => (
    <ConversationItem
      item={item}
      onPress={() =>
        navigation.navigate('Chat', {
          conversationId: item.$id,
          userId: item.participantId,
        })
      }
    />
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <MessageCircle size={48} color="#6b7280" />
        <Text style={styles.emptyTitle}>No conversations yet</Text>
        <Text style={styles.emptySubtitle}>
          Start a new chat to begin messaging
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
        <TouchableOpacity style={styles.newChatButton} onPress={() => navigation.navigate('NewChat')}>
          <Plus size={24} color="#c15f3c" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c15f3c" />
        }
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ee',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: '#1a1a1a',
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  avatarSection: {
    marginRight: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#c15f3c',
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    color: '#ffffff',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  conversationContent: {
    flex: 1,
  },
  conversationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#9ca3af',
  },
  conversationBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#c15f3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1a1a1a',
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#6b7280',
    marginTop: 6,
  },
});
