import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';

// ──────────────────────────────────────────
// LoadingSpinner
// ──────────────────────────────────────────

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 'large',
  color = '#c15f3c',
}) => (
  <View style={spinnerStyles.container}>
    <ActivityIndicator size={size} color={color} />
    {message && <Text style={spinnerStyles.message}>{message}</Text>}
  </View>
);

const spinnerStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f3ee',
  },
  message: {
    marginTop: 12,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#6b7280',
  },
});

// ──────────────────────────────────────────
// LoadingSkeleton
// ──────────────────────────────────────────

interface LoadingSkeletonProps {
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 3 }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  const renderSkeleton = (key: number) => (
    <View key={key} style={skeletonStyles.card}>
      <View style={skeletonStyles.header}>
        <Animated.View
          style={[skeletonStyles.avatar, { opacity }]}
        />
        <View style={skeletonStyles.headerLines}>
          <Animated.View
            style={[skeletonStyles.line, { width: '60%', opacity }]}
          />
          <Animated.View
            style={[skeletonStyles.line, { width: '35%', opacity, marginTop: 6 }]}
          />
        </View>
      </View>
      <Animated.View
        style={[skeletonStyles.line, { width: '100%', opacity, marginBottom: 8 }]}
      />
      <Animated.View
        style={[skeletonStyles.line, { width: '85%', opacity, marginBottom: 8 }]}
      />
      <Animated.View
        style={[skeletonStyles.line, { width: '45%', opacity }]}
      />
      <View style={skeletonStyles.mediaBlock}>
        <Animated.View
          style={[skeletonStyles.mediaPlaceholder, { opacity }]}
        />
      </View>
    </View>
  );

  return (
    <View style={skeletonStyles.container}>
      {Array.from({ length: count }, (_, i) => renderSkeleton(i))}
    </View>
  );
};

const skeletonStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  headerLines: {
    marginLeft: 10,
    flex: 1,
  },
  line: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  mediaBlock: {
    marginTop: 12,
  },
  mediaPlaceholder: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
});

// ──────────────────────────────────────────
// LoadingOverlay
// ──────────────────────────────────────────

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  color?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
  color = '#c15f3c',
}) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={overlayStyles.backdrop}>
      <View style={overlayStyles.box}>
        <ActivityIndicator size="large" color={color} />
        {message && <Text style={overlayStyles.message}>{message}</Text>}
      </View>
    </View>
  </Modal>
);

const overlayStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  message: {
    marginTop: 12,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1a1a1a',
  },
});

export default LoadingSpinner;
export {
  LoadingSpinner,
  LoadingSkeleton,
  LoadingOverlay,
  LoadingSpinnerProps,
  LoadingSkeletonProps,
  LoadingOverlayProps,
};
