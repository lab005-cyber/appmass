import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Lock,
  Users,
  FileText,
  AlertTriangle,
  Activity,
  Shield,
  UserCog,
  Server,
  Megaphone,
  ChevronRight,
} from 'lucide-react-native';

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  isWarning?: boolean;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  color: string;
}

interface ActivityItem {
  id: string;
  text: string;
  timestamp: string;
  type: 'report' | 'user' | 'system';
}

const MOCK_STATS: StatCard[] = [
  {
    label: 'Total Users',
    value: '24,581',
    icon: <Users size={22} color="#3b82f6" />,
    color: '#3b82f620',
  },
  {
    label: 'Total Posts',
    value: '182,403',
    icon: <FileText size={22} color="#8b5cf6" />,
    color: '#8b5cf620',
  },
  {
    label: 'Pending Reports',
    value: '12',
    icon: <AlertTriangle size={22} color="#ef4444" />,
    color: '#ef444420',
    isWarning: true,
  },
  {
    label: 'Active Today',
    value: '3,842',
    icon: <Activity size={22} color="#22c55e" />,
    color: '#22c55e20',
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Review Reports',
    icon: <Shield size={20} color="#ffffff" />,
    onPress: () => {},
    color: '#c15f3c',
  },
  {
    label: 'Manage Users',
    icon: <UserCog size={20} color="#ffffff" />,
    onPress: () => {},
    color: '#3b82f6',
  },
  {
    label: 'Server Status',
    icon: <Server size={20} color="#ffffff" />,
    onPress: () => {},
    color: '#8b5cf6',
  },
  {
    label: 'Ad Campaigns',
    icon: <Megaphone size={20} color="#ffffff" />,
    onPress: () => {},
    color: '#f59e0b',
  },
];

const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    text: 'Report #1024 resolved by moderator',
    timestamp: '2 min ago',
    type: 'report',
  },
  {
    id: '2',
    text: 'New user @newcreator joined',
    timestamp: '15 min ago',
    type: 'user',
  },
  {
    id: '3',
    text: 'Spam detection flag: 3 accounts suspended',
    timestamp: '1 hour ago',
    type: 'system',
  },
  {
    id: '4',
    text: 'Report #1023 escalated to senior mod',
    timestamp: '2 hours ago',
    type: 'report',
  },
  {
    id: '5',
    text: 'Server backup completed successfully',
    timestamp: '3 hours ago',
    type: 'system',
  },
];

export function AdminPanelScreen() {
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState<string | null>(null);

  const handleServerStatus = () => {
    setCheckingStatus(true);
    setStatusResult(null);
    setTimeout(() => {
      setCheckingStatus(false);
      setStatusResult('Appwrite: Connected • All services operational');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Lock size={22} color="#c15f3c" />
          <Text style={styles.headerTitle}>Admin Panel</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsGrid}>
          {MOCK_STATS.map((stat, index) => (
            <View
              key={stat.label}
              style={[
                styles.statCard,
                index % 2 === 0 ? styles.statLeft : styles.statRight,
              ]}
            >
              <View style={[styles.statIconContainer, { backgroundColor: stat.color }]}>
                {stat.icon}
              </View>
              <Text style={styles.statValue}>
                {stat.isWarning ? (
                  <Text style={styles.statValueWarning}>{stat.value}</Text>
                ) : (
                  stat.value
                )}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionCard, { backgroundColor: action.color }]}
              onPress={action.onPress}
              activeOpacity={0.85}
            >
              {action.icon}
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {statusResult && (
          <View style={styles.statusResult}>
            <Server size={16} color="#22c55e" />
            <Text style={styles.statusResultText}>{statusResult}</Text>
          </View>
        )}

        {checkingStatus && (
          <ActivityIndicator
            size="small"
            color="#c15f3c"
            style={styles.statusLoader}
          />
        )}

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activitySection}>
          {RECENT_ACTIVITY.map((item) => (
            <View key={item.id} style={styles.activityItem}>
              <View style={styles.activityDotContainer}>
                <View
                  style={[
                    styles.activityDot,
                    {
                      backgroundColor:
                        item.type === 'report'
                          ? '#ef4444'
                          : item.type === 'user'
                          ? '#3b82f6'
                          : '#8b5cf6',
                    },
                  ]}
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{item.text}</Text>
                <Text style={styles.activityTimestamp}>{item.timestamp}</Text>
              </View>
              <ChevronRight size={16} color="#d1d5db" />
            </View>
          ))}
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  statLeft: {
    marginRight: '4%',
  },
  statRight: {
    marginLeft: 0,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statValueWarning: {
    color: '#ef4444',
  },
  statLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#6b7280',
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  actionCard: {
    width: '48%',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#ffffff',
    flexShrink: 1,
  },
  statusResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#22c55e20',
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
  },
  statusResultText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#22c55e',
    flex: 1,
  },
  statusLoader: {
    marginBottom: 24,
  },
  activitySection: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f3ee',
  },
  activityDotContainer: {
    width: 24,
    alignItems: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#1a1a1a',
    lineHeight: 18,
  },
  activityTimestamp: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
});
