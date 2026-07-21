import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  error?: string;
  icon?: React.ReactNode;
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCorrect?: boolean;
  autoComplete?: string;
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  multiline = false,
  error,
  icon,
  maxLength,
  autoCapitalize = 'none',
  keyboardType = 'default',
  autoCorrect,
  autoComplete,
  editable,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const inputContainerStyles = [
    styles.inputContainer,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    multiline && styles.inputMultiline,
  ];

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={inputContainerStyles}
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
      >
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <TextInput
          ref={inputRef}
          style={[styles.input, multiline && styles.inputMultilineText]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onFocus={() => { setIsFocused(true); onFocus?.(); }}
          onBlur={() => { setIsFocused(false); onBlur?.(); }}
          autoCorrect={autoCorrect}
          autoComplete={autoComplete as any}
          editable={editable}
        />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: '#c15f3c',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 12,
    alignItems: 'flex-start',
  },
  iconWrap: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#1a1a1a',
    paddingVertical: 12,
  },
  inputMultilineText: {
    minHeight: 100,
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
    marginLeft: 2,
  },
});

export default Input;
export { Input, InputProps };
