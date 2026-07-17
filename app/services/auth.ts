import { account } from '../../config/appwrite';
import { ID } from 'react-native-appwrite';

export async function signUp(email: string, password: string, name: string) {
  return account.create(ID.unique(), email, password, name);
}

export async function login(email: string, password: string) {
  return account.createEmailSession(email, password);
}

export async function logout() {
  return account.deleteSession('current');
}

export async function getCurrentUser() {
  return account.get();
}

export async function sendPhoneVerification(phone: string) {
  return account.createPhoneVerification();
}
