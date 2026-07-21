import { databases, storage } from '../lib/appwrite';
import { Query, ID } from 'react-native-appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const POSTS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!;
const BUCKET_ID = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!;

export async function createPost(content: string, mediaIds: string[], hashtags: string[], authorId?: string) {
  return databases.createDocument(DATABASE_ID, POSTS_COLLECTION_ID, ID.unique(), {
    content,
    mediaIds,
    hashtags,
    authorId: authorId || null,
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date().toISOString(),
  });
}

export async function getFeed(page: number = 1, limit: number = 10) {
  return databases.listDocuments(DATABASE_ID, POSTS_COLLECTION_ID, [
    Query.orderDesc('createdAt'),
    Query.limit(limit),
    Query.offset((page - 1) * limit),
  ]);
}

export async function likePost(postId: string, userId: string, reactionType: string = 'like') {
  return databases.createDocument(DATABASE_ID, POSTS_COLLECTION_ID + '_likes', ID.unique(), {
    postId,
    userId,
    reactionType,
  });
}

export async function unlikePost(postId: string, userId: string) {
  const likes = await databases.listDocuments(DATABASE_ID, POSTS_COLLECTION_ID + '_likes', [
    Query.equal('postId', postId),
    Query.equal('userId', userId),
    Query.limit(1),
  ]);
  if (likes.documents.length > 0) {
    return databases.deleteDocument(DATABASE_ID, POSTS_COLLECTION_ID + '_likes', likes.documents[0].$id);
  }
}

export async function uploadMedia(file: any) {
  return storage.createFile(BUCKET_ID, ID.unique(), file);
}
