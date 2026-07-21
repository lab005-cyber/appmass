import { databases, realtime, messaging } from '../../app/lib/appwrite';
import { ID, Query } from 'react-native-appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const MESSAGES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID || 'messages';

export async function createConversation(participants: string[]) {
  return messaging.createConversation(ID.unique(), 'direct', participants);
}

export async function sendMessage(conversationId: string, content: string, senderId?: string) {
  return databases.createDocument(DATABASE_ID, MESSAGES_COLLECTION_ID, ID.unique(), {
    conversationId,
    content,
    senderId: senderId || null,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

export function subscribeToMessages(conversationId: string, callback: (msg: any) => void) {
  return realtime.subscribe(
    `databases.${DATABASE_ID}.collections.${MESSAGES_COLLECTION_ID}.documents`,
    (response) => {
      if (response.payload.conversationId === conversationId) {
        callback(response.payload);
      }
    }
  );
}

export function subscribeToTyping(conversationId: string, callback: (data: any) => void) {
  return realtime.subscribe(`conversations.${conversationId}.typing`, callback);
}

export async function sendTypingIndicator(conversationId: string) {
  return realtime.send(`conversations.${conversationId}.typing`, { typing: true });
}
