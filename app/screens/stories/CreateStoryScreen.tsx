import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { X, Image as ImageIcon, Camera, Type } from 'lucide-react-native';

export function CreateStoryScreen() {
  const navigation = useNavigation();
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showTextOverlay, setShowTextOverlay] = useState(false);

  const handlePickFromGallery = async () => {
    try {
      const { launchImageLibraryAsync, MediaTypeOptions } =
        await import('expo-image-picker');
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!result.canceled && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.warn('Image picker not available');
    }
  };

  const handleCapture = async () => {
    try {
      const { launchCameraAsync, MediaTypeOptions } =
        await import('expo-image-picker');
      const result = await launchCameraAsync({
        mediaTypes: MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!result.canceled && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.warn('Camera not available');
    }
  };

  const handleShareToStory = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <X size={24} color="#ffffff" />
        </TouchableOpacity>
        <TextInput
          style={styles.captionInput}
          placeholder="Add a caption..."
          placeholderTextColor="#9ca3af"
          value={caption}
          onChangeText={setCaption}
        />
      </View>

      {selectedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          {showTextOverlay && (
            <View style={styles.textOverlayPlaceholder}>
              <Text style={styles.textOverlayPlaceholderText}>
                Double tap to edit text
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.textOverlayButton}
            onPress={() => setShowTextOverlay(!showTextOverlay)}
          >
            <Type size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cameraPreview}>
          <Camera size={64} color="rgba(255,255,255,0.3)" />
          <Text style={styles.cameraHint}>
            Camera preview placeholder
          </Text>
        </View>
      )}

      {selectedImage ? (
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareToStory}
          activeOpacity={0.9}
        >
          <Text style={styles.shareButtonText}>Share to Story</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={handlePickFromGallery}
          >
            <ImageIcon size={24} color="#ffffff" />
            <Text style={styles.galleryButtonText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <View style={styles.galleryButton} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionInput: {
    flex: 1,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#ffffff',
  },
  cameraPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
  },
  cameraHint: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 12,
  },
  previewContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  textOverlayPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textOverlayPlaceholderText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  textOverlayButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  galleryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  galleryButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#ffffff',
    marginTop: 4,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  shareButton: {
    backgroundColor: '#c15f3c',
    marginHorizontal: 16,
    marginBottom: 40,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  shareButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});
