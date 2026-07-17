import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  Settings,
  Grid,
  Bookmark,
  Heart,
  Calendar,
  BadgeCheck,
  MoreHorizontal,
} from 'lucide-react-native';
import { ProfileStackParamList } from '../../navigation/MainNavigator';

type ProfileTab = 'posts' | 'saved' | 'likes';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const route = useRoute<RouteProp<ProfileStackParamList, 'Profile'>>();
  const { userId } = route.params;
  const isOwnProfile = !userId;
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const tabs: { key: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { key: 'posts', label: 'Posts', icon: <Grid size={20} color="#6b7280" /> },
    { key: 'saved', label: 'Saved', icon: <Bookmark size={20} color="#6b7280" /> },
    { key: 'likes', label: 'Likes', icon: <Heart size={20} color="#6b7280" /> },
  ];

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Settings size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MoreHorizontal size={22} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.coverPhoto}>
          <View style={styles.coverPlaceholder} />
        </View>

        <View style={styles.profileInfoSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>U</Text>
            </View>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.displayName}>User Name</Text>
            <BadgeCheck size={20} color="#c15f3c" />
          </View>
          <Text style={styles.username}>@username</Text>

          <Text style={styles.bio}>
            This is the user's bio text. It can be multiple lines and describe
            who they are.
          </Text>

          <View style={styles.joinedRow}>
            <Calendar size={14} color="#6b7280" />
            <Text style={styles.joinedText}>Joined January 2024</Text>
          </View>

          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statValue}>1.2k</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statValue}>380</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>

          {isOwnProfile ? (
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.followButton,
                  isFollowing && styles.followingButton,
                ]}
                onPress={handleFollowToggle}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    isFollowing && styles.followingButtonText,
                  ]}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.key && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.contentGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} style={styles.gridItem}>
              <View style={styles.gridPlaceholder} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: '#1a1a1a',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  coverPhoto: {
    height: 140,
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  coverPlaceholder: {
    flex: 1,
    backgroundColor: '#c15f3c',
  },
  profileInfoSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -36,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#f4f3ee',
  },
  avatarText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    color: '#ffffff',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  displayName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: '#1a1a1a',
  },
  username: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 12,
  },
  bio: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  joinedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  joinedText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#6b7280',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: '#1a1a1a',
  },
  statLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  editProfileButton: {
    borderWidth: 1.5,
    borderColor: '#c15f3c',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  editProfileText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#c15f3c',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  followButton: {
    backgroundColor: '#c15f3c',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  followingButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#c15f3c',
  },
  followButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#ffffff',
  },
  followingButtonText: {
    color: '#c15f3c',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#f4f3ee',
  },
  tabLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#6b7280',
  },
  tabLabelActive: {
    color: '#1a1a1a',
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  gridItem: {
    width: '31%',
    aspectRatio: 1,
  },
  gridPlaceholder: {
    flex: 1,
    backgroundColor: '#e5e5e0',
    borderRadius: 10,
  },
});
