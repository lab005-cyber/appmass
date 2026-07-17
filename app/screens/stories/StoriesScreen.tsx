import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  TextInput,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Plus, X, MoreHorizontal, Send, ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type Story = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  mediaUrl: string;
  timestamp: number;
  viewed: boolean;
};

type StoryGroup = {
  userId: string;
  userName: string;
  userAvatar?: string;
  stories: Story[];
  allViewed: boolean;
};

const MOCK_STORIES: StoryGroup[] = [
  {
    userId: '1',
    userName: 'Your Story',
    userAvatar: undefined,
    stories: [],
    allViewed: false,
  },
  {
    userId: '2',
    userName: 'alex_codes',
    stories: [
      { id: 's1', userId: '2', userName: 'alex_codes', mediaUrl: '', timestamp: Date.now() - 60000, viewed: false },
      { id: 's2', userId: '2', userName: 'alex_codes', mediaUrl: '', timestamp: Date.now() - 120000, viewed: false },
    ],
    allViewed: false,
  },
  {
    userId: '3',
    userName: 'sarah_design',
    stories: [
      { id: 's3', userId: '3', userName: 'sarah_design', mediaUrl: '', timestamp: Date.now() - 300000, viewed: true },
    ],
    allViewed: true,
  },
  {
    userId: '4',
    userName: 'mike_photo',
    stories: [
      { id: 's4', userId: '4', userName: 'mike_photo', mediaUrl: '', timestamp: Date.now() - 500000, viewed: false },
    ],
    allViewed: false,
  },
  {
    userId: '5',
    userName: 'jane_doe',
    stories: [
      { id: 's5', userId: '5', userName: 'jane_doe', mediaUrl: '', timestamp: Date.now() - 700000, viewed: true },
    ],
    allViewed: true,
  },
  {
    userId: '6',
    userName: 'dev_guy',
    stories: [
      { id: 's6', userId: '6', userName: 'dev_guy', mediaUrl: '', timestamp: Date.now() - 900000, viewed: false },
    ],
    allViewed: false,
  },
];

function StoryRing({
  item,
  index,
  onPress,
}: {
  item: StoryGroup;
  index: number;
  onPress: () => void;
}) {
  const isOwnStory = index === 0;
  const initials = item.userName
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <TouchableOpacity style={styles.storyRingContainer} onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.storyRing,
          { borderColor: item.allViewed ? '#e5e7eb' : '#c15f3c' },
        ]}
      >
        {isOwnStory ? (
          <View style={styles.ownStoryButton}>
            <Plus size={24} color="#ffffff" />
          </View>
        ) : item.userAvatar ? (
          <Image source={{ uri: item.userAvatar }} style={styles.storyAvatar} />
        ) : (
          <View style={styles.storyAvatarPlaceholder}>
            <Text style={styles.storyAvatarText}>{initials}</Text>
          </View>
        )}
      </View>
      <Text style={styles.storyUsername} numberOfLines={1}>
        {isOwnStory ? 'My Story' : item.userName}
      </Text>
    </TouchableOpacity>
  );
}

function StoryProgressBar({
  progress,
  active,
}: {
  progress: Animated.Value;
  active: boolean;
}) {
  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[
            styles.progressBarFill,
            { width: widthInterpolated as any },
          ]}
        />
      </View>
    </View>
  );
}

