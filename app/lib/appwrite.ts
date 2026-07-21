import { Client, Account, Databases, Storage, Functions, Messaging, Teams, Avatars, Realtime } from 'react-native-appwrite';

const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '6a574108002067b4d857';

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const messaging = new Messaging(client);
export const teams = new Teams(client);
export const avatars = new Avatars(client);
export const realtime = new Realtime(client);

export default client;
