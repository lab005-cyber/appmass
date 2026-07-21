import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
} from 'lucide-react-native';

type VoiceCallParams = {
  VoiceCall: {
    userId: string;
    userName: string;
    incoming?: boolean;
  };
};

export function VoiceCallScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<VoiceCallParams, 'VoiceCall'>>();
  const { userId, userName, incoming } = route.params;

  const [isIncoming] = useState(incoming ?? false);
  const [isCallActive, setIsCallActive] = useState(!isIncoming);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const durationInterval = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (isCallActive) {
      durationInterval.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, [isCallActive]);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    navigation.goBack();
  };

  const handleAcceptCall = () => {
    setIsCallActive(true);
  };

  const initials = userName
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.avatarContainer,
            !isCallActive && { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </Animated.View>

        <Text style={styles.userName}>{userName}</Text>

        <Text style={styles.callStatus}>
          {isIncoming && !isCallActive
            ? 'Incoming Call...'
            : isCallActive
            ? formatDuration(callDuration)
            : 'Calling...'}
        </Text>

        {!isCallActive && !isIncoming && (
          <View style={styles.callingAnimation}>
            <View style={styles.callingDot} />
            <View style={[styles.callingDot, styles.callingDotDelay]} />
            <View style={[styles.callingDot, styles.callingDotDelay2]} />
          </View>
        )}
      </View>

      {isIncoming && !isCallActive ? (
        <View style={styles.incomingActions}>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={handleEndCall}
          >
            <View style={styles.declineButtonInner}>
              <PhoneOff size={28} color="#ffffff" />
            </View>
            <Text style={styles.actionLabel}>Decline</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={handleAcceptCall}
          >
            <View style={styles.acceptButtonInner}>
              <Phone size={28} color="#ffffff" />
            </View>
            <Text style={styles.actionLabel}>Accept</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.activeCallActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsMuted(!isMuted)}
          >
            <View
              style={[
                styles.actionButtonCircle,
                isMuted && styles.actionButtonActive,
              ]}
            >
              {isMuted ? (
                <MicOff size={24} color="#ffffff" />
              ) : (
                <Mic size={24} color="#ffffff" />
              )}
            </View>
            <Text style={styles.actionLabel}>
              {isMuted ? 'Unmute' : 'Mute'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEndCall}
          >
            <View style={[styles.actionButtonCircle, styles.endCallCircle]}>
              <PhoneOff size={28} color="#ffffff" />
            </View>
            <Text style={styles.actionLabel}>End Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsSpeakerOn(!isSpeakerOn)}
          >
            <View
              style={[
                styles.actionButtonCircle,
                isSpeakerOn && styles.actionButtonActive,
              ]}
            >
              <Volume2 size={24} color="#ffffff" />
            </View>
            <Text style={styles.actionLabel}>
              {isSpeakerOn ? 'On' : 'Off'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  avatarContainer: {
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 48,
    color: '#ffffff',
  },
  userName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 8,
  },
  callStatus: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 20,
  },
  callingAnimation: {
    flexDirection: 'row',
    gap: 6,
  },
  callingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c15f3c',
  },
  callingDotDelay: {
    opacity: 0.5,
  },
  callingDotDelay2: {
    opacity: 0.25,
  },
  incomingActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
    paddingBottom: 60,
    paddingHorizontal: 32,
  },
  activeCallActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingBottom: 60,
    paddingHorizontal: 32,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: '#c15f3c',
  },
  acceptButton: {
    alignItems: 'center',
    gap: 8,
  },
  acceptButtonInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButton: {
    alignItems: 'center',
    gap: 8,
  },
  declineButtonInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ef4444',
  },
  actionLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#ffffff',
  },
});
