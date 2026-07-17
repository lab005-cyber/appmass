import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const AVATAR_PALETTE = [
  '#c15f3c',
  '#e67e22',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#1abc9c',
  '#e74c3c',
  '#f39c12',
  '#16a085',
  '#2980b9',
];

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  isOnline?: boolean;
  showBadge?: boolean;
  badgeColor?: string;
  onPress?: () => void;
}

const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const Avatar: React.FC<AvatarProps> = ({
  uri,
  name = '?',
  size = 48,
  isOnline = false,
  showBadge = false,
  badgeColor = '#c15f3c',
  onPress,
}) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : '?';
  const bgColor = AVATAR_PALETTE[hashCode(name) % AVATAR_PALETTE.length];
  const badgeSize = size * 0.32;
  const onlineDotSize = size * 0.28;
  const borderRadius = size / 2;

  const content = (
    <View style={[styles.container, { width: size, height: size }]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: size, height: size, borderRadius }]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            { width: size, height: size, borderRadius, backgroundColor: bgColor },
          ]}
        >
          <Text
            style={[
              styles.letter,
              { fontSize: size * 0.42 },
            ]}
          >
            {firstLetter}
          </Text>
        </View>
      )}
      {isOnline && (
        <View
          style={[
            styles.onlineDot,
            {
              width: onlineDotSize,
              height: onlineDotSize,
              borderRadius: onlineDotSize / 2,
              bottom: 0,
              right: 0,
            },
          ]}
        />
      )}
      {showBadge && (
        <View
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: badgeColor,
              bottom: isOnline ? onlineDotSize * -0.4 : 0,
              right: 0,
            },
          ]}
        >
          <Text
            style={[
              styles.checkmark,
              { fontSize: badgeSize * 0.6 },
            ]}
          >
            ✓
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: '#ffffff',
    fontFamily: 'Poppins_600SemiBold',
  },
  onlineDot: {
    position: 'absolute',
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  checkmark: {
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold',
  },
});

export default Avatar;
export { Avatar, AvatarProps };
