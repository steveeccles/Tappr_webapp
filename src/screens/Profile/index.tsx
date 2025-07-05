import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import CardService, { CardCode } from '../../services/cardService';
import TapprHeader from '../../components/TapprHeader';
import { theme, commonStyles } from '../../styles/theme';

interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  dateIdeas: string[];
  profileImageUrl?: string;
  age?: number;
  location?: string;
}

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    dateIdeas: ['', '', ''],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [bioCharCount, setBioCharCount] = useState(0);
  const [cards, setCards] = useState<CardCode[]>([]);
  const [creatingCard, setCreatingCard] = useState(false);

  const user = auth().currentUser;

  const loadUserProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        setProfile(userData);
        setBioCharCount(userData.bio?.length || 0);
      } else {
        // Create initial profile from user data
        const initialProfile: UserProfile = {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ')[1] || '',
          username: `${user.displayName?.split(' ')[0] || 'User'}_${Math.random().toString(36).substring(2, 8)}`,
          bio: '',
          dateIdeas: ['', '', ''],
        };
        setProfile(initialProfile);
        await saveProfile(initialProfile);
      }
      
      // Load user's cards
      const userCards = await CardService.getUserCards();
      setCards(userCards);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const saveProfile = async (profileData: UserProfile = profile) => {
    if (!user) return;
    
    setSaving(true);
    try {
      await firestore().collection('users').doc(user.uid).set(profileData, { merge: true });
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImagePress = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0] && response.assets[0].uri) {
          uploadImage(response.assets[0].uri);
        }
      }
    );
  };

  const uploadImage = async (imageUri: string) => {
    if (!user) return;
    
    setImageUploading(true);
    try {
      const filename = `profile_${user.uid}_${Date.now()}.jpg`;
      const reference = storage().ref(`profile_images/${filename}`);
      
      await reference.putFile(imageUri);
      const downloadUrl = await reference.getDownloadURL();
      
      const updatedProfile = { ...profile, profileImageUrl: downloadUrl };
      setProfile(updatedProfile);
      await saveProfile(updatedProfile);
      
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleBioChange = (text: string) => {
    if (text.length <= 300) {
      setProfile({ ...profile, bio: text });
      setBioCharCount(text.length);
    }
  };

  const handleDateIdeaChange = (text: string, index: number) => {
    const updatedDateIdeas = [...profile.dateIdeas];
    updatedDateIdeas[index] = text;
    setProfile({ ...profile, dateIdeas: updatedDateIdeas });
  };

  const handleFieldChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    if (!profile.firstName.trim() || !profile.bio.trim()) {
      Alert.alert('Incomplete Profile', 'Please fill in your name and bio');
      return;
    }
    await saveProfile();
    Alert.alert('Success', 'Profile saved successfully!');
  };

  const handleCreateCard = async () => {
    setCreatingCard(true);
    try {
      const newCard = await CardService.createCardCode();
      setCards(prev => [newCard, ...prev]);
      Alert.alert(
        'Card Created!', 
        `Your new card is ready. You can now program it by tapping "Program Card #${newCard.cardNumber}".`,
        [{ text: 'Got it!' }]
      );
    } catch (error) {
      console.error('Error creating card:', error);
      Alert.alert('Error', 'Failed to create card. Please try again.');
    } finally {
      setCreatingCard(false);
    }
  };

  const handleProgramCard = (card: CardCode) => {
    Alert.alert(
      'Program Card',
      `Ready to program Card #${card.cardNumber}?\n\nHold your NFC card to the back of your phone when you tap "Program".`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Program', 
          onPress: () => {
            // TODO: Implement NFC programming
            Alert.alert('Success!', 'Card programmed successfully!\n\nYour card is now ready to share.');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={commonStyles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={commonStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TapprHeader title="Your Profile" />
      <ScrollView 
        contentContainerStyle={commonStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeSubtitle}>Make a great first impression</Text>
        </View>

        {/* Profile Picture */}
        <TouchableOpacity onPress={handleImagePress} style={styles.profilePicContainer}>
          {profile.profileImageUrl ? (
            <Image source={{ uri: profile.profileImageUrl }} style={styles.profilePic} />
          ) : (
            <View style={styles.profilePicPlaceholder}>
              <Text style={styles.profilePicIcon}>📷</Text>
              <Text style={styles.profilePicText}>Add Photo</Text>
            </View>
          )}
          {imageUploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {/* Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Info</Text>
          <View style={styles.nameRow}>
            <TextInput
              style={[styles.input, styles.nameInput]}
              placeholder="First Name"
              value={profile.firstName}
              onChangeText={(text) => handleFieldChange('firstName', text)}
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, styles.nameInput]}
              placeholder="Last Name"
              value={profile.lastName}
              onChangeText={(text) => handleFieldChange('lastName', text)}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About You</Text>
            <Text style={styles.charCount}>{bioCharCount}/300</Text>
          </View>
          <TextInput
            style={styles.bioInput}
            placeholder="Tell people about yourself, your interests, what makes you unique..."
            value={profile.bio}
            onChangeText={handleBioChange}
            multiline
            placeholderTextColor="#999"
            textAlignVertical="top"
          />
        </View>

        {/* Date Ideas Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date Ideas</Text>
          <Text style={styles.sectionSubtitle}>
            What would you love to do on a first date?
          </Text>
          {profile.dateIdeas.map((idea, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={`Date idea #${index + 1}`}
              value={idea}
              onChangeText={(text) => handleDateIdeaChange(text, index)}
              maxLength={60}
              placeholderTextColor="#999"
            />
          ))}
        </View>

        {/* Card Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Cards</Text>
          <Text style={styles.sectionSubtitle}>
            Create and manage your Tappr cards
          </Text>
          
          {/* Create New Card Button */}
          <TouchableOpacity 
            style={[styles.createCardButton, creatingCard && styles.createCardButtonDisabled]}
            onPress={handleCreateCard}
            disabled={creatingCard}
          >
            {creatingCard ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.createCardButtonText}>+ Create New Card</Text>
            )}
          </TouchableOpacity>

          {/* Cards List */}
          {cards.length > 0 ? (
            <View style={styles.cardsList}>
              {cards.map((card) => (
                <View key={card.id} style={styles.cardItem}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>Card #{card.cardNumber}</Text>
                    <Text style={styles.cardStats}>
                      {card.tapCount} taps • Created {card.createdAt.toLocaleDateString()}
                    </Text>
                    <Text style={styles.cardStatus}>
                      {card.active ? '🟢 Active' : '🔴 Inactive'}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.programButton}
                    onPress={() => handleProgramCard(card)}
                  >
                    <Text style={styles.programButtonText}>Program</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noCards}>
              <Text style={styles.noCardsText}>No cards created yet</Text>
              <Text style={styles.noCardsSubtext}>Create your first card to get started!</Text>
            </View>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Profile</Text>
          )}
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  welcomeSection: {
    paddingTop: theme.spacing.base,
    paddingBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  welcomeSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.gray,
    textAlign: 'center',
  },
  profilePicContainer: {
    alignSelf: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  profilePic: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#FF6B6B',
  },
  profilePicPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  profilePicIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  profilePicText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameInput: {
    flex: 1,
  },

  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  bioInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#e9ecef',
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 40,
  },
  createCardButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  createCardButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createCardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardsList: {
    gap: 12,
  },
  cardItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardStats: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  programButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  programButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noCards: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  noCardsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  noCardsSubtext: {
    fontSize: 14,
    color: '#999',
  },
});
