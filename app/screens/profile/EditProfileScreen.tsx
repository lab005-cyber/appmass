import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { validateUsername } from '../../utils/helpers';
import { ProfileStackParamList } from '../../navigation/MainNavigator';

export function EditProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [displayName, setDisplayName] = useState('User Name');
  const [username, setUsername] = useState('username');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePickImage = async (
    setter: (uri: string | null) => void,
    source: 'camera' | 'gallery'
  ) => {
    let result: ImagePicker.ImagePickerResult;

    if (source === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Camera access is required.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });
    } else {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Gallery access is required.');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setter(result.assets[0].uri);
    }
  };

  const showImagePicker = (setter: (uri: string | null) => void) => {
    Alert.alert('Change Photo', 'Choose a source', [
      { text: 'Camera', onPress: () => handlePickImage(setter, 'camera') },
      { text: 'Gallery', onPress: () => handlePickImage(setter, 'gallery') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(username.trim())) {
      newErrors.username =
        'Username must be 3-30 characters (letters, numbers, underscores)';
    }
    if (bio.length > 150) {
      newErrors.bio = 'Bio must be 150 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    Alert.alert('Saved', 'Your profile has been updated.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.photoSection}>
            <View style={styles.coverContainer}>
              <View style={[styles.coverPreview, coverUri ? { backgroundColor: '#c15f3c' } : {}]}>
                <View style={styles.coverEditOverlay}>
                  <TouchableOpacity
                    style={styles.coverEditButton}
                    onPress={() => showImagePicker(setCoverUri)}
                  >
                    <Camera size={24} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>U</Text>
                </View>
                <TouchableOpacity
                  style={styles.cameraOverlay}
                  onPress={() => showImagePicker(setAvatarUri)}
                >
                  <Camera size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Display Name</Text>
              <TextInput
                style={[styles.input, errors.displayName ? styles.inputError : null]}
                placeholder="Display Name"
                placeholderTextColor="#9ca3af"
                value={displayName}
                onChangeText={setDisplayName}
              />
              {errors.displayName && (
                <Text style={styles.errorText}>{errors.displayName}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={[styles.input, errors.username ? styles.inputError : null]}
                placeholder="Username"
                placeholderTextColor="#9ca3af"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Bio{' '}
                <Text style={styles.charCount}>
                  ({bio.length}/150)
                </Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.bioInput,
                  errors.bio ? styles.inputError : null,
                ]}
                placeholder="Tell us about yourself"
                placeholderTextColor="#9ca3af"
                value={bio}
                onChangeText={setBio}
                multiline
                maxLength={150}
                textAlignVertical="top"
              />
              {errors.bio && (
                <Text style={styles.errorText}>{errors.bio}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Website</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com"
                placeholderTextColor="#9ca3af"
                value={website}
                onChangeText={setWebsite}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="City, Country"
                placeholderTextColor="#9ca3af"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f4f3ee',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1a1a1a',
  },
  saveText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#c15f3c',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  photoSection: {
    marginBottom: 20,
  },
  coverContainer: {
    height: 150,
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  coverPreview: {
    flex: 1,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverEditOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverEditButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: -44,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#f4f3ee',
  },
  avatarText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 34,
    color: '#ffffff',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#c15f3c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f4f3ee',
  },
  formSection: {
    paddingHorizontal: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#1a1a1a',
    marginLeft: 2,
  },
  charCount: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#9ca3af',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  bioInput: {
    minHeight: 100,
    paddingTop: 14,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#ef4444',
    marginLeft: 2,
  },
  saveButton: {
    backgroundColor: '#c15f3c',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});
