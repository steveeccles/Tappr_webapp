import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TapprHeader from '../../components/TapprHeader';
import { theme, commonStyles } from '../../styles/theme';
import auth from '@react-native-firebase/auth';
import { signOut } from '../../services/auth';
import CardService from '../../services/cardService';

interface SubscriptionStatus {
  isActive: boolean;
  plan: 'free' | 'premium';
  expiresAt?: Date;
}

export default function SettingsScreen() {
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    isActive: false,
    plan: 'free'
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [programmingCard, setProgrammingCard] = useState(false);
  
  const navigation = useNavigation();
  const user = auth().currentUser;

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // For now, simulate subscription status
      // In production, this would check Firebase/Stripe
      setSubscription({
        isActive: true, // Simulate active subscription for demo
        plan: 'premium',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Navigation will be handled by auth state change
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  const handleNFCProgramming = async () => {
    if (!subscription.isActive) {
      Alert.alert(
        'Premium Feature',
        'NFC programming is only available for premium subscribers. Upgrade to program your own cards with any NFC tag!',
        [
          { text: 'Maybe Later', style: 'cancel' },
                     { text: 'Upgrade Now', onPress: handleUpgrade }
        ]
      );
      return;
    }

    Alert.alert(
      'Program NFC Card',
      'This feature allows you to program any NFC tag with your Tappr profile.\n\n1. Get a blank NFC tag from Amazon\n2. Hold it to the back of your phone\n3. Tap "Program" below\n\nYour card will be ready to share!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Program Card', 
          onPress: () => startNFCProgramming()
        }
      ]
    );
  };

  const startNFCProgramming = async () => {
    setProgrammingCard(true);
    try {
      // Create a new card code
      const newCard = await CardService.createCardCode();
      const cardUrl = CardService.getCardUrl(newCard.code);
      
      // TODO: Implement actual NFC writing
      // For now, just simulate the process
      await new Promise<void>(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Card Programmed Successfully!',
        `Your NFC card is now ready to share!\n\nCard URL: ${cardUrl}\n\nAnyone who taps this card will see your profile and can choose to chat or arrange a date.`,
        [{ text: 'Awesome!' }]
      );
    } catch (error) {
      console.error('Error programming card:', error);
      Alert.alert('Error', 'Failed to program card. Please try again.');
    } finally {
      setProgrammingCard(false);
    }
  };

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to Premium',
      'Premium features include:\n\n• Program unlimited NFC cards\n• Advanced analytics\n• Priority support\n• Exclusive card designs\n\nOnly £12.99/month',
      [
        { text: 'Not Now', style: 'cancel' },
        { text: 'Upgrade', onPress: () => {
          // TODO: Implement subscription flow
          Alert.alert('Coming Soon', 'Subscription system will be implemented soon!');
        }}
      ]
    );
  };

  if (loading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={commonStyles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <TapprHeader title="Settings" />

      <ScrollView style={commonStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Subscription Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionPlan}>
                {subscription.plan === 'premium' ? '🌟 Premium' : '🆓 Free'}
              </Text>
              <Text style={styles.subscriptionStatus}>
                {subscription.isActive ? 'Active' : 'Inactive'}
              </Text>
              {subscription.expiresAt && (
                <Text style={styles.subscriptionExpiry}>
                  Expires: {subscription.expiresAt.toLocaleDateString()}
                </Text>
              )}
            </View>
            {subscription.plan === 'free' && (
              <TouchableOpacity 
                style={styles.upgradeButton}
                onPress={handleUpgrade}
              >
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* NFC Programming */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Programming</Text>
          <TouchableOpacity 
            style={[
              styles.settingItem,
              !subscription.isActive && styles.settingItemDisabled
            ]}
            onPress={handleNFCProgramming}
            disabled={programmingCard}
          >
            <View style={styles.settingContent}>
              <Text style={[
                styles.settingTitle,
                !subscription.isActive && styles.settingTitleDisabled
              ]}>
                📱 Program NFC Card
              </Text>
              <Text style={[
                styles.settingDescription,
                !subscription.isActive && styles.settingDescriptionDisabled
              ]}>
                {subscription.isActive 
                  ? 'Program any NFC tag with your profile'
                  : 'Premium feature - Program unlimited cards'
                }
              </Text>
            </View>
            {programmingCard ? (
              <ActivityIndicator size="small" color="#FF6B6B" />
            ) : (
              <Text style={styles.settingArrow}>
                {subscription.isActive ? '→' : '🔒'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>🔔 Notifications</Text>
              <Text style={styles.settingDescription}>
                Get notified when someone views your profile
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e9ecef', true: '#FF6B6B' }}
              thumbColor={notificationsEnabled ? '#fff' : '#fff'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>❓ Help & Support</Text>
              <Text style={styles.settingDescription}>
                Get help with your Tappr account
              </Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>🔒 Privacy Policy</Text>
              <Text style={styles.settingDescription}>
                View our privacy policy
              </Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, styles.signOutItem]}
            onPress={handleSignOut}
          >
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, styles.signOutText]}>
                🚪 Sign Out
              </Text>
              <Text style={styles.settingDescription}>
                Sign out of your account
              </Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSpacer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  subscriptionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionPlan: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subscriptionStatus: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 2,
  },
  subscriptionExpiry: {
    fontSize: 12,
    color: '#666',
  },
  upgradeButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  settingItemDisabled: {
    opacity: 0.6,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingTitleDisabled: {
    color: '#999',
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  settingDescriptionDisabled: {
    color: '#999',
  },
  settingArrow: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  signOutItem: {
    borderColor: '#ffebee',
    backgroundColor: '#ffebee',
  },
  signOutText: {
    color: '#f44336',
  },
  bottomSpacing: {
    height: 40,
  },
}); 