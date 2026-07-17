import { messaging, realtime, databases } from '../../config/appwrite';
import { ID, Query } from 'react-native-appwrite';

export async function createConversation(participants: string[]) {
  return messaging.createConversation(ID.unique(), 'direct', participants);
}

export async function sendMessage(conversationId: string, content: string) {
  return messaging.createMessage(conversationId, ID.unique(), content);
}

export function subscribeToMessages(conversationId: string, callback: (msg: any) => void) {
  return realtime.subscribe(
    `databases.${process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID}.collections.messages.documents`,
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
