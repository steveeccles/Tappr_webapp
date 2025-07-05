// screens/Dashboard/index.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useNavigation, CommonActions, useNavigationState, NavigationProp } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CardService, { CardAnalytics } from '../../services/cardService';
import TapprHeader from '../../components/TapprHeader';
import { theme, commonStyles } from '../../styles/theme';

interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  dateIdeas: string[];
  profileImageUrl?: string;
}

export default function DashboardScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analytics, setAnalytics] = useState<CardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const user = auth().currentUser;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      // Load user profile
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      }

      // Load analytics
      const cardAnalytics = await CardService.getCardAnalytics();
      setAnalytics(cardAnalytics);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={commonStyles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <TapprHeader title="Dashboard" />

      <ScrollView style={commonStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Welcome back{profile?.firstName ? `, ${profile.firstName}` : ''}!
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Here's how your Tappr cards are performing
          </Text>
        </View>

        {/* Analytics Cards */}
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsNumber}>
              {analytics?.totalTaps || 0}
            </Text>
            <Text style={styles.analyticsLabel}>Total Taps</Text>
          </View>
          
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsNumber}>
              {analytics?.uniqueVisitors || 0}
            </Text>
            <Text style={styles.analyticsLabel}>Unique Visitors</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Recent Activity</Text>
          {analytics?.lastTapped ? (
            <View style={styles.activityItem}>
              <Text style={styles.activityIcon}>👀</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Someone viewed your profile</Text>
                <Text style={styles.activityTime}>
                  {analytics.lastTapped.toLocaleDateString()}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.noActivity}>
              <Text style={styles.noActivityText}>No activity yet</Text>
              <Text style={styles.noActivitySubtext}>
                Share your cards to start getting views!
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Profile');
              }}
            >
              <Text style={styles.quickActionIcon}>👤</Text>
              <Text style={styles.quickActionText}>Edit Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => {
                // @ts-ignore  
                navigation.navigate('Profile');
              }}
            >
              <Text style={styles.quickActionIcon}>🎴</Text>
              <Text style={styles.quickActionText}>Manage Cards</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={commonStyles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeSection: {
    paddingVertical: theme.spacing.xl,
  },
  welcomeTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.gray,
  },
  analyticsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.base,
    marginBottom: theme.spacing['2xl'],
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.base,
  },
  analyticsNumber: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  analyticsLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray,
    textAlign: 'center',
  },
  // Using commonStyles.section and commonStyles.sectionTitle
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  noActivity: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  noActivityText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  noActivitySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});
