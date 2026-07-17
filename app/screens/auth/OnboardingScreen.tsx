import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Camera, Shield } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { completeOnboarding } from '../../store/slices/uiSlice';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    id: '1',
    icon: <MessageCircle size={80} color="#c15f3c" />,
    title: 'Welcome to appmass',
    subtitle: 'Connect, share, and chat with friends',
  },
  {
    id: '2',
    icon: <Camera size={80} color="#c15f3c" />,
    title: 'Share Your Moments',
    subtitle: 'Post photos, videos, polls, and stories',
  },
  {
    id: '3',
    icon: <Shield size={80} color="#c15f3c" />,
    title: 'Chat Securely',
    subtitle: 'End-to-end encrypted messaging with voice calls',
  },
];

export function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const dispatch = useAppDispatch();

  const isLastSlide = currentIndex === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) return;
    flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
  };

  const handleSkip = () => {
    dispatch(completeOnboarding());
    navigation.replace('Login');
  };

  const handleGetStarted = () => {
    dispatch(completeOnboarding());
    navigation.replace('Login');
  };

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>{item.icon}</View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        bounces={false}
      />

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === currentIndex && styles.activeDot]}
          />
        ))}
      </View>

      <View style={styles.bottomContainer}>
        {isLastSlide ? (
          <View style={styles.lastSlideButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGetStarted}
            >
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.secondaryButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ee',
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#c15f3c',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#c15f3c',
    width: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  lastSlideButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#c15f3c',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#c15f3c',
  },
  secondaryButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#c15f3c',
  },
});
