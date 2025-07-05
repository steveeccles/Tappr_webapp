import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import { getCurrentUser, signOut } from '../services/auth';
import { getUserDoc } from '../services/firebase';
interface DashboardProps { navigation?: any; }

const DashboardScreen: React.FC<DashboardProps> = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      loadUserData(currentUser.uid);
    }
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      setLoading(true);
      const doc = await getUserDoc(userId);
      setUserData(doc.exists() ? doc.data() : {});
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation will automatically redirect to SignIn due to auth state change
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleRefresh = async () => {
    if (user) {
      await loadUserData(user.uid);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No user signed in</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Tappr! 🎉</Text>
        
        <View style={styles.userInfo}>
          <Text style={styles.subtitle}>User Information</Text>
          <Text style={styles.infoText}>Name: {user.displayName || 'Not set'}</Text>
          <Text style={styles.infoText}>Email: {user.email}</Text>
          <Text style={styles.infoText}>UID: {user.uid}</Text>
        </View>

        {userData && Object.keys(userData).length > 0 && (
          <View style={styles.userData}>
            <Text style={styles.subtitle}>User Data from Firestore</Text>
            <Text style={styles.dataText}>
              {JSON.stringify(userData, null, 2)}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button 
            title={loading ? "Loading..." : "Refresh Data"} 
            onPress={handleRefresh}
            disabled={loading}
          />
          <View style={styles.buttonSpacer} />
          <Button 
            title="Sign Out" 
            onPress={handleSignOut}
            color="#ff4444"
          />
        </View>

        <View style={styles.features}>
          <Text style={styles.subtitle}>Available Features</Text>
          <Text style={styles.featureText}>✅ Email/Password Authentication</Text>
          <Text style={styles.featureText}>✅ User Profile Management</Text>
          <Text style={styles.featureText}>✅ Firestore Database Integration</Text>
          <Text style={styles.featureText}>✅ Password Reset</Text>
          <Text style={styles.featureText}>✅ Secure Sign Out</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  userInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  userData: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dataText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  buttonSpacer: {
    height: 12,
  },
  features: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
});

export default DashboardScreen; 