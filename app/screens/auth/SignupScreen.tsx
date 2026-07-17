import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { clearError } from '../../store/slices/authSlice';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

export function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { signup, loading, error } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validate = (): boolean => {
    const errors: string[] = [];

    if (!name.trim()) {
      errors.push('Name is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errors.push('Please enter a valid email address');
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (!termsAccepted) {
      errors.push('You must accept the Terms of Service');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSignup = () => {
    if (validate()) {
      signup(email.trim(), password, name.trim());
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.heading}>Join appmass</Text>
          </View>

          {(error || validationErrors.length > 0) ? (
            <View style={styles.errorContainer}>
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}
              {validationErrors.map((err, index) => (
                <Text key={index} style={styles.errorText}>{err}</Text>
              ))}
            </View>
          ) : null}

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <Text style={styles.requirements}>
              Password must be at least 8 characters
            </Text>

            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  termsAccepted && styles.checkboxActive,
                ]}
                onPress={() => setTermsAccepted(!termsAccepted)}
              >
                {termsAccepted ? (
                  <Text style={styles.checkMark}>✓</Text>
                ) : null}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the Terms of Service
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.signupButton, loading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signupButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ee',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  heading: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 32,
    color: '#1a1a1a',
  },
  errorContainer: {
    backgroundColor: '#fde8e8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 4,
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#c0392b',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  requirements: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#999',
    marginTop: -8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#c15f3c',
    borderColor: '#c15f3c',
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#666',
  },
  signupButton: {
    backgroundColor: '#c15f3c',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  footerText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#c15f3c',
  },
});
