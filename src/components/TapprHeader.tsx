import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme, commonStyles } from '../styles/theme';

interface TapprHeaderProps {
  title?: string;
  showLogo?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const TapprHeader: React.FC<TapprHeaderProps> = ({
  title,
  showLogo = true,
  showBackButton = false,
  onBackPress,
  rightComponent,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {/* Left Side - Back Button or Spacer */}
        <View style={styles.leftContainer}>
          {showBackButton ? (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={onBackPress}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.spacer} />
          )}
        </View>

        {/* Center - Logo and Title */}
        <View style={styles.centerContainer}>
          {showLogo ? (
            <Image 
              source={require('../assets/tapprLogoBnBG.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          ) : title ? (
            <Text style={styles.title}>{title}</Text>
          ) : null}
        </View>

        {/* Right Side - Custom Component or Spacer */}
        <View style={styles.rightContainer}>
          {rightComponent || <View style={styles.spacer} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    ...commonStyles.header,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  leftContainer: {
    width: 60,
    alignItems: 'flex-start',
  },
  
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  rightContainer: {
    width: 60,
    alignItems: 'flex-end',
  },
  
  spacer: {
    width: 40,
    height: 40,
  },
  
  logoImage: {
    height: 50,
    width: 50,
  },
  
  title: {
    ...commonStyles.headerTitle,
    marginTop: theme.spacing.xs,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  backIcon: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.black,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default TapprHeader; 