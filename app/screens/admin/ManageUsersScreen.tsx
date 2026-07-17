import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Shield,
  ShieldOff,
  BadgeCheck,
  Trash2,
  MoreVertical,
  Star,
  Mail,
  AlertTriangle,
} from 'lucide-react-native';

type AccountStatus = 'active' | 'suspended' | 'banned';

interface AppUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarInitials: string;
  status: AccountStatus;
  isVerified: boolean;
  joinDate: string;
}

const MOCK_USERS: AppUser[] = [
  {
    id: '1',
    username: 'johndoe',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    avatarInitials: 'JD',
    status: 'active',
    isVerified: true,
    joinDate: 'Jan 2024',
  },
  {
    id: '2',
    username: 'janesmith',
    displayName: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatarInitials: 'JS',
    status: 'active',
    isVerified: false,
    joinDate: 'Mar 2024',
  },
  {
    id: '3',
    username: 'offensiveuser',
    displayName: 'Offensive User',
    email: 'offensive@example.com',
    avatarInitials: 'OU',
    status: 'suspended',
    isVerified: false,
    joinDate: 'Jun 2023',
  },
  {
    id: '4',
    username: 'spammer123',
    displayName: 'Spammer Account',
    email: 'spam@gmail.com',
    avatarInitials: 'SA',
    status: 'banned',
    isVerified: false,
    joinDate: 'Feb 2023',
  },
  {
    id: '5',
    username: 'coolcreator',
    displayName: 'Cool Creator',
    email: 'cool.creator@example.com',
    avatarInitials: 'CC',
    status: 'active',
    isVerified: true,
    joinDate: 'Aug 2024',
  },
];

function StatusBadge({ status }: { status: AccountStatus }) {
  const config: Record<AccountStatus, { label: string; bg: string; color: string }> = {
    active: { label: 'Active', bg: '#22c55e20', color: '#22c55e' },
    suspended: { label: 'Suspended', bg: '#f59e0b20', color: '#f59e0b' },
    banned: { label: 'Banned', bg: '#ef444420', color: '#ef4444' },
  };

  const { label, bg, color } = config[status];

  return (
    <View style={[styles.statusBadge, { backgroundColor: bg }]}>
      <Text style={[styles.statusBadgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function ManageUsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<AppUser[]>(MOCK_USERS);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleVerify = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isVerified: !u.isVerified } : u)),
    );
    setMenuOpenId(null);
  };

  const handleSuspend = (userId: string) => {
    Alert.alert(
      'Suspend User',
      'Are you sure you want to suspend this user? They will not be able to use their account.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Suspend',
          style: 'destructive',
          onPress: () => {
            setUsers((prev) =>
              prev.map((u) =>
                u.id === userId ? { ...u, status: 'suspended' } : u,
              ),
            );
            setMenuOpenId(null);
          },
        },
      ],
    );
  };

  const handleBan = (userId: string) => {
    Alert.alert(
      'Ban User',
      'Are you sure you want to permanently ban this user? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Ban',
          style: 'destructive',
          onPress: () => {
            setUsers((prev) =>
              prev.map((u) => (u.id === userId ? { ...u, status: 'banned' } : u)),
            );
            setMenuOpenId(null);
          },
        },
      ],
    );
  };

  const handleDeleteAccount = (userId: string) => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete the user account and all associated data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            setMenuOpenId(null);
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: AppUser }) => (
    <View style={styles.userCard}>
      <View style={styles.userCardMain}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>{item.avatarInitials}</Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.userDisplayName} numberOfLines={1}>
              {item.displayName}
            </Text>
            {item.isVerified && (
              <BadgeCheck size={16} color="#c15f3c" fill="#c15f3c" />
            )}
          </View>
          <Text style={styles.userUsername}>@{item.username}</Text>
          <View style={styles.userEmailRow}>
            <Mail size={12} color="#9ca3af" />
            <Text style={styles.userEmail} numberOfLines={1}>
              {item.email}
            </Text>
          </View>
        </View>

        <View style={styles.userActions}>
          <StatusBadge status={item.status} />
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={() => toggleVerify(item.id)}
          >
            <Star
              size={18}
              color={item.isVerified ? '#c15f3c' : '#d1d5db'}
              fill={item.isVerified ? '#c15f3c' : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() =>
              setMenuOpenId((prev) => (prev === item.id ? null : item.id))
            }
          >
            <MoreVertical size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {menuOpenId === item.id && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleSuspend(item.id)}
          >
            <Shield size={16} color="#f59e0b" />
            <Text style={styles.menuItemText}>Suspend</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleBan(item.id)}
          >
            <ShieldOff size={16} color="#ef4444" />
            <Text style={[styles.menuItemText, { color: '#ef4444' }]}>Ban</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => toggleVerify(item.id)}
          >
            <BadgeCheck size={16} color="#c15f3c" />
            <Text style={styles.menuItemText}>
              {item.isVerified ? 'Remove Verify' : 'Verify'}
            </Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleDeleteAccount(item.id)}
          >
            <Trash2 size={16} color="#ef4444" />
            <Text style={[styles.menuItemText, { color: '#ef4444' }]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Users</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={18} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by name, username, or email..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Search size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
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
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    color: '#c15f3c',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1a1a1a',
    paddingVertical: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  userCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userDisplayName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#1a1a1a',
  },
  userUsername: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#6b7280',
    marginTop: 1,
  },
  userEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  userEmail: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#9ca3af',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifyButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
  },
  menuDropdown: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f4f3ee',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  menuItemText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#1a1a1a',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f4f3ee',
    marginVertical: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
  },
});
