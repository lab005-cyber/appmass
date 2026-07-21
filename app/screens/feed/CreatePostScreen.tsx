import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { X, Camera, ImageIcon, Plus, MapPin } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAuth } from '../../hooks/useAuth';
import { extractHashtags } from '../../utils/helpers';
import { createPost } from '../../services/posts';
import { FeedStackParamList } from '../../navigation/MainNavigator';

export function CreatePostScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackParamList>>();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [mediaUris, setMediaUris] = useState<string[]>([]);
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  const detectedHashtags = extractHashtags(content);

  const handlePickMedia = async (source: 'camera' | 'gallery') => {
    if (mediaUris.length >= 10) {
      Alert.alert('Limit reached', 'You can add up to 10 media files.');
      return;
    }

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
        allowsMultipleSelection: false,
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
        allowsMultipleSelection: true,
        selectionLimit: 10 - mediaUris.length,
      });
    }

    if (!result.canceled && result.assets) {
      const newUris = result.assets.map((a) => a.uri);
      setMediaUris((prev) => [...prev, ...newUris].slice(0, 10));
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUris((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions((prev) => [...prev, '']);
    }
  };

  const handlePollOptionChange = (text: string, index: number) => {
    setPollOptions((prev) => {
      const updated = [...prev];
      updated[index] = text;
      return updated;
    });
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const showMediaPicker = () => {
    Alert.alert('Add Media', 'Choose a source', [
      { text: 'Camera', onPress: () => handlePickMedia('camera') },
      { text: 'Gallery', onPress: () => handlePickMedia('gallery') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handlePost = async () => {
    if (!content.trim() && mediaUris.length === 0) return;
    try {
      await createPost(content.trim(), mediaUris, detectedHashtags, user?.$id);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to create post');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity
          style={[styles.postButton, (!content.trim() && mediaUris.length === 0) && styles.postButtonDisabled]}
          onPress={handlePost}
          disabled={!content.trim() && mediaUris.length === 0}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.contentInput}
          placeholder="What's on your mind?"
          placeholderTextColor="#6b7280"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        {detectedHashtags.length > 0 && (
          <View style={styles.hashtagChips}>
            {detectedHashtags.map((tag) => (
              <View key={tag} style={styles.chip}>
                <Text style={styles.chipText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {mediaUris.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.mediaPreviewScroll}
            contentContainerStyle={styles.mediaPreviewContent}
          >
            {mediaUris.map((uri, index) => (
              <View key={`${uri}-${index}`} style={styles.mediaPreviewItem}>
                <Image source={{ uri }} style={styles.mediaPreviewImage} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => handleRemoveMedia(index)}
                >
                  <X size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.toolRow}>
          <TouchableOpacity style={styles.toolButton} onPress={showMediaPicker}>
            <ImageIcon size={20} color="#c15f3c" />
            <Text style={styles.toolButtonText}>Add Media</Text>
          </TouchableOpacity>

          <View style={styles.pollToggle}>
            <Text style={styles.pollToggleText}>Add Poll</Text>
            <Switch
              value={showPoll}
              onValueChange={setShowPoll}
              trackColor={{ false: '#d0d0d0', true: '#c15f3c' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {showPoll && (
          <View style={styles.pollSection}>
            <Text style={styles.pollSectionTitle}>Poll Options</Text>
            {pollOptions.map((option, index) => (
              <View key={index} style={styles.pollOptionRow}>
                <TextInput
                  style={styles.pollOptionInput}
                  placeholder={`Option ${index + 1}`}
                  placeholderTextColor="#6b7280"
                  value={option}
                  onChangeText={(text) => handlePollOptionChange(text, index)}
                />
                {pollOptions.length > 2 && (
                  <TouchableOpacity onPress={() => handleRemovePollOption(index)}>
                    <X size={18} color="#6b7280" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {pollOptions.length < 5 && (
              <TouchableOpacity style={styles.addPollOption} onPress={handleAddPollOption}>
                <Plus size={18} color="#c15f3c" />
                <Text style={styles.addPollOptionText}>Add option</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ee',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f4f3ee',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e0',
  },
  cancelButton: {
    paddingVertical: 4,
    paddingRight: 12,
  },
  cancelText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#6b7280',
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#1a1a1a',
  },
  postButton: {
    backgroundColor: '#c15f3c',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  contentInput: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    minHeight: 160,
    lineHeight: 24,
  },
  hashtagChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    backgroundColor: '#f0e6e0',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  chipText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#c15f3c',
  },
  mediaPreviewScroll: {
    marginTop: 12,
  },
  mediaPreviewContent: {
    gap: 8,
  },
  mediaPreviewItem: {
    position: 'relative',
  },
  mediaPreviewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#e5e5e0',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#c15f3c',
  },
  pollToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pollToggleText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1a1a1a',
  },
  pollSection: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
  },
  pollSectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  pollOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  pollOptionInput: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1a1a1a',
    backgroundColor: '#f4f3ee',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addPollOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  addPollOptionText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#c15f3c',
  },
});
