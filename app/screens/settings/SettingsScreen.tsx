import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/MainNavigator';
import {
  ChevronRight,
  User,
  Lock,
  Eye,
  Bell,
  Sun,
  Globe,
  Shield,
  Monitor,
  Users,
  HelpCircle,
  AlertTriangle,
  Info,
  Trash2,
} from 'lucide-react-native';

interface SettingsItem {
  icon: React.ReactNode;
  label: string;
  type: 'navigate' | 'toggle';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  isDestructive?: boolean;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [notifications, setNotifications] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const sections: SettingsSection[] = [
    {
      title: 'Account',
      items: [
        {
          icon: <User size={20} color="#6b7280" />,
          label: 'Edit Profile',
          type: 'navigate',
          onPress: () => navigation.navigate('EditProfile'),
        },
        {
          icon: <Lock size={20} color="#6b7280" />,
          label: 'Change Password',
          type: 'navigate',
          onPress: () => Alert.alert('Coming Soon', 'Change Password is not yet available.'),
        },
        {
          icon: <Eye size={20} color="#6b7280" />,
          label: 'Privacy',
          type: 'navigate',
          onPress: () => navigation.navigate('Privacy'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Bell size={20} color="#6b7280" />,
          label: 'Notifications',
          type: 'toggle',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: <Sun size={20} color="#6b7280" />,
          label: 'Dark Mode',
          type: 'toggle',
          value: isDarkMode,
          onToggle: setIsDarkMode,
        },
        {
          icon: <Globe size={20} color="#6b7280" />,
          label: 'Language',
          type: 'navigate',
          onPress: () => Alert.alert('Coming Soon', 'Language settings are not yet available.'),
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          icon: <Shield size={20} color="#6b7280" />,
          label: 'Two-Factor Auth',
          type: 'navigate',
          onPress: () => Alert.alert('Coming Soon', 'Two-Factor Authentication is not yet available.'),
        },
        {
          icon: <Monitor size={20} color="#6b7280" />,
          label: 'Active Sessions',
          type: 'navigate',
          onPress: () => Alert.alert('Coming Soon', 'Active Sessions is not yet available.'),
        },
        {
          icon: <Users size={20} color="#6b7280" />,
          label: 'Blocked Users',
          type: 'navigate',
          onPress: () => Alert.alert('Coming Soon', 'Blocked Users is not yet available.'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle size={20} color="#6b7280" />,
          label: 'Help Center',
          type: 'navigate',
          onPress: () => Alert.alert('Coming Soon', 'Help Center is not yet available.'),
        },
        {
          icon: <AlertTriangle size={20} color="#6b7280" />,
          label: 'Report a Problem',
          type: 'navigate',
          onPress: () => Alert.alert('Coming Soon', 'Report a Problem is not yet available.'),
        },
        {
          icon: <Info size={20} color="#6b7280" />,
          label: 'About appmass',
          type: 'navigate',
          onPress: () => Alert.alert('About appmass', 'appmass v1.0.0\n\nA social media platform built with React Native and Appwrite.'),
        },
      ],
    },
    {
      title: '',
      items: [
        {
          icon: <Trash2 size={20} color="#ef4444" />,
          label: 'Delete Account',
          type: 'navigate',
          isDestructive: true,
          onPress: () => Alert.alert(
            'Delete Account',
            'Are you sure you want to permanently delete your account? This action cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Coming Soon', 'Account deletion is not yet available.') },
            ]
          ),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            {section.title !== '' && (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            )}
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingsRow,
                    itemIndex < section.items.length - 1 && styles.settingsRowBorder,
                  ]}
                  onPress={item.type === 'navigate' ? item.onPress : undefined}
                  activeOpacity={item.type === 'navigate' ? 0.7 : 1}
                >
                  <View style={styles.settingsRowLeft}>
                    {item.icon}
                    <Text
                      style={[
                        styles.settingsLabel,
                        item.isDestructive && styles.destructiveLabel,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {item.type === 'navigate' && (
                    <ChevronRight
                      size={18}
                      color={item.isDestructive ? '#ef4444' : '#d1d5db'}
                    />
                  )}
                  {item.type === 'toggle' && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: '#e5e7eb', true: '#c15f3c80' }}
                      thumbColor={item.value ? '#c15f3c' : '#f4f3ee'}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    color: '#c15f3c',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f4f3ee',
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#1a1a1a',
  },
  destructiveLabel: {
    color: '#ef4444',
    fontFamily: 'Poppins_600SemiBold',
  },
});
