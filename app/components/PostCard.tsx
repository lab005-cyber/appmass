import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { formatDate } from '../utils/helpers';
import Avatar from './Avatar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_H_PADDING = 16;
const CONTENT_WIDTH = SCREEN_WIDTH - CARD_H_PADDING * 2 - 16;

interface Post {
  $id: string;
  userId?: string;
  authorId?: string;
  userName?: string;
  authorName?: string;
  userAvatar?: string;
  content: string;
  mediaIds?: string[];
  hashtags?: string[];
  likesCount?: number;
  likeCount?: number;
  commentsCount?: number;
  commentCount?: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onPress?: (postId: string) => void;
  onUserPress?: (userId: string) => void;
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <Text style={[styles.actionIcon, filled && styles.actionIconActive]}>
    {filled ? '❤️' : '🤍'}
  </Text>
);

const MessageIcon = () => (
  <Text style={styles.actionIcon}>💬</Text>
);

const RepeatIcon = () => (
  <Text style={styles.actionIcon}>🔁</Text>
);

const BookmarkIcon = ({ filled }: { filled: boolean }) => (
  <Text style={[styles.actionIcon, filled && styles.actionIconActive]}>
    {filled ? '🔖' : '🏷️'}
  </Text>
);

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onRepost,
  onBookmark,
  onPress,
  onUserPress,
}) => {
  const mediaCount = post.mediaIds?.length ?? 0;

  const renderMedia = () => {
    if (mediaCount === 0) return null;
    const images = post.mediaIds!;

    if (mediaCount === 1) {
      return (
        <Image
          source={{ uri: images[0] }}
          style={styles.mediaSingle}
        />
      );
    }

    if (mediaCount <= 4) {
      const cols = 2;
      const rows = Math.ceil(mediaCount / cols);
      return (
        <View style={[styles.mediaGrid, { flexDirection: 'row', flexWrap: 'wrap' }]}>
          {images.slice(0, 4).map((uri, idx) => (
            <Image
              key={idx}
              source={{ uri }}
              style={{
                width: '49%',
                height: 120,
                marginRight: idx % 2 === 0 ? '2%' : 0,
                marginBottom: 4,
                borderRadius: 8,
              }}
            />
          ))}
        </View>
      );
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
        {images.map((uri, idx) => (
          <Image
            key={idx}
            source={{ uri }}
            style={[styles.mediaScrollItem, idx === 0 && { marginLeft: 0 }]}
          />
        ))}
      </ScrollView>
    );
  };

  const renderHashtags = () => {
    if (!post.hashtags?.length) return null;
    return (
      <View style={styles.hashtagRow}>
        {post.hashtags.map((tag, idx) => (
          <TouchableOpacity key={idx}>
            <Text style={styles.hashtag}>#{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const card = (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userRow}
          onPress={() => onUserPress?.(post.userId || post.authorId || '')}
          activeOpacity={0.7}
        >
          <Avatar uri={post.userAvatar} name={post.userName || post.authorName} size={40} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{post.userName || post.authorName || 'Unknown'}</Text>
            <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => onPress?.(post.$id)}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <Text style={styles.content}>{post.content}</Text>
      </TouchableOpacity>

      {renderHashtags()}
      {renderMedia()}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onLike?.(post.$id)}
          >
            <HeartIcon filled={post.isLiked} />
            {post.likeCount ?? post.likesCount > 0 ? (
              <Text style={styles.actionCount}>{post.likeCount ?? post.likesCount}</Text>
            ) : null}
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onComment?.(post.$id)}
          >
            <MessageIcon />
            {post.commentCount ?? post.commentsCount > 0 ? (
              <Text style={styles.actionCount}>{post.commentCount ?? post.commentsCount}</Text>
            ) : null}
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onRepost?.(post.$id)}
        >
          <RepeatIcon />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onBookmark?.(post.$id)}
        >
          <BookmarkIcon filled={post.isBookmarked} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return card;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
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
  content: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 22,
    marginBottom: 10,
  },
  hashtagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  hashtag: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#c15f3c',
  },
  mediaSingle: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  mediaGrid: {
    marginBottom: 10,
  },
  mediaScroll: {
    marginBottom: 10,
  },
  mediaScrollItem: {
    width: CONTENT_WIDTH * 0.7,
    height: 180,
    borderRadius: 8,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionIconActive: {
    // tinted via emoji, but kept for future icon replacement
  },
  actionCount: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 4,
  },
});

export default PostCard;
export { PostCard, PostCardProps, Post };
