import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Search, TrendingUp, Users, Hash } from 'lucide-react-native';
import { FeedStackParamList } from '../../navigation/MainNavigator';

const TRENDING_TAGS = [
  { id: '1', tag: 'technology', postCount: '12.4K' },
  { id: '2', tag: 'design', postCount: '8.2K' },
  { id: '3', tag: 'reactnative', postCount: '6.7K' },
  { id: '4', tag: 'startup', postCount: '5.1K' },
  { id: '5', tag: 'ai', postCount: '14.3K' },
  { id: '6', tag: 'opensource', postCount: '3.9K' },
];

const SUGGESTED_USERS = [
  { id: '1', name: 'Sarah Chen', username: '@sarahchen', avatar: '' },
  { id: '2', name: 'Marcus Lee', username: '@marcuslee', avatar: '' },
  { id: '3', name: 'Aria Patel', username: '@ariapatel', avatar: '' },
  { id: '4', name: 'James Kim', username: '@jameskim', avatar: '' },
  { id: '5', name: 'Luna Torres', username: '@lunatorres', avatar: '' },
];

type TabType = 'trending' | 'people' | 'hashtags';

export function ExploreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('trending');

  const renderTrending = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Trending Topics</Text>
      <View style={styles.trendingGrid}>
        {TRENDING_TAGS.map((item) => (
          <TouchableOpacity key={item.id} style={styles.hashtagCard}>
            <Hash size={18} color="#c15f3c" />
            <View style={styles.hashtagInfo}>
              <Text style={styles.hashtagText}>#{item.tag}</Text>
              <Text style={styles.hashtagCount}>{item.postCount} posts</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSuggestedUsers = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Suggested Users</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.usersScroll}
      >
        {SUGGESTED_USERS.map((user) => (
          <TouchableOpacity key={user.id} style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.userName} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={styles.userUsername} numberOfLines={1}>
              {user.username}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'trending':
        return (
          <FlatList
            data={[]}
            renderItem={() => null}
            keyExtractor={() => 'empty'}
            ListHeaderComponent={
              <>
                {renderTrending()}
                {renderSuggestedUsers()}
              </>
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'people':
        return (
          <FlatList
            data={SUGGESTED_USERS}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.peopleRow}>
                <View style={styles.peopleAvatar}>
                  <Text style={styles.peopleAvatarText}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.peopleInfo}>
                  <Text style={styles.peopleName}>{item.name}</Text>
                  <Text style={styles.peopleUsername}>{item.username}</Text>
                </View>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'hashtags':
        return (
          <FlatList
            data={TRENDING_TAGS}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.hashtagRow}>
                <Hash size={20} color="#c15f3c" />
                <View style={styles.hashtagRowInfo}>
                  <Text style={styles.hashtagRowText}>#{item.tag}</Text>
                  <Text style={styles.hashtagRowCount}>{item.postCount} posts</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={18} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search appmass..."
          placeholderTextColor="#6b7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.tabsRow}>
        {(['trending', 'people', 'hashtags'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            {tab === 'trending' && <TrendingUp size={16} color={activeTab === tab ? '#c15f3c' : '#6b7280'} />}
            {tab === 'people' && <Users size={16} color={activeTab === tab ? '#c15f3c' : '#6b7280'} />}
            {tab === 'hashtags' && <Hash size={16} color={activeTab === tab ? '#c15f3c' : '#6b7280'} />}
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ee',
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
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#1a1a1a',
    paddingVertical: 0,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tabActive: {
    backgroundColor: '#f0e6e0',
    borderColor: '#c15f3c',
  },
  tabText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#c15f3c',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  hashtagCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 8,
    width: '48%',
  },
  hashtagInfo: {
    flex: 1,
  },
  hashtagText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#1a1a1a',
  },
  hashtagCount: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 1,
  },
  usersScroll: {
    gap: 12,
    paddingRight: 16,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    width: 120,
  },
  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    color: '#ffffff',
  },
  userName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  userUsername: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  peopleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  peopleAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  peopleAvatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  peopleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  peopleName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#1a1a1a',
  },
  peopleUsername: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#6b7280',
  },
  followButton: {
    backgroundColor: '#c15f3c',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  followButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#ffffff',
  },
  hashtagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  hashtagRowInfo: {
    flex: 1,
  },
  hashtagRowText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#1a1a1a',
  },
  hashtagRowCount: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 1,
  },
});