function StoryViewer({
  stories,
  initialIndex,
  onClose,
}: {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [showSendInput, setShowSendInput] = useState(false);
  const [messageText, setMessageText] = useState('');
  const pan = useRef(new Animated.ValueXY()).current;

  const currentStory = stories[currentIndex];

  useEffect(() => {
    progressAnim.setValue(0);
    const timer = Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    });
    timer.start();

    const timeout = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onClose();
      }
    }, 5000);

    return () => {
      timer.stop();
      clearTimeout(timeout);
    };
  }, [currentIndex]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 50;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderMove: Animated.event(
        [null, { dy: pan.y }],
        { useNativeDriver: false }
      ),
    })
  ).current;

  const handleTap = (evt: any) => {
    const x = evt.nativeEvent.locationX;
    if (x < SCREEN_WIDTH / 3) {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    } else if (x > (SCREEN_WIDTH * 2) / 3) {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onClose();
      }
    }
  };

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ago`;
  };

  return (
    <Animated.View
      style={[styles.storyViewer, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={styles.storyTouchArea}
        activeOpacity={1}
        onPress={handleTap}
      >
        <StoryProgressBar progress={progressAnim} active />

        <View style={styles.storyTopBar}>
          <View style={styles.storyTopLeft}>
            <View style={styles.storyViewerAvatar}>
              <Text style={styles.storyViewerAvatarText}>
                {currentStory.userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.storyViewerName}>{currentStory.userName}</Text>
            <Text style={styles.storyViewerTimestamp}>
              {formatTimestamp(currentStory.timestamp)}
            </Text>
          </View>
          <View style={styles.storyTopRight}>
            <TouchableOpacity style={styles.storyTopButton}>
              <MoreHorizontal size={22} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.storyTopButton} onPress={onClose}>
              <X size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.storyMediaPlaceholder}>
          <Text style={styles.storyMediaText}>Story Media</Text>
        </View>

        <View style={styles.storyTapHint}>
          <ChevronLeft size={20} color="rgba(255,255,255,0.3)" />
          <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
        </View>
      </TouchableOpacity>

      <View style={styles.storyBottomBar}>
        <View style={styles.sendMessageRow}>
          <TextInput
            style={styles.sendMessageInput}
            placeholder="Send Message"
            placeholderTextColor="#9ca3af"
            value={messageText}
            onChangeText={setMessageText}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Send size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

export function StoriesScreen() {
  const navigation = useNavigation();
  const [storyGroups] = useState<StoryGroup[]>(MOCK_STORIES);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerStories, setViewerStories] = useState<Story[]>([]);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);

  const openStoryViewer = (group: StoryGroup) => {
    if (group.userId === '1') {
      navigation.navigate('CreateStory' as never);
      return;
    }
    setViewerStories(group.stories);
    setViewerStartIndex(0);
    setViewerVisible(true);
  };

  const renderStoryRing = ({ item, index }: { item: StoryGroup; index: number }) => (
    <StoryRing
      item={item}
      index={index}
      onPress={() => openStoryViewer(item)}
    />
  );

  const sortedGroups = [
    storyGroups[0],
    ...storyGroups.slice(1).filter((g) => !g.allViewed),
    ...storyGroups.slice(1).filter((g) => g.allViewed),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stories</Text>
        <TouchableOpacity style={styles.myStoryButton}>
          <Text style={styles.myStoryButtonText}>My Story</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.storiesRowContainer}>
        <FlatList
          data={sortedGroups}
          renderItem={renderStoryRing}
          keyExtractor={(item) => item.userId}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesRow}
        />
      </View>

      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>All caught up</Text>
        <Text style={styles.emptySubtitle}>
          View stories from your friends here
        </Text>
      </View>

      {viewerVisible && (
        <StoryViewer
          stories={viewerStories}
          initialIndex={viewerStartIndex}
          onClose={() => setViewerVisible(false)}
        />
      )}
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
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: '#1a1a1a',
  },
  myStoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#c15f3c',
    borderRadius: 20,
  },
  myStoryButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#ffffff',
  },
  storiesRowContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
  },
  storiesRow: {
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 8,
  },
  storyRingContainer: {
    alignItems: 'center',
    width: 72,
  },
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  ownStoryButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  storyAvatarPlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    color: '#6b7280',
  },
  storyUsername: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  storyViewer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 100,
  },
  storyTouchArea: {
    flex: 1,
  },
  progressBarContainer: {
    position: 'absolute',
    top: 8,
    left: 12,
    right: 12,
    zIndex: 10,
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  storyTopBar: {
    position: 'absolute',
    top: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    zIndex: 10,
  },
  storyTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storyViewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyViewerAvatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#ffffff',
  },
  storyViewerName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#ffffff',
  },
  storyViewerTimestamp: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  storyTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storyTopButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyMediaPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyMediaText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: 'rgba(255,255,255,0.5)',
  },
  storyTapHint: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    zIndex: 5,
  },
  storyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: 40,
    paddingTop: 12,
    zIndex: 10,
  },
  sendMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sendMessageInput: {
    flex: 1,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#ffffff',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
