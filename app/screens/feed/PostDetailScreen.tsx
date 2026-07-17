import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Repeat,
  Bookmark,
  Send,
} from 'lucide-react-native';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { formatDate } from '../../utils/helpers';
import { FeedStackParamList } from '../../navigation/MainNavigator';

type PostDetailRouteProp = RouteProp<FeedStackParamList, 'PostDetail'>;

const MOCK_COMMENTS = [
  {
    id: '1',
    authorName: 'Alice Wang',
    content: 'This is amazing! Great work on this.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    authorName: 'Bob Martinez',
    content: 'Totally agree with this perspective.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    authorName: 'Claire Johnson',
    content: 'Thanks for sharing this, very insightful!',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
];

function CommentItem({ comment }: { comment: typeof MOCK_COMMENTS[0] }) {
  return (
    <View style={styles.commentItem}>
      <View style={styles.commentAvatar}>
        <Text style={styles.commentAvatarText}>
          {comment.authorName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{comment.authorName}</Text>
        <Text style={styles.commentText}>{comment.content}</Text>
        <Text style={styles.commentTime}>{formatDate(new Date(comment.createdAt))}</Text>
      </View>
    </View>
  );
}

export function PostDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackParamList>>();
  const route = useRoute<PostDetailRouteProp>();
  const { postId } = route.params;
  const [commentText, setCommentText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const post = useAppSelector((state) =>
    state.feed.posts.find((p: any) => p.$id === postId)
  );

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Post not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSendComment = () => {
    if (commentText.trim()) {
      setCommentText('');
    }
  };

  const renderPostDetail = () => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
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

      <Text style={styles.postContent}>{post.content}</Text>

      {post.mediaIds && post.mediaIds.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mediaScroll}
          contentContainerStyle={styles.mediaContent}
        >
          {post.mediaIds.map((uri: string, index: number) => (
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
        <View style={styles.actionGroup}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={22} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.actionCount}>{post.likeCount || 0}</Text>
        </View>
        <View style={styles.actionGroup}>
          <TouchableOpacity style={styles.actionButton}>
            <MessageSquare size={22} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.actionCount}>{post.commentCount || 0}</Text>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <Repeat size={22} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Bookmark size={22} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          data={MOCK_COMMENTS}
          renderItem={({ item }) => <CommentItem comment={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderPostDetail}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.commentInputBar}>
          <TextInput
            ref={inputRef}
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor="#6b7280"
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendComment}
            disabled={!commentText.trim()}
          >
            <Send size={20} color={commentText.trim() ? '#ffffff' : '#b0b0b0'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ee',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f4f3ee',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1a1a1a',
  },
  headerSpacer: {
    width: 40,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
  authorName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
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
    width: 280,
    height: 180,
    borderRadius: 10,
    backgroundColor: '#e5e5e0',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButton: {
    padding: 2,
  },
  actionCount: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#6b7280',
  },
  commentItem: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#d4a373',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#ffffff',
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
  },
  commentAuthor: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 13,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  commentText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 20,
  },
  commentTime: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
  },
  commentInputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e0',
    gap: 8,
  },
  commentInput: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1a1a1a',
    backgroundColor: '#f4f3ee',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxHeight: 80,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#d0d0d0',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#6b7280',
  },
});
