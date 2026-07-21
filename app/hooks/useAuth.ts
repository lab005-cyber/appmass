import { useAppSelector, useAppDispatch } from './useAppDispatch';
import { loginUser, signupUser, logoutUser, fetchCurrentUser, clearError } from '../store/slices/authSlice';
import { useEffect, useRef } from 'react';
import { loginWithGoogle, getOAuthCallbackParams, completeOAuthSession, cleanOAuthCallbackUrl } from '../services/auth';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);
  const oauthProcessed = useRef(false);

  useEffect(() => {
    if (oauthProcessed.current) return;
    oauthProcessed.current = true;

    const { userId, secret } = getOAuthCallbackParams();
    if (userId && secret) {
      completeOAuthSession(userId, secret)
        .then(() => {
          cleanOAuthCallbackUrl();
          dispatch(fetchCurrentUser());
        })
        .catch(() => {
          cleanOAuthCallbackUrl();
          dispatch(fetchCurrentUser());
        });
    } else {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: (email: string, password: string) => dispatch(loginUser({ email, password })),
    signup: (email: string, password: string, name: string) => dispatch(signupUser({ email, password, name })),
    logout: () => dispatch(logoutUser()),
    loginWithGoogle: () => loginWithGoogle(),
    clearError: () => dispatch(clearError()),
  };
}
