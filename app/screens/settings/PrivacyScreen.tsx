import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Lock,
  Eye,
  MessageSquare,
  Image,
  UserX,
  VolumeX,
  Hash,
  X,
  ChevronRight,
  User,
} from 'lucide-react-native';

interface ToggleSetting {
  key: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  value: boolean;
}

interface BlockedUser {
  id: string;
  username: string;
  displayName: string;
}

const INITIAL_SETTINGS: ToggleSetting[] = [
  {
    key: 'privateAccount',
    icon: <Lock size={20} color="#6b7280" />,
    label: 'Private Account',
    description: 'When your account is private, only people you approve can see your posts.',
    value: false,
  },
  {
    key: 'onlineStatus',
    icon: <Eye size={20} color="#6b7280" />,
    label: 'Show Online Status',
    description: 'Allow other users to see when you are active on appmass.',
    value: true,
  },
  {
    key: 'readReceipts',
    icon: <MessageSquare size={20} color="#6b7280" />,
    label: 'Read Receipts',
    description: 'Let message senders know when you have read their messages.',
    value: true,
  },
  {
    key: 'storyReplies',
    icon: <Image size={20} color="#6b7280" />,
    label: 'Allow Story Replies',
    description: 'Allow people to reply to your stories.',
    value: true,
  },
];

const BLOCKED_USERS: BlockedUser[] = [
  { id: '1', username: 'spammer123', displayName: 'Spammer Account' },
  { id: '2', username: 'troll4life', displayName: 'Troll User' },
];

const MUTED_USERS: BlockedUser[] = [
  { id: '3', username: 'noisyuser', displayName: 'Noisy User' },
];

export function PrivacyScreen() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [blockedUsers] = useState<BlockedUser[]>(BLOCKED_USERS);
  const [mutedUsers] = useState<BlockedUser[]>(MUTED_USERS);
  const [mutedWords, setMutedWords] = useState<string[]>([
    'spam',
    'scam',
    'inappropriate',
  ]);
  const [newWord, setNewWord] = useState('');

  const toggleSetting = (key: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value: !s.value } : s)),
    );
  };

  const handleUnblock = (user: BlockedUser) => {
    Alert.alert(
      'Unblock User',
      `Unblock @${user.username}? They will be able to see your posts and interact with you.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Unblock', style: 'destructive' },
      ],
    );
  };

  const handleRemoveMutedWord = (word: string) => {
    Alert.alert('Remove Word', `Remove "${word}" from muted words?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setMutedWords((prev) => prev.filter((w) => w !== word));
        },
      },
    ]);
  };

  const handleAddWord = () => {
    const trimmed = newWord.trim().toLowerCase();
    if (!trimmed) return;
    if (mutedWords.includes(trimmed)) {
      Alert.alert('Already Added', 'This word is already in your muted list.');
      return;
    }
    setMutedWords((prev) => [...prev, trimmed]);
    setNewWord('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Privacy</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionCard}>
          {settings.map((setting, index) => (
            <View
              key={setting.key}
              style={[
                styles.settingRow,
                index < settings.length - 1 && styles.settingRowBorder,
              ]}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>{setting.icon}</View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>{setting.label}</Text>
                  <Text style={styles.settingDescription}>
                    {setting.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={setting.value}
                onValueChange={() => toggleSetting(setting.key)}
                trackColor={{ false: '#e5e7eb', true: '#c15f3c80' }}
                thumbColor={setting.value ? '#c15f3c' : '#f4f3ee'}
              />
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Blocked Users</Text>
        <View style={styles.sectionCard}>
          {blockedUsers.length > 0 ? (
            blockedUsers.map((user, index) => (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.userRow,
                  index < blockedUsers.length - 1 && styles.settingRowBorder,
                ]}
                onPress={() => handleUnblock(user)}
              >
                <View style={styles.userRowLeft}>
                  <View style={styles.blockedAvatar}>
                    <Text style={styles.blockedAvatarText}>
                      {user.displayName.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.userDisplayName}>{user.displayName}</Text>
                    <Text style={styles.userUsername}>@{user.username}</Text>
                  </View>
                </View>
                <Text style={styles.unblockText}>Unblock</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>No blocked users</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Muted Users</Text>
        <View style={styles.sectionCard}>
          {mutedUsers.length > 0 ? (
            mutedUsers.map((user, index) => (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.userRow,
                  index < mutedUsers.length - 1 && styles.settingRowBorder,
                ]}
              >
                <View style={styles.userRowLeft}>
                  <View style={styles.blockedAvatar}>
                    <Text style={styles.blockedAvatarText}>
                      {user.displayName.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.userDisplayName}>{user.displayName}</Text>
                    <Text style={styles.userUsername}>@{user.username}</Text>
                  </View>
                </View>
                <VolumeX size={18} color="#6b7280" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>No muted users</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Muted Words</Text>
        <View style={styles.sectionCard}>
          <View style={styles.addWordRow}>
            <TextInput
              style={styles.wordInput}
              placeholder="Add a word or phrase..."
              placeholderTextColor="#9ca3af"
              value={newWord}
              onChangeText={setNewWord}
              onSubmitEditing={handleAddWord}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddWord}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {mutedWords.length > 0 ? (
            <View style={styles.wordsList}>
              {mutedWords.map((word, index) => (
                <View
                  key={`${word}-${index}`}
                  style={[
                    styles.wordChip,
                    index < mutedWords.length - 1 && styles.wordChipBorder,
                  ]}
                >
                  <Hash size={14} color="#6b7280" />
                  <Text style={styles.wordText}>{word}</Text>
                  <TouchableOpacity onPress={() => handleRemoveMutedWord(word)}>
                    <X size={16} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>No muted words</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ee',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    color: '#c15f3c',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 24,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f4f3ee',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 16,
    gap: 12,
  },
  settingIconContainer: {
    marginTop: 2,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  userRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  blockedAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ef444420',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockedAvatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#ef4444',
  },
  userDisplayName: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#1a1a1a',
  },
  userUsername: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#6b7280',
  },
  unblockText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#ef4444',
  },
  emptyRow: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#9ca3af',
  },
  addWordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f3ee',
  },
  wordInput: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1a1a1a',
    backgroundColor: '#f4f3ee',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addButton: {
    backgroundColor: '#c15f3c',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  addButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#ffffff',
  },
  wordsList: {
    paddingHorizontal: 16,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  wordChipBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f4f3ee',
  },
  wordText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
});
