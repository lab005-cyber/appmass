import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Heart, MessageSquare, Repeat, Bookmark } from 'lucide-react-native';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import { useAuth } from '../../hooks/useAuth';
import { fetchFeed, toggleLike } from '../../store/slices/feedSlice';
import { formatDate } from '../../utils/helpers';
import { FeedStackParamList } from '../../navigation/MainNavigator';

function PostCard({ post, onPress, onLike }: { post: any; onPress: () => void; onLike?: () => void }) {
  return (
    <TouchableOpacity style={styles.postCard} onPress={onPress} activeOpacity={0.95}>
      <View style={styles.postHeader}>
        <View style={styles.postHeaderLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(post.authorName || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.authorName}>{post.authorName || 'Unknown'}</Text>
            <Text style={styles.timestamp}>{formatDate(new Date(post.createdAt))}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      {post.mediaIds && post.mediaIds.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mediaScroll}
          contentContainerStyle={styles.mediaContent}
        >
          {post.mediaIds.slice(0, 10).map((uri: string, index: number) => (
            <Image
              key={`${uri}-${index}`}
              source={{ uri }}
              style={styles.mediaImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Heart size={20} color={post.isLiked ? '#ef4444' : '#6b7280'} />
          {post.likeCount > 0 && (
            <Text style={styles.actionCount}>{post.likeCount}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MessageSquare size={20} color="#6b7280" />
          {post.commentCount > 0 && (
            <Text style={styles.actionCount}>{post.commentCount}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Repeat size={20} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Bookmark size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export function FeedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackParamList>>();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { posts, loading, hasMore, page } = useAppSelector((state) => state.feed);
  const [activeTab, setActiveTab] = useState<'following' | 'foryou'>('foryou');
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = useCallback(() => {
    dispatch(fetchFeed({ page, limit: 10 }));
  }, [dispatch, page]);

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchFeed({ page: 1, limit: 10 }));
    }
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchFeed({ page: 1, limit: 10 }));
    setRefreshing(false);
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadFeed();
    }
  }, [hasMore, loading, loadFeed]);

  const handleLike = useCallback((postId: string) => {
    if (!user?.$id) return;
    dispatch(toggleLike({ postId, userId: user.$id }));
  }, [dispatch, user]);

  const displayedPosts = activeTab === 'following'
    ? posts.filter((p: any) => p.authorId === user?.$id || false)
    : posts;

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator size="small" color="#c15f3c" />
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <PostCard
      post={item}
      onPress={() => navigation.navigate('PostDetail', { postId: item.$id })}
      onLike={() => handleLike(item.$id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>appmass</Text>
      </View>

      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[styles.segment, activeTab === 'following' && styles.segmentActive]}
          onPress={() => setActiveTab('following')}
        >
          <Text
            style={[styles.segmentText, activeTab === 'following' && styles.segmentTextActive]}
          >
            Following
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, activeTab === 'foryou' && styles.segmentActive]}
          onPress={() => setActiveTab('foryou')}
        >
          <Text
            style={[styles.segmentText, activeTab === 'foryou' && styles.segmentTextActive]}
          >
            For You
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c15f3c" />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
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
    alignItems: 'center',
  },
  logo: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: '#c15f3c',
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  authorName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#1a1a1a',
  },
  timestamp: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 1,
  },
  postContent: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 22,
    marginBottom: 12,
  },
  mediaScroll: {
    marginBottom: 12,
    marginHorizontal: -16,
  },
  mediaContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  mediaImage: {
    width: 200,
    height: 140,
    borderRadius: 10,
    backgroundColor: '#e5e5e0',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#6b7280',
  },
  loaderFooter: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
