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
  Shield,
  UserX,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle,
  User,
  MessageSquare,
  FileText,
} from 'lucide-react-native';

type ReportType = 'Post' | 'User' | 'Comment';
type ReportStatus = 'pending' | 'resolved' | 'dismissed';

interface Report {
  id: string;
  reporterUsername: string;
  reporterAvatar?: string;
  reason: string;
  targetText: string;
  reportType: ReportType;
  timestamp: string;
  status: ReportStatus;
  fullDetails?: string;
}

const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    reporterUsername: 'johndoe',
    reason: 'Inappropriate content',
    targetText: 'This post contains offensive language that violates...',
    reportType: 'Post',
    timestamp: '2 hours ago',
    status: 'pending',
    fullDetails:
      'Full post content: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: '2',
    reporterUsername: 'janedoe',
    reason: 'Harassment',
    targetText: 'User: @offensiveuser',
    reportType: 'User',
    timestamp: '5 hours ago',
    status: 'pending',
    fullDetails: 'This user has been sending threatening messages to multiple community members.',
  },
  {
    id: '3',
    reporterUsername: 'mod123',
    reason: 'Spam',
    targetText: 'Check out this amazing product at this link...',
    reportType: 'Comment',
    timestamp: '1 day ago',
    status: 'resolved',
  },
  {
    id: '4',
    reporterUsername: 'user456',
    reason: 'Copyright violation',
    targetText: 'This post uses my artwork without permission...',
    reportType: 'Post',
    timestamp: '3 days ago',
    status: 'dismissed',
  },
];

type TabKey = 'pending' | 'resolved' | 'dismissed';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'dismissed', label: 'Dismissed' },
];

function ReportTypeBadge({ type }: { type: ReportType }) {
  const colors: Record<ReportType, string> = {
    Post: '#c15f3c',
    User: '#3b82f6',
    Comment: '#8b5cf6',
  };

  return (
    <View style={[styles.badge, { backgroundColor: colors[type] + '20' }]}>
      <Text style={[styles.badgeText, { color: colors[type] }]}>{type}</Text>
    </View>
  );
}

function ReportCard({
  report,
  isExpanded,
  onToggle,
}: {
  report: Report;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.reportCard}
      onPress={onToggle}
      activeOpacity={0.95}
    >
      <View style={styles.reportHeader}>
        <View style={styles.reporterRow}>
          <View style={styles.reporterAvatar}>
            <Text style={styles.reporterAvatarText}>
              {report.reporterUsername.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.reporterName}>@{report.reporterUsername}</Text>
        </View>
        <ReportTypeBadge type={report.reportType} />
      </View>

      <Text style={styles.reportReason}>{report.reason}</Text>
      <Text style={styles.targetPreview} numberOfLines={2}>
        {report.targetText}
      </Text>

      <View style={styles.reportFooter}>
        <View style={styles.timestampRow}>
          <Clock size={12} color="#6b7280" />
          <Text style={styles.timestampText}>{report.timestamp}</Text>
        </View>
        {isExpanded ? (
          <ChevronUp size={18} color="#6b7280" />
        ) : (
          <ChevronDown size={18} color="#6b7280" />
        )}
      </View>

      {isExpanded && (
        <View style={styles.expandedSection}>
          {report.fullDetails && (
            <View style={styles.detailsBox}>
              <Text style={styles.detailsTitle}>Full Details</Text>
              <Text style={styles.detailsText}>{report.fullDetails}</Text>
            </View>
          )}

          {report.status === 'pending' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.dismissButton}>
                <Shield size={16} color="#6b7280" />
                <Text style={styles.dismissButtonText}>Dismiss</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeButton}>
                <Trash2 size={16} color="#ffffff" />
                <Text style={styles.removeButtonText}>Remove Content</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.banButton}>
                <UserX size={16} color="#ffffff" />
                <Text style={styles.banButtonText}>Ban User</Text>
              </TouchableOpacity>
            </View>
          )}

          {report.status === 'resolved' && (
            <View style={styles.resolvedBox}>
              <Text style={styles.resolvedText}>Resolved</Text>
            </View>
          )}

          {report.status === 'dismissed' && (
            <View style={styles.dismissedBox}>
              <Text style={styles.dismissedText}>Dismissed</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

export function ReportsScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredReports = MOCK_REPORTS.filter((r) => r.status === activeTab);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const renderItem = ({ item }: { item: Report }) => (
    <ReportCard
      report={item}
      isExpanded={expandedId === item.id}
      onToggle={() => handleToggle(item.id)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Shield size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No reports to review</Text>
      <Text style={styles.emptySubtext}>
        All clear! No {activeTab} reports at this time.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Moderation</Text>
      </View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => {
              setActiveTab(tab.key);
              setExpandedId(null);
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
            {tab.key === 'pending' && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>
                  {MOCK_REPORTS.filter((r) => r.status === 'pending').length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredReports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
    paddingVertical: 14,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    color: '#c15f3c',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#f4f3ee',
  },
  tabText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#1a1a1a',
    fontFamily: 'Poppins_600SemiBold',
  },
  pendingBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  pendingBadgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
    color: '#ffffff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reporterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reporterAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reporterAvatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#ffffff',
  },
  reporterName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#1a1a1a',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 11,
  },
  reportReason: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 6,
  },
  targetPreview: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 10,
  },
  reportFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestampText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#6b7280',
  },
  expandedSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f4f3ee',
  },
  detailsBox: {
    backgroundColor: '#f4f3ee',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  detailsTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#1a1a1a',
    marginBottom: 6,
  },
  detailsText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  dismissButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f4f3ee',
  },
  dismissButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#6b7280',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#ef4444',
  },
  removeButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#ffffff',
  },
  banButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#dc2626',
  },
  banButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#ffffff',
  },
  resolvedBox: {
    backgroundColor: '#22c55e20',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  resolvedText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#22c55e',
  },
  dismissedBox: {
    backgroundColor: '#6b728020',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  dismissedText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
