import { useAppSelector, useAppDispatch } from './useAppDispatch';
import { loginUser, signupUser, logoutUser, fetchCurrentUser, clearError } from '../store/slices/authSlice';
import { useEffect } from 'react';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: (email: string, password: string) => dispatch(loginUser({ email, password })),
    signup: (email: string, password: string, name: string) => dispatch(signupUser({ email, password, name })),
    logout: () => dispatch(logoutUser()),
    clearError: () => dispatch(clearError()),
  };
}
