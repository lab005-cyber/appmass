import { account, databases, realtime } from '../lib/appwrite';
import { ID, Query } from 'react-native-appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const MESSAGES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID || 'messages';
const CONVERSATIONS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_CONVERSATIONS_COLLECTION_ID || 'conversations';
const PROFILES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID || 'profiles';

export async function createConversation(creatorId: string, participantId: string, creatorName: string, participantName: string) {
  return databases.createDocument(DATABASE_ID, CONVERSATIONS_COLLECTION_ID, ID.unique(), {
    creatorId,
    participantId,
    creatorName,
    participantName,
    lastMessage: '',
    lastMessageAt: null,
    createdAt: new Date().toISOString(),
  });
}

export async function getUserConversations(userId: string) {
  const [created, participated] = await Promise.all([
    databases.listDocuments(DATABASE_ID, CONVERSATIONS_COLLECTION_ID, [
      Query.equal('creatorId', userId),
      Query.orderDesc('lastMessageAt'),
      Query.limit(50),
    ]),
    databases.listDocuments(DATABASE_ID, CONVERSATIONS_COLLECTION_ID, [
      Query.equal('participantId', userId),
      Query.orderDesc('lastMessageAt'),
      Query.limit(50),
    ]),
  ]);
  const all = [...created.documents, ...participated.documents];
  all.sort((a, b) => {
    const aTime = a.lastMessageAt || a.createdAt;
    const bTime = b.lastMessageAt || b.createdAt;
    return bTime.localeCompare(aTime);
  });
  const seen = new Set<string>();
  return all.filter((c) => {
    if (seen.has(c.$id)) return false;
    seen.add(c.$id);
    return true;
  });
}

export async function updateConversationLastMessage(conversationId: string, content: string) {
  return databases.updateDocument(DATABASE_ID, CONVERSATIONS_COLLECTION_ID, conversationId, {
    lastMessage: content.slice(0, 100),
    lastMessageAt: new Date().toISOString(),
  });
}

export async function sendMessage(conversationId: string, content: string, senderId?: string) {
  const msg = await databases.createDocument(DATABASE_ID, MESSAGES_COLLECTION_ID, ID.unique(), {
    conversationId,
    content,
    senderId: senderId || null,
    read: false,
    createdAt: new Date().toISOString(),
  });
  await updateConversationLastMessage(conversationId, content);
  return msg;
}

export async function getConversationMessages(conversationId: string) {
  return databases.listDocuments(DATABASE_ID, MESSAGES_COLLECTION_ID, [
    Query.equal('conversationId', conversationId),
    Query.orderAsc('createdAt'),
    Query.limit(100),
  ]);
}

export async function searchProfiles(query: string) {
  if (!query.trim()) return [];
  const results = await databases.listDocuments(DATABASE_ID, PROFILES_COLLECTION_ID, [
    Query.startsWith('username', query.toLowerCase()),
    Query.limit(20),
  ]);
  return results.documents;
}

export async function getProfileByUserId(userId: string) {
  const results = await databases.listDocuments(DATABASE_ID, PROFILES_COLLECTION_ID, [
    Query.equal('userId', userId),
    Query.limit(1),
  ]);
  return results.documents[0] || null;
}

export async function getCurrentUserId() {
  const user = await account.get();
  return user.$id;
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
