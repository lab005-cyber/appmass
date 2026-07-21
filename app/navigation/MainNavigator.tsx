import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, MessageCircle, PlusSquare, Bell, User } from 'lucide-react-native';
import { FeedScreen } from '../screens/feed/FeedScreen';
import { ExploreScreen } from '../screens/feed/ExploreScreen';
import { PostDetailScreen } from '../screens/feed/PostDetailScreen';
import { CreatePostScreen } from '../screens/feed/CreatePostScreen';
import { ConversationsScreen } from '../screens/chat/ConversationsScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { PrivacyScreen } from '../screens/settings/PrivacyScreen';
import { StoriesScreen } from '../screens/stories/StoriesScreen';
import { CreateStoryScreen } from '../screens/stories/CreateStoryScreen';
import { VoiceCallScreen } from '../screens/calls/VoiceCallScreen';

export type MainTabParamList = {
  FeedTab: undefined;
  ChatTab: undefined;
  CreateTab: undefined;
  NotificationsTab: undefined;
  ProfileTab: undefined;
};

export type FeedStackParamList = {
  Feed: undefined;
  Explore: undefined;
  PostDetail: { postId: string };
  CreatePost: undefined;
  Stories: undefined;
  CreateStory: undefined;
};

export type ChatStackParamList = {
  Conversations: undefined;
  Chat: { conversationId: string; userId: string };
  VoiceCall: { userId: string; userName: string; incoming?: boolean };
};

export type ProfileStackParamList = {
  Profile: { userId?: string };
  EditProfile: undefined;
  Settings: undefined;
  Privacy: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const FeedStack = createNativeStackNavigator<FeedStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function FeedNavigator() {
  return (
    <FeedStack.Navigator screenOptions={{ headerShown: false }}>
      <FeedStack.Screen name="Feed" component={FeedScreen} />
      <FeedStack.Screen name="Explore" component={ExploreScreen} />
      <FeedStack.Screen name="PostDetail" component={PostDetailScreen} />
      <FeedStack.Screen name="CreatePost" component={CreatePostScreen} />
      <FeedStack.Screen name="Stories" component={StoriesScreen} />
      <FeedStack.Screen name="CreateStory" component={CreateStoryScreen} />
    </FeedStack.Navigator>
  );
}

function ChatNavigator() {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="Conversations" component={ConversationsScreen} />
      <ChatStack.Screen name="Chat" component={ChatScreen} />
      <ChatStack.Screen name="VoiceCall" component={VoiceCallScreen} />
    </ChatStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="Privacy" component={PrivacyScreen} />
    </ProfileStack.Navigator>
  );
}

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#c15f3c',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Poppins_500Medium',
        },
      }}
    >
      <Tab.Screen
        name="FeedTab"
        component={FeedNavigator}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatNavigator}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="CreateTab"
        component={CreatePostScreen}
        options={{
          tabBarLabel: 'Post',
          tabBarIcon: ({ color, size }) => <PlusSquare color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
          tabBarBadge: undefined,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
