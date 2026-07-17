import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Heart,
  MessageSquare,
  UserPlus,
  Repeat,
  AtSign,
  Bell,
} from 'lucide-react-native';
import { formatDate } from '../../utils/helpers';

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  like: <Heart size={20} color="#ef4444" />,
  comment: <MessageSquare size={20} color="#3b82f6" />,
  follow: <UserPlus size={20} color="#22c55e" />,
  repost: <Repeat size={20} color="#a855f7" />,
  mention: <AtSign size={20} color="#c15f3c" />,
};

function NotificationItem({ item }: { item: any }) {
  const icon = NOTIFICATION_ICONS[item.type] || (
    <Bell size={20} color="#6b7280" />
  );

  return (
    <TouchableOpacity style={styles.notificationItem} activeOpacity={0.95}>
      {!item.read && <View style={styles.unreadDot} />}
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>
          <Text style={styles.boldText}>{item.username || 'Unknown'}</Text>
          {item.message || ' interacted with your post'}
        </Text>
        <Text style={styles.notificationTime}>
          {item.createdAt ? formatDate(new Date(item.createdAt)) : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'mentions'>('all');
  const notifications: any[] = [];

  const filteredNotifications =
    activeTab === 'mentions'
      ? notifications.filter((n) => n.type === 'mention')
      : notifications;

  const renderItem = ({ item }: { item: any }) => (
    <NotificationItem item={item} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Bell size={48} color="#6b7280" />
      <Text style={styles.emptyTitle}>No notifications yet</Text>
      <Text style={styles.emptySubtitle}>
        When people interact with you, you'll see it here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[styles.segment, activeTab === 'all' && styles.segmentActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text
            style={[styles.segmentText, activeTab === 'all' && styles.segmentTextActive]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, activeTab === 'mentions' && styles.segmentActive]}
          onPress={() => setActiveTab('mentions')}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === 'mentions' && styles.segmentTextActive,
            ]}
          >
            Mentions
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: '#1a1a1a',
  },
  segmentedControl: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#e5e5e0',
    borderRadius: 10,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: '#ffffff',
  },
  segmentText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#6b7280',
  },
  segmentTextActive: {
    color: '#1a1a1a',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#c15f3c',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f4f3ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 4,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 20,
  },
  boldText: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#1a1a1a',
  },
  notificationTime: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
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
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
