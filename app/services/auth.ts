import { account } from '../lib/appwrite';
import { ID } from 'react-native-appwrite';
import { Platform } from 'react-native';

export async function signUp(email: string, password: string, name: string) {
  return account.create(ID.unique(), email, password, name);
}

export async function login(email: string, password: string) {
  return account.createEmailPasswordSession(email, password);
}

export async function logout() {
  return account.deleteSession('current');
}

export async function getCurrentUser() {
  return account.get();
}

export async function sendPhoneVerification(phone: string) {
  return account.createPhoneVerification(phone);
}

export async function loginWithGoogle() {
  const redirectUri = Platform.OS === 'web'
    ? window.location.origin
    : 'appmass://';
  return account.createOAuth2Session('google', redirectUri, redirectUri);
}

export function getOAuthCallbackParams(): { userId?: string; secret?: string } {
  if (Platform.OS !== 'web') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    userId: params.get('userId') || undefined,
    secret: params.get('secret') || undefined,
  };
}

export async function completeOAuthSession(userId: string, secret: string) {
  return account.createSession(userId, secret);
}

export function cleanOAuthCallbackUrl() {
  if (Platform.OS === 'web') {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}
