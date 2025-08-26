import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  type?: 'text' | 'email' | 'password' | 'number';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  type = 'text',
  ...props
}) => {
  const { currentTheme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      default:
        return 'default';
    }
  };

  const handleRightIconPress = () => {
    if (type === 'password') {
      setShowPassword(!showPassword);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const getRightIconName = (): keyof typeof Ionicons.glyphMap => {
    if (type === 'password') {
      return showPassword ? 'eye-off' : 'eye';
    }
    return rightIcon || 'chevron-forward';
  };

  return (
    <View style={[containerStyle]}>
      {label && (
        <Text 
          style={[
            styles.label,
            {
              color: currentTheme.colors.textSecondary,
              ...currentTheme.typography.textStyles.footnote,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: currentTheme.colors.surface,
            borderColor: error 
              ? currentTheme.colors.error 
              : isFocused 
                ? currentTheme.colors.primary 
                : currentTheme.colors.border,
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={currentTheme.colors.textTertiary}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          {...props}
          style={[
            styles.input,
            {
              color: currentTheme.colors.text,
              ...currentTheme.typography.textStyles.body,
            },
            inputStyle,
          ]}
          placeholderTextColor={currentTheme.colors.textTertiary}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          keyboardType={getKeyboardType()}
          secureTextEntry={type === 'password' && !showPassword}
        />
        
        {(rightIcon || type === 'password') && (
          <TouchableOpacity onPress={handleRightIconPress} style={styles.rightIcon}>
            <Ionicons
              name={getRightIconName()}
              size={20}
              color={currentTheme.colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text 
          style={[
            styles.errorText,
            {
              color: currentTheme.colors.error,
              ...currentTheme.typography.textStyles.caption1,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
    padding: 4,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
});