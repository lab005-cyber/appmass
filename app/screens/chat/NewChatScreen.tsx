import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Search, MessageCircle } from 'lucide-react-native';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { searchUsers, startConversation } from '../../store/slices/chatSlice';
import { ChatStackParamList } from '../../navigation/MainNavigator';

export function NewChatScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    const res = await dispatch(searchUsers(text));
    if (searchUsers.fulfilled.match(res)) {
      setResults(res.payload);
    }
    setSearching(false);
  }, [dispatch]);

  const handleSelectUser = async (profile: any) => {
    const res = await dispatch(startConversation({
      participantId: profile.userId,
      participantName: profile.displayName,
    }));
    if (startConversation.fulfilled.match(res)) {
      const conv = res.payload;
      navigation.replace('Chat', {
        conversationId: conv.$id,
        userId: profile.userId,
      });
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.userRow} onPress={() => handleSelectUser(item)}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(item.displayName || '?').charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.displayName}>{item.displayName || 'Unknown'}</Text>
        <Text style={styles.username}>@{item.username}</Text>
      </View>
      <MessageCircle size={20} color="#c15f3c" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Chat</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <Search size={18} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username..."
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {searching && (
        <ActivityIndicator size="small" color="#c15f3c" style={styles.loader} />
      )}

      {!searching && results.length === 0 && query.trim() ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No users found</Text>
        </View>
      ) : null}

      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#f4f3ee',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#1a1a1a',
    paddingVertical: 0,
  },
  loader: {
    marginVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#1a1a1a',
  },
  username: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#6b7280',
  },
});
